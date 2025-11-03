import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { Unkempt } from 'next/font/google';
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const user = await User.findById({ _id: params.id });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user,{status:200});
  } catch (error:unknown) {
    console.log(error);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
