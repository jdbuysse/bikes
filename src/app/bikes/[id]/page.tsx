/* eslint-disable @typescript-eslint/no-explicit-any */

import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

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

export default async function BikePage({ params }: any) {
  const bike: any = await getBike(params.id);
  
  if (!bike) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/bikes"
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Bikes
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {bike.image_url && (
              <div className="relative aspect-square">
                <Image
                  src={bike.image_url}
                  alt={bike.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{bike.name}</h1>
              <p className="text-gray-600 mb-6">{bike.description}</p>
              
              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Price</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${bike.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Availability</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    bike.quantity > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bike.quantity > 0 ? `${bike.quantity} in stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <AddToCartButton inStock={bike.quantity > 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 