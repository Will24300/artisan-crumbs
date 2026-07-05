import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const updateStock = async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const productsCollection = db.collection('products');

    // Update products without stock field
    const result1 = await productsCollection.updateMany(
      { stock: { $exists: false } },
      { $set: { stock: 20 } }
    );
    console.log(`Updated ${result1.modifiedCount} products without stock field to 20`);

    // Update products with stock: 0
    const result2 = await productsCollection.updateMany(
      { stock: 0 },
      { $set: { stock: 20 } }
    );
    console.log(`Updated ${result2.modifiedCount} products with stock 0 to 20`);

    await client.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateStock();
