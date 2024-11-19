import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { Bike } from '@/types/bike';

// GET all bikes
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM bikes ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    return NextResponse.json({ error: 'Failed to fetch bikes' }, { status: 500 });
  }
}

// POST new bike
export async function POST(request: Request) {
  try {
    const bike = await request.json();
    const { rows } = await sql`
      INSERT INTO bikes (
        name, description, rating, price, quantity, type, image_url
      ) VALUES (
        ${bike.name}, 
        ${bike.description}, 
        ${bike.rating}, 
        ${bike.price}, 
        ${bike.quantity}, 
        ${bike.type},
        ${bike.imageUrl}
      )
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error creating bike:', error);
    return NextResponse.json({ error: 'Failed to create bike' }, { status: 500 });
  }
}

// PUT update bike
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bike = await request.json();
    const { rows } = await sql`
      UPDATE bikes 
      SET 
        name = ${bike.name},
        description = ${bike.description},
        rating = ${bike.rating},
        price = ${bike.price},
        quantity = ${bike.quantity},
        type = ${bike.type},
        image_url = ${bike.imageUrl},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `;
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating bike:', error);
    return NextResponse.json({ error: 'Failed to update bike' }, { status: 500 });
  }
}

// DELETE bike
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM bikes WHERE id = ${params.id}`;
    return NextResponse.json({ message: 'Bike deleted successfully' });
  } catch (error) {
    console.error('Error deleting bike:', error);
    return NextResponse.json({ error: 'Failed to delete bike' }, { status: 500 });
  }
}