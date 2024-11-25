import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Bike Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/bikes" className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
          <h2 className="text-2xl font-semibold mb-4">Customer View</h2>
          <p>Browse our selection of quality bikes</p>
        </Link>
        <Link href="/admin" className="p-6 border rounded-lg hover:border-blue-500 transition-colors">
          <h2 className="text-2xl font-semibold mb-4">Owner Dashboard</h2>
          <p>Manage your bike inventory</p>
        </Link>
      </div>
    </div>
  );
}