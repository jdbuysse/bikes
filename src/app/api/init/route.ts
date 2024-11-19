import { createBikesTable } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await createBikesTable();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (err) {
    console.error('Error initializing database:', err);
    return NextResponse.json(
      { error: 'Failed to initialize database', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}