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
}, { timestamps: true });

const Group = models.Group || model('Group', GroupSchema);

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { params } = await context;
  const { id } = params;
  const data = await req.json();
  const group = await Group.findByIdAndUpdate(
    id,
    { name: data.name, properties: data.properties, photo: data.photo || '' },
    { new: true }
  );
  return NextResponse.json({ success: !!group, group });
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { params } = await context;
  const { id } = params;
  const result = await Group.findByIdAndDelete(id);
  return NextResponse.json({ success: !!result });
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const { params } = await context;
  const { id } = params;
  const group = await Group.findById(id).populate('properties');
  if (!group) {
    return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, group });
}