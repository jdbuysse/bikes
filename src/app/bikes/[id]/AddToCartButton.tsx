'use client';

export default function AddToCartButton({ inStock }: { inStock: boolean }) {
  if (!inStock) return null;

  return (
    <button 
      className="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
      onClick={() => {
        alert('Add to cart functionality coming soon!');
      }}
    >
      Add to Cart
    </button>
  );
} 