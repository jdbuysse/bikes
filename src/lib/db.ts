import { sql } from '@vercel/postgres';

export async function createBikesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS bikes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        rating DECIMAL(3,2) DEFAULT 0,
        price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Bikes table created successfully');
  } catch (error) {
    console.error('Error creating bikes table:', error);
    throw error;
  }
}

export async function getBikes() {
  try {
    const { rows } = await sql`SELECT * FROM bikes`;
    return rows;
  } catch (error) {
    console.error('Error fetching bikes:', error);
    throw error;
  }
}