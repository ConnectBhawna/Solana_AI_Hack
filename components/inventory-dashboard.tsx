'use client'

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { getInventory } from '@/lib/mongodb';

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
  description: string;
}

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, inventory: 0, description: '' });

  useEffect(() => {
    async function fetchData() {
      const inventory = await getInventory();
      const formattedProducts = inventory.map((item: any) => ({
        id: item._id,
        name: item.items[0].item_name,
        price: 0, // Add appropriate price if available
        inventory: item.items[0].quantity,
        description: '', // Add appropriate description if available
      }));
      setProducts(formattedProducts);
    }
    fetchData();
  }, []);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.inventory) {
      setProducts([...products, { ...newProduct, id: Date.now().toString() } as Product]);
      setNewProduct({ name: '', price: 0, inventory: 0, description: '' });
    }
  };

  const handleUpdateInventory = (id: string, change: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, inventory: Math.max(0, p.inventory + change) } : p));
  };

  const totalValue = products.reduce((sum, product) => sum + product.price * product.inventory, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.inventory}</TableCell>
              <TableCell>
                <Button onClick={() => handleUpdateInventory(product.id, 1)}><PlusIcon /></Button>
                <Button onClick={() => handleUpdateInventory(product.id, -1)}><MinusIcon /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="space-y-4">
        <Input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
        <Input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
        <Input placeholder="Inventory" type="number" value={newProduct.inventory} onChange={e => setNewProduct({ ...newProduct, inventory: parseInt(e.target.value) })} />
        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>
    </div>
  );
}