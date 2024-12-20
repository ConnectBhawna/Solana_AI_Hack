export interface Product {
    id: string;
    name: string;
    price: number;
    inventory: number;
    description: string;
  }
  
  export const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Coke',
      price: 0.05,
      inventory: 100,
      description: 'Refreshing cola drink'
    },
    {
      id: '2',
      name: 'Doritos',
      price: 0.07,
      inventory: 75,
      description: 'Crunchy nacho cheese flavored chips'
    },
    {
      id: '3',
      name: 'Water Bottle',
      price: 0.03,
      inventory: 150,
      description: 'Pure spring water'
    },
    {
      id: '4',
      name: 'Energy Bar',
      price: 0.06,
      inventory: 50,
      description: 'Nutritious snack bar'
    }
  ];
  
  