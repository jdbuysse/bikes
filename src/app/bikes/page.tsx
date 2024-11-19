import { sql } from '@vercel/postgres';
import Image from 'next/image';
import Link from 'next/link';

// Make this a server component since we're fetching data
async function getBikes() {
  try {
    const { rows } = await sql`SELECT * FROM bikes ORDER BY created_at DESC`;
    return rows.map(bike => ({
      ...bike,
      price: parseFloat(bike.price),
      quantity: parseInt(bike.quantity)
    }));
  } catch (error) {
    console.error('Error fetching bikes:', error);
    throw error;
  }
}

export default async function BikesPage() {
  const bikes = await getBikes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Bikes</h1>
        <Link 
          href="/"
          className="text-blue-500 hover:text-blue-600"
        >
          Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <div 
            key={bike.id} 
            className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow"
          >
            <Link href={`/bikes/${bike.id}`}>
              {bike.image_url && (
                <div className="relative w-full h-48">
                  <Image
                    src={bike.image_url}
                    alt={bike.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{bike.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{bike.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ${bike.price.toFixed(2)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    bike.quantity > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bike.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 