const { MongoClient } = require('mongodb');

async function listDatabases(client) {
    const databasesList = await client.db("admin").admin().listDatabases();
    console.log("Bases de datos:");
    databasesList.databases.forEach(function(db) {
        console.log(" - " + db.name);
    });
}

async function findAllData(client) {
    const db = client.db("sample_mflix");

    console.log("\n=============================================");
    console.log("Primeras 5 películas:");
    console.log("=============================================\n");

    const cursor = await db.collection("movies").find({}).limit(5);
    const results = await cursor.toArray();

    console.log(JSON.stringify(results, null, 2));

    console.log("\nTítulos de las películas:");
    results.forEach(function(peli) {
        console.log(" - " + peli.title);
    });
}

async function main() {
    // Credenciales
    const usuario = encodeURIComponent("sinaimendoza2004_db_user");
    const password = encodeURIComponent("b6kuSwhe3Mb0yILa");

    // URI
    const uri = `mongodb+srv://${usuario}:${password}@cluster0.tnxrvj4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    const client = new MongoClient(uri);

    try {
        console.log("Conectando a MongoDB Atlas...");
        await client.connect();
        console.log("Conexión exitosa");

        await listDatabases(client);
        await findAllData(client);

    } catch (e) {
        console.error("Error detectado:", e.message);
    } finally {
        await client.close();
    }
}

// Llama a la función principal para ejecutar el script
main().catch(console.error);