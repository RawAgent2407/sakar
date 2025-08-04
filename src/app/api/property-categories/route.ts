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

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const Category = mongoose.models.PropertyCategory || mongoose.model('PropertyCategory', categorySchema, 'propertycategories');

// Ensure default categories exist
async function ensureDefaultCategories() {
  const defaults = ['Residential', 'Commercial'];
  for (const name of defaults) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({ name });
    }
  }
}

export async function GET() {
  try {
    await connectDB();
    await ensureDefaultCategories();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name } = await req.json();
    if (!name) return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 });
    const existing = await Category.findOne({ name });
    if (existing) return NextResponse.json({ success: false, message: 'Category already exists' }, { status: 400 });
    const category = await Category.create({ name });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, name } = await req.json();
    if (!id || !name) return NextResponse.json({ success: false, message: 'ID and name are required' }, { status: 400 });
    const existing = await Category.findOne({ name });
    if (existing) return NextResponse.json({ success: false, message: 'Category name already exists' }, { status: 400 });
    const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
