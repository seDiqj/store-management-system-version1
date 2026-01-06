"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function CustomerCheckoutSection({
  customer,
  setCustomer,
  cart,
  onCompleteSale,
}: any) {
  /* ---------------- Calculations ---------------- */
  const total = useMemo(
    () =>
      cart.reduce(
        (sum: number, item: any) =>
          sum + item.price * item.quantity,
        0
      ),
    [cart]
  )

  const saleDate = new Date().toLocaleString()

  const canComplete =
    customer.name &&
    customer.phone &&
    cart.length > 0

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Finalize Sale
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ================= Customer Info ================= */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm">Customer Name *</Label>
              <Input
                placeholder="Customer name"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Phone *</Label>
              <Input
                placeholder="Phone number"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Email</Label>
              <Input
                placeholder="Email (optional)"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Address</Label>
              <Input
                placeholder="Address (optional)"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    address: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* ================= Purchased Products ================= */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">
            Purchased Products
          </h4>

          {cart.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products selected
            </p>
          ) : (
            cart.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between text-sm border-b pb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ${item.price * item.quantity}
                </span>
              </div>
            ))
          )}
        </div>

        {/* ================= Summary ================= */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>Date</span>
            <span>{saleDate}</span>
          </div>

          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        {/* ================= Action ================= */}
        <Button
          className="w-full"
          disabled={!canComplete}
          onClick={() =>
            onCompleteSale({
              customer,
              cart,
              total,
              date: saleDate,
            })
          }
        >
          Complete Sale
        </Button>
      </CardContent>
    </Card>
  )
}
