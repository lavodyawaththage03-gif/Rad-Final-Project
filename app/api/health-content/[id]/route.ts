import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { HealthContent } from '@/lib/models/HealthContent';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(req: Request, context: any) {
  try {
    const params = await context.params;
    const { id } = params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    await HealthContent.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
