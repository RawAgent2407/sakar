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

const imageSchema = new mongoose.Schema({
  url: String,
  name: String,
  data: String,
}, { _id: false });

const articleSchema = new mongoose.Schema({
  title: String,
  author: String,
  date: String,
  readTime: String,
  content: [String],
  images: [imageSchema],
  featured: Boolean,
  coverImage: imageSchema,
}, { timestamps: true });

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema, 'articles');

export async function GET() {
  try {
    await connectDB();
    const articles = await Article.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, articles });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const article = await Article.create(data);
    return NextResponse.json({ success: true, article });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    if (!data._id) return NextResponse.json({ success: false, message: 'Missing article ID' }, { status: 400 });
    const article = await Article.findByIdAndUpdate(data._id, { ...data, updatedAt: new Date() }, { new: true });
    return NextResponse.json({ success: true, article });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ success: false, message: 'Missing article ID' }, { status: 400 });
    await Article.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 