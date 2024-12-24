'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  price: number
  inventory: number
  description: string
}

export default function AvailableProducts() {
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [products, setProducts] = useState<Product[]>([])

  // Fetch products from your MongoDB-fueled API route
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/inventory')
        if (!res.ok) {
          throw new Error('Failed to fetch inventory')
        }
        // The response should be an array of documents matching the structure from your MongoDB collection
        const data = await res.json()
        // Map MongoDB docs to the local Product structure
        const mappedProducts: Product[] = data.map((doc: any) => ({
          id: doc._id?.$oid || doc._id?.toString() || 'no_id',
          name: doc.items?.[0]?.item_name || 'N/A',
          price: 0, // You can adjust or fetch a price field if you add it to your DB schema
          inventory: doc.items?.[0]?.quantity || 0,
          description: ''
        }))
        setProducts(mappedProducts)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  const addToCart = (product: Product) => {
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }))
  }

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const totalPrice = products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] || 0),
    0
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Products</h2>
        <Card>
          <CardContent className="flex items-center p-4">
            <span className="mr-4">Cart:</span>
            <Badge variant="secondary" className="mr-2">{totalItems} items</Badge>
            <span>{totalPrice.toFixed(2)} SOL</span>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">{product.price.toFixed(2)} SOL</p>
              <p className="text-sm text-muted-foreground mb-4">{product.description || 'No description'}</p>
              <Badge variant="secondary">In stock: {product.inventory}</Badge>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => addToCart(product)}
              >
                Add to Cart{cart[product.id] ? ` (${cart[product.id]})` : ''}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}