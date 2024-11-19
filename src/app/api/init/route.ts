import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

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
