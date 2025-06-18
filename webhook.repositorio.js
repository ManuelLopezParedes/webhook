//Configuración de base de datos
const { MongoClient } = require("mongodb");
require('dotenv').config();

var url = process.env.url
const client = new MongoClient(url);
const dataBase = "webhook";
const collectionName = "webhooks";

async function getCollectionAsync() {
    await client.connect();
    const db = client.db(dataBase);
    const collection = db.collection(collectionName);

    return collection;
}

async function agregarAsync(webhook) {
    const collection = await getCollectionAsync();
    let resultado = await collection.insertOne(webhook)
}

async function obtenerTodosAsync() {
    const collection = await getCollectionAsync()
    var query = {}
    const sort = {
        'fechaDeRegistro': -1
    }

    const limit = 100
    var resultado = await collection.find(query, { sort, limit }).toArray()
    console.log(resultado)

    return resultado
}

module.exports = {
    agregarAsync,
    obtenerTodosAsync
}