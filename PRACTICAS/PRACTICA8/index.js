const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const uri = "mongodb+srv://sinaimendoza2004_db_user:b6kuSwhe3Mb0yILa@cluster0.tnxrvj4.mongodb.net/?appName=Cluster0";

let client;
let database;
let collection;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectDB() {
  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000
    });

    await client.connect();
    console.log("Conectado a MongoDB");

    database = client.db("practica8");
    collection = database.collection("proyectos");

  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
  }
}

// Endpoint para insertar múltiples proyectos (Práctica 8)
app.post("/receipt/insert", async (req, res) => {
  console.log("Petición recibida");

  try {
    const proyectos = req.body;

    if (!Array.isArray(proyectos)) {
      return res.status(400).json({
        error: "El body debe ser un arreglo de objetos",
      });
    }

    if (!collection) {
      return res.status(500).json({
        error: "No hay conexión a MongoDB",
      });
    }

    const result = await collection.insertMany(proyectos);

    res.json({
      message: `${result.insertedCount} proyectos insertados correctamente`,
    });

  } catch (error) {
    console.error("Error en endpoint:", error);
    res.status(500).json({
      error: "Error al insertar",
      details: error.message,
    });
  }
});

// Iniciar servidor
app.listen(3000, async () => {
  console.log("Servidor corriendo en http://localhost:3000");
  await connectDB();
});