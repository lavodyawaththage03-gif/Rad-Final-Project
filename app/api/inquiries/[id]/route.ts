import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Inquiry } from '@/lib/models/Inquiry';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(req: Request, context: any) {
  try {
    const params = await context.params;
    const { id } = params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { status } = await req.json();
    const inquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ inquiry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
