require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// Tu URI de conexión a MongoDB Atlas
const uri = "mongodb+srv://sinaimendoza2004_db_user:b6kuSwhe3Mb0yILa@cluster0.tnxrvj4.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

// Función para encriptar contraseñas en SHA256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Usuarios de prueba (adaptado para ti, Jireth)
const rawUsers = [
    { usuario: 'jireth@mail.com', password: '123456', name: 'Jireth' },
    { usuario: 'quetzal@mail.com', password: '654321', name: 'Quetzal' },
    { usuario: 'luis@mail.com', password: 'abc123', name: 'Luis' },
    { usuario: 'maria@mail.com', password: 'pass789', name: 'Maria' },
    { usuario: 'eliot@mail.com', password: 'qwerty', name: 'Eliot' }
];

async function run() {
    try {
        await client.connect();

        const db = client.db('practica10');
        const usuariosCol = db.collection('usuarios');

        // Limpiar colección antes de insertar
        await usuariosCol.deleteMany({});

        console.log("Creando usuarios...");

        for (const user of rawUsers) {
            const nuevo = {
                usuario: user.usuario,
                password: hashPassword(user.password),
                name: user.name,
                telegramChatId: "5783948170",
                deleted: false,
                created: new Date()
            };

            await usuariosCol.insertOne(nuevo);
            console.log(`Usuario '${user.usuario}' creado`);
        }

        console.log("\nSe insertaron 5 usuarios correctamente para Jireth");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();