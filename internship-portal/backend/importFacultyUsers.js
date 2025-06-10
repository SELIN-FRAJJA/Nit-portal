import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/internship_portal';

// FacultyUser schema and model (same as in server.js)
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import mongoosePkg from 'mongoose';
const { Schema, model } = mongoosePkg;

const FacultyUserSchema = new Schema({
  facultyName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  passwordHash: { type: String, required: true }
});
const FacultyUser = model('FacultyUser', FacultyUserSchema);

// Read JSON file
const facultyListPath = path.join(__dirname, '../NIT_Trichy_Faculty_List.json');
const facultyList = JSON.parse(fs.readFileSync(facultyListPath, 'utf-8'));

async function importFacultyUsers() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const password = 'nitt123';
    const passwordHash = await bcrypt.hash(password, 10);

    for (const faculty of facultyList) {
    const { Name: facultyName, Email: email, Department: department } = faculty;
    const phone = '0000000000'; // Placeholder phone number

    // Check if user already exists
    const existingUser = await FacultyUser.findOne({ email });
    if (existingUser) {
      console.log(`User with email ${email} already exists. Skipping.`);
      continue;
    }

    const newUser = new FacultyUser({
      facultyName,
      phone,
      email,
      department,
      passwordHash
    });

    await newUser.save();
    console.log(`Created user: ${facultyName} (${email})`);
    }

    console.log('Import completed.');
    // Gracefully close the mongoose connection instead of process.exit
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error importing faculty users:', err);
    // Gracefully close the mongoose connection instead of process.exit
    await mongoose.connection.close();
  }
}

importFacultyUsers();
