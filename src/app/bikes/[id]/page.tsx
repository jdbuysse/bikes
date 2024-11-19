import { sql } from '@vercel/postgres';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Generate static paths at build time
export async function generateStaticParams() {
  try {
    const { rows } = await sql`SELECT id FROM bikes`;
    return rows.map((bike) => ({
      id: bike.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bike = await getBike(params.id);
  
  if (!bike) {
    return {
      title: 'Bike Not Found',
    };
  }

  return {
    title: `${bike.name} - Bike Store`,
    description: bike.description,
  };
}

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