// deleteFacultyUsers.mjs

import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function deleteAllFacultyUsers() {
  try {
    await client.connect();
    const database = client.db("internship_portal");
    const collection = database.collection("facultyusers");

    const result = await collection.deleteMany({});
    console.log(`${result.deletedCount} document(s) deleted from facultyusers.`);
  } catch (err) {
    console.error("Error deleting documents:", err);
  } finally {
    await client.close();
  }
}

deleteAllFacultyUsers();
