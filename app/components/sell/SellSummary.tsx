"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SellSummary({ cart }: any) {
  const total = cart.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  )

  return (
    <Card>
      <CardHeader className="font-semibold">Summary</CardHeader>
      <CardContent className="space-y-3">
        <p>Total Items: {cart.length}</p>
        <p className="text-lg font-bold">Total: ${total}</p>

        <Button className="w-full">Complete Sale</Button>
      </CardContent>
    </Card>
  )
}