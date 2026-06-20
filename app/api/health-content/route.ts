import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { HealthContent } from '@/lib/models/HealthContent';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await connectDB();
    const content = await HealthContent.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { title, category, content, imageUrl } = await req.json();
    const newContent = await HealthContent.create({ title, category, content, imageUrl, publishedBy: user.userId });
    return NextResponse.json({ content: newContent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}
