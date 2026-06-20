import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { SystemStatus } from '@/lib/models/SystemStatus';
import { AdminProfile } from '@/lib/models/AdminProfile';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    let status = await SystemStatus.findOne();
    if (!status) {
      status = await SystemStatus.create({ crowdLevel: 'Low' });
    }
    return NextResponse.json({ status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { crowdLevel } = await req.json();
    let status = await SystemStatus.findOne();
    if (!status) {
      status = await SystemStatus.create({ crowdLevel, lastUpdatedBy: user.userId });
    } else {
      status.crowdLevel = crowdLevel;
      status.lastUpdatedBy = user.userId as any;
      await status.save();
    }
    return NextResponse.json({ status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
