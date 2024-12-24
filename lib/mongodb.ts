import { MongoClient } from 'mongodb';

const uri = '';
const client = new MongoClient(uri);

export async function connectToDatabase() {
    await client.connect()
  
    const db = client.db('SolanaStoreInventory')
    return { db, client }
  }
  
  export async function getInventory() {
    const { db } = await connectToDatabase()
    const collection = db.collection('Inventory')
    return await collection.find({}).toArray()
  }