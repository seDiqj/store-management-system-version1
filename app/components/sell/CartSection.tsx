"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CartSection({ cart, setCart }: any) {
  const updateQty = (id: string, qty: number) => {
    setCart(
      cart.map((item: any) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCart(cart.filter((item: any) => item.id !== id))
  }

  return (
    <Card>
      <CardHeader className="font-semibold">Cart</CardHeader>
      <CardContent className="space-y-3">
        {cart.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between items-center"
          >
            <div>
              <p>{item.name}</p>
              <p className="text-sm">${item.price}</p>
            </div>

            <Input
              type="number"
              className="w-20"
              value={item.quantity}
              min={1}
              onChange={(e) =>
                updateQty(item.id, Number(e.target.value))
              }
            />

            <Button
              variant="destructive"
              onClick={() => removeItem(item.id)}
            >
              X
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}