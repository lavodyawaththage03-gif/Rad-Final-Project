import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MedicineRequest } from '@/lib/models/MedicineRequest';
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
    const { status, adminNotes } = await req.json();
    const request = await MedicineRequest.findByIdAndUpdate(id, { status, adminNotes }, { new: true });
    return NextResponse.json({ request });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
