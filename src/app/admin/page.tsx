'use client';

import { useState, useEffect } from 'react';
import { Bike } from '@/types/bike';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const response = await fetch('/api/bikes');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bikes');
      }
      const data = await response.json();
      setBikes(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bikeId: string) => {
    if (!confirm('Are you sure you want to delete this bike?')) return;

    try {
      const response = await fetch(`/api/bikes/${bikeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bike');
      }

      // Refresh the bikes list after successful deletion
      fetchBikes();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete bike');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bike Store Admin</h1>
        <Link 
          href="/"
          className="text-blue-500 hover:text-blue-700"
        >
          Back to Home
        </Link>
      </div>
      
      <div className="mb-6">
        <Link
          href="/admin/bikes/new"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Add New Bike
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.length === 0 ? (
          <p className="text-gray-500">No bikes in inventory yet.</p>
        ) : (
          bikes.map((bike) => (
            <div key={bike.id} className="border rounded-lg p-6 shadow-sm">
              {bike.imageUrl && (
                <div className="relative w-full h-48 mb-4">
                  <Image 
                    src={bike.imageUrl} 
                    alt={bike.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2">{bike.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{bike.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">${bike.price}</span>
                <span className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-full font-medium">
                  Stock: {bike.quantity}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/bikes/${bike.id}/edit`}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Edit
                </Link>
                <button 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(bike.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}