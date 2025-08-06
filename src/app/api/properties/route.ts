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

const gallerySchema = new mongoose.Schema({
  url: String, // for backward compatibility or external images
  data: String, // base64 image data
  name: String,
}, { _id: false });

const videoSchema = new mongoose.Schema({
  url: String,
  name: String,
}, { _id: false });

const keyHighlightsSchema = new mongoose.Schema({
  reraApproved: Boolean,
  reraNumber: { type: String, default: '' },
  possessionDate: String,
  unitConfiguration: String,
  carpetArea: {
    from: String,
    to: String,
    unit: { type: String, default: 'sqft' }
  },
  otherAmenities: [String],
  igbcGoldCertified: Boolean,
  igbcLevel: { type: String, enum: ['', 'Certified', 'Silver', 'Gold', 'Platinum'], default: '' },
}, { _id: false });

const propertySchema = new mongoose.Schema({
  name: String,
  tagline: String,
  propertyType: String,
  location: String, // area
  priceRange: {
    from: {
      value: String,
      unit: { type: String, enum: ['Lac', 'Cr'], default: 'Lac' }
    },
    to: {
      value: String,
      unit: { type: String, enum: ['Lac', 'Cr'], default: 'Lac' }
    }
  },
  builder: {
    developerName: String,
    websiteUrl: String,
  },
  keyHighlights: keyHighlightsSchema,
  gallery: [gallerySchema],
  videos: [videoSchema],
  locationAdvantage: {
    address: String,
    addressUrl: String,
    advantages: [String],
  },
  featuredDevelopment: {
    text: String,
    images: [gallerySchema],
  },
  otherProjects: [String],
  trendingScore: Number,
  featured: Boolean,
  home: Boolean,
  status: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema, 'properties');

export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, properties });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const property = await Property.create(data);
    return NextResponse.json({ success: true, property });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    if (!data._id) return NextResponse.json({ success: false, message: 'Missing property ID' }, { status: 400 });
    // If this property is being marked as home, unset 'home' for all others
    if (data.home === true) {
      await Property.updateMany({ _id: { $ne: data._id } }, { $set: { home: false } });
    }
    let updateQuery;
    if (data.trendingScore === undefined || data.trendingScore === null || data.trendingScore === '') {
      updateQuery = { $set: { ...data, updatedAt: new Date() }, $unset: { trendingScore: 1 } };
    } else {
      updateQuery = { $set: { ...data, updatedAt: new Date() } };
    }
    const property = await Property.findByIdAndUpdate(
      data._id,
      updateQuery,
      { new: true }
    );
    return NextResponse.json({ success: true, property });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ success: false, message: 'Missing property ID' }, { status: 400 });
    await Property.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 