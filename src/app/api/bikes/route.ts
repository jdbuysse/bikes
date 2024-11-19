import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Single bike fetch
      const { rows } = await sql`
        SELECT * FROM bikes WHERE id = ${id}
      `;
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Bike not found' }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    }

    // List all bikes
    const { rows } = await sql`SELECT * FROM bikes ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    return NextResponse.json({ error: 'Failed to fetch bikes' }, { status: 500 });
  }
}

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