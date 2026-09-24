require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const express = require('express');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());

// Tu URI de conexión a MongoDB Atlas
const uri = "mongodb+srv://sinaimendoza2004_db_user:b6kuSwhe3Mb0yILa@cluster0.tnxrvj4.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

// HASH
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// CONEXIÓN
async function connectDB() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error:", error);
    }
}

connectDB();

// LOGIN (FASE 2)
app.post('/usuarios/valida-login', async (req, res) => {

    const { usuario, password } = req.body;

    try {
        const db = client.db('practica10');
        const usuariosCol = db.collection('usuarios');

        const hash = hashPassword(password);

        const user = await usuariosCol.findOne({
            usuario: usuario,
            password: hash,
            deleted: false
        });

        if (user) {
            return res.json({
                valido: 1,
                estado: 1,
                mensaje: "Login correcto"
            });
        } else {
            return res.json({
                valido: 0,
                estado: 0,
                mensaje: "Usuario o contraseña incorrectos"
            });
        }

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno" });
    }
});

// SERVER
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});