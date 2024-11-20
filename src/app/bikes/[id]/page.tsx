import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any;

async function getBike(id: string) {
  try {
    const { rows } = await sql`SELECT * FROM bikes WHERE id = ${id}`;
    if (rows.length === 0) return null;
    return {
      ...rows[0],
      price: parseFloat(rows[0].price),
      quantity: parseInt(rows[0].quantity)
    };
  } catch (error) {
    console.error('Error fetching bike:', error);
    throw error;
  }
}

export default async function BikePage({ params }: Props) {
  const bike = await getBike(params.id);
  
  if (!bike) {
    notFound();
  }
} 