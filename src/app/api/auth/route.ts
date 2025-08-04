import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://solankiish25:1234@cluster0.hvuwzyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'test';

// Connect to MongoDB
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  isConnected = true;
}

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String, // hashed
});
const User = mongoose.models.AdminUser || mongoose.model('AdminUser', userSchema, 'adminusers');

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Missing credentials' }, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 });
    }
    // Plain text password comparison
    if (password !== user.password) {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }
    return NextResponse.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 