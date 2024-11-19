import { sql } from '@vercel/postgres';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

export default async function BikeDetailPage({ params }: { params: { id: string } }) {
  const bike = await getBike(params.id);
  
  if (!bike) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/bikes"
        className="text-blue-500 hover:text-blue-600 mb-8 inline-block"
      >
        ← Back to Bikes
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        {bike.image_url && (
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={bike.image_url}
              alt={bike.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{bike.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${bike.price.toFixed(2)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              bike.quantity > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {bike.quantity > 0 ? `${bike.quantity} in stock` : 'Out of Stock'}
            </span>
          </div>
          
          <div className="prose prose-sm max-w-none mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600">{bike.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Details</h2>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="text-gray-900 capitalize">{bike.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Rating</dt>
                <dd className="text-gray-900">{bike.rating} / 5</dd>
              </div>
            </dl>
          </div>
          
          <AddToCartButton inStock={bike.quantity > 0} />
        </div>
      </div>
    </div>
  );
} 