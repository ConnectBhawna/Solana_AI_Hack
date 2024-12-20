import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { sampleProducts, Product } from "@/lib/sample-data"
import { Badge } from "@/components/ui/badge"

export default function AvailableProducts() {
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  const addToCart = (product: Product) => {
    setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }))
  }

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const totalPrice = sampleProducts.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0)

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
        {sampleProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-2">{product.price.toFixed(2)} SOL</p>
              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
              <Badge variant="secondary">In stock: {product.inventory}</Badge>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => addToCart(product)}
              >
                Add to Cart {cart[product.id] ? `(${cart[product.id]})` : ''}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
