const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const uri = "mongodb+srv://sinaimendoza2004_db_user:b6kuSwhe3Mb0yILa@cluster0.tnxrvj4.mongodb.net/?appName=Cluster0";

let client;
let database;
let collection;
let auditCollection;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectDB() {
  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000
    });

    await client.connect();
    console.log("Conectado a MongoDB");

    database = client.db("practica9");
    collection = database.collection("proyectos");
    auditCollection = database.collection("auditoria");

  } catch (error) {
    console.error("Error conectando:", error.message);
  }
}

app.get("/", (req, res) => {
  res.json({ message: "Servidor funcionando - Practica 9 (Jireth)" });
});

app.post("/proyectos", async (req, res) => {
  try {
    const data = req.body;

    const nuevo = {
      ...data,
      id_externo: Date.now(),
      deleted: false
    };

    const result = await collection.insertOne(nuevo);

    await auditCollection.insertOne({
      accion: "CREATE",
      quien: "Jireth",
      desde: req.ip,
      cuando: new Date(),
      autorizado_por: "admin",
      descripcion: "Se insertó un nuevo proyecto"
    });

    res.json(result);

  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/proyectos", async (req, res) => {
  try {
    const data = await collection.find({ deleted: false }).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/proyectos/:id", async (req, res) => {
  try {
    const result = await collection.updateOne(
      { id_externo: parseInt(req.params.id) },
      { $set: { nombre: req.body.nombre } }
    );

    await auditCollection.insertOne({
      accion: "UPDATE",
      quien: "Jireth",
      desde: req.ip,
      cuando: new Date(),
      autorizado_por: "admin",
      descripcion: "Se actualizó el nombre del proyecto"
    });

    res.json(result);

  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/proyectos/:id", async (req, res) => {
  try {
    const result = await collection.deleteOne({
      id_externo: parseInt(req.params.id)
    });

    await auditCollection.insertOne({
      accion: "DELETE FISICO",
      quien: "Jireth",
      desde: req.ip,
      cuando: new Date(),
      autorizado_por: "admin",
      descripcion: "Se eliminó físicamente un proyecto"
    });

    res.json(result);

  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/proyectos/delete-logico/:id", async (req, res) => {
  try {
    const result = await collection.updateOne(
      { id_externo: parseInt(req.params.id) },
      { $set: { deleted: true } }
    );

    await auditCollection.insertOne({
      accion: "DELETE LOGICO",
      quien: "Jireth",
      desde: req.ip,
      cuando: new Date(),
      autorizado_por: "admin",
      descripcion: "Se marcó como eliminado lógico"
    });

    res.json(result);

  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/auditoria", async (req, res) => {
  try {
    const data = await auditCollection.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(3000, async () => {
  console.log("Servidor corriendo en http://localhost:3000");
  await connectDB();
});