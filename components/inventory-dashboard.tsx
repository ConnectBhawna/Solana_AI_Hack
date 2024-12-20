import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sampleProducts, Product } from "@/lib/sample-data"
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons"

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, inventory: 0, description: '' })

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.inventory) {
      setProducts([...products, { ...newProduct, id: Date.now().toString() } as Product])
      setNewProduct({ name: '', price: 0, inventory: 0, description: '' })
    }
  }

  const handleUpdateInventory = (id: string, change: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, inventory: Math.max(0, p.inventory + change) } : p))
  }

  const totalValue = products.reduce((sum, product) => sum + product.price * product.inventory, 0)

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
            <CardTitle>Total Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{products.reduce((sum, p) => sum + p.inventory, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalValue.toFixed(2)} SOL</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price (SOL)</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price.toFixed(2)} SOL</TableCell>
                  <TableCell>{product.inventory}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="icon" variant="outline" onClick={() => handleUpdateInventory(product.id, -1)}>
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{product.inventory}</span>
                      <Button size="icon" variant="outline" onClick={() => handleUpdateInventory(product.id, 1)}>
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input 
              placeholder="Product Name" 
              value={newProduct.name} 
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="flex-1"
            />
            <Input 
              type="number" 
              placeholder="Price (SOL)" 
              value={newProduct.price} 
              onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
              className="flex-1"
            />
            <Input 
              type="number" 
              placeholder="Inventory" 
              value={newProduct.inventory} 
              onChange={(e) => setNewProduct({...newProduct, inventory: parseInt(e.target.value)})}
              className="flex-1"
            />
            <Input 
              placeholder="Description" 
              value={newProduct.description} 
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              className="flex-1"
            />
            <Button onClick={handleAddProduct} className="w-full md:w-auto">Add Product</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

