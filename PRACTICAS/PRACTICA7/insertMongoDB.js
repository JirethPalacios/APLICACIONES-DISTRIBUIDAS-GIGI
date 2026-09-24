// npm install express mongodb
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const uri = "mongodb+srv://sinaimendoza2004_db_user:b6kuSwhe3Mb0yILa@cluster0.tnxrvj4.mongodb.net/?appName=Cluster0";
let database;
let collection;

// Middlewares para leer JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB Atlas
async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Conectado a MongoDB Atlas");

    database = client.db("myDatabase");
    collection = database.collection("recipes"); // Colección solicitada en la práctica

  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
}

// Endpoint de prueba inicial
app.get("/", (req, res) => {
  res.json({ message: "Servidor de la Práctica 7 funcionando correctamente" });
});

// ENDPOINT PRINCIPAL DE LA PRÁCTICA 7: Inserta un arreglo de recetas/recibos
app.post("/receipt/insert", async (req, res) => {
  try {
    const recipes = req.body;

    // Validación para asegurar que se reciba un arreglo (array)
    if (!Array.isArray(recipes)) {
      return res.status(400).json({
        error: "El body debe ser un arreglo de objetos JSON",
      });
    }

    // Inserción múltiple en MongoDB Atlas
    const result = await collection.insertMany(recipes);

    res.json({
      message: `${result.insertedCount} documentos insertados correctamente`,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Error al insertar datos",
      details: error.message,
    });
  }
});

// Iniciar servidor en el puerto 3000
app.listen(3000, async () => {
  console.log("Servidor corriendo en http://localhost:3000");
  await connectDB();
});
