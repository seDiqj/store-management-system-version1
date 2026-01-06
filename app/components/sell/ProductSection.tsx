"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const MOCK_PRODUCTS = [
  { id: "1", name: "Laptop", price: 800, stock: 5 },
  { id: "2", name: "Mouse", price: 20, stock: 30 },
]

export default function ProductSection({ addToCart }: any) {
  return (
    <Card>
      <CardHeader className="font-semibold">Products</CardHeader>
      <CardContent className="space-y-3">
        {MOCK_PRODUCTS.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center border p-2 rounded-lg"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                ${p.price} | Stock: {p.stock}
              </p>
            </div>

            <Button onClick={() => addToCart(p)}>Add</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}