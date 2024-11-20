import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request, context: any) {
  try {
    const bike = await request.json();
    const { rows } = await sql`
      UPDATE bikes 
      SET 
        name = ${bike.name},
        description = ${bike.description},
        price = ${bike.price},
        quantity = ${bike.quantity},
        type = ${bike.type},
        image_url = ${bike.imageUrl},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${context.params.id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Bike not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating bike:', error);
    return NextResponse.json(
      { error: 'Failed to update bike' },
      { status: 500 }
    );
  }
}