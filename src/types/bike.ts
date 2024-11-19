export interface Bike {
    id: string;
    name: string;
    description: string;
    rating: number;
    price: number;
    quantity: number;
    type: 'road' | 'mountain' | 'hybrid' | 'electric';
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }