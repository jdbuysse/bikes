import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM bikes WHERE id = ${params.id}`;
    return NextResponse.json({ message: 'Bike deleted successfully' });
  } catch (error) {
    console.error('Error deleting bike:', error);
    return NextResponse.json(
      { error: 'Failed to delete bike' },
      { status: 500 }
    );
  }
}