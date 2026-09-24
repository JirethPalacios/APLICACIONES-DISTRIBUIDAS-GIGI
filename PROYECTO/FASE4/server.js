require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

// Corrige la ruta para que lea el index.html desde la misma carpeta del proyecto
app.use(express.static(__dirname)); 

const client = new MongoClient(process.env.MONGO_URI);
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

let db;

async function conectarDB() {
    await client.connect();
    db = client.db('practica10');
    console.log("Conectado a MongoDB");
}
conectarDB();

// 1. Validar Login
app.post('/usuarios/valida-login', async (req, res) => {
    const { usuario, password } = req.body;
    try {
        // Busca el usuario y valida la contraseña directa
        const user = await db.collection('usuarios').findOne({ usuario, password });
        if (user) {
            // Generar PIN aleatorio de 4 dígitos
            const pin = Math.floor(1000 + Math.random() * 9000).toString();
            
            // Guardar el PIN temporalmente en el usuario
            await db.collection('usuarios').updateOne(
                { usuario },
                { $set: { pinTemporal: pin } }
            );

            // Enviar PIN por Telegram usando el chatId registrado
            if (user.telegramChatId) {
                bot.sendMessage(user.telegramChatId, `Tu PIN de acceso es: ${pin}`);
            }

            res.json({ valido: 1, msg: "Credenciales correctas. Revisa tu Telegram." });
        } else {
            res.json({ valido: 0, msg: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ valido: 0, msg: "Error en el servidor" });
    }
});

// 2. Validar PIN
app.post('/usuarios/validar-pin', async (req, res) => {
    const { usuario, pin } = req.body;
    try {
        const user = await db.collection('usuarios').findOne({ usuario });
        if (user && user.pinTemporal === pin) {
            const sessionToken = Math.random().toString(36).substring(2);
            
            // Guardar el token de sesión y limpiar el PIN temporal
            await db.collection('usuarios').updateOne(
                { usuario },
                { $set: { sessionToken, pinTemporal: null } }
            );

            res.json({ acceso: 1, sessionToken, msg: "PIN verificado correctamente" });
        } else {
            res.json({ acceso: 0, msg: "PIN inválido" });
        }
    } catch (error) {
        res.status(500).json({ acceso: 0, msg: "Error al validar el PIN" });
    }
});

// 3. Obtener Información del Usuario (Ruta protegida)
app.get('/api/user-info/:usuario', async (req, res) => {
    const usuario = req.params.usuario;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        const user = await db.collection('usuarios').findOne({ usuario, sessionToken: token });
        if (user) {
            res.json({
                status: 1,
                usuario: user.usuario,
                nombre: user.nombre || "Sin nombre",
                creado: user.creado || "Fecha no disponible"
            });
        } else {
            res.json({ status: 0, msg: "No autorizado o sesión expirada" });
        }
    } catch (error) {
        res.status(500).json({ status: 0, msg: "Error al consultar información" });
    }
});

// 4. Cerrar sesión
app.post('/api/logout', async (req, res) => {
    const { usuario, sessionToken } = req.body;
    try {
        await db.collection('usuarios').updateOne(
            { usuario, sessionToken },
            { $set: { sessionToken: null } }
        );
        res.json({ status: 1, msg: "Sesión cerrada correctamente" });
    } catch (error) {
        res.status(500).json({ status: 0, msg: "Error al cerrar sesión" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});