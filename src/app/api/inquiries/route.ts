import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://solankiish25:1234@cluster0.hvuwzyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'test';

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  isConnected = true;
}

const inquirySchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  propertyType: String,
  propertyId: String,
  status: { type: String, default: 'new' },
  agree: Boolean,
  createdAt: { type: Date, default: Date.now },
});
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema, 'inquiries');

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const inquiry = await Inquiry.create(data);
    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error('Inquiry POST error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error('Inquiry GET error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ success: false, message: 'Missing id or status' }, { status: 400 });
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 