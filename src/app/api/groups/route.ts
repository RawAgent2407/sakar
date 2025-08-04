import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Schema, model, models } from 'mongoose';

const MONGODB_URI = 'mongodb+srv://solankiish25:1234@cluster0.hvuwzyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'test';
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  isConnected = true;
}

const GroupSchema = new Schema({
  name: { type: String, required: true },
  properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  photo: { type: String, default: '' },
}, { timestamps: true });

const Group = models.Group || model('Group', GroupSchema);

export async function GET() {
  await connectDB();
  const groups = await Group.find().populate('properties');
  return NextResponse.json({ success: true, groups });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const group = await Group.create({ name: data.name, properties: data.properties, photo: data.photo || '' });
  return NextResponse.json({ success: true, group });
} 