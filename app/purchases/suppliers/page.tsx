"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";

import { Plus, Minus, Trash, Warehouse } from "lucide-react";

/* ---------------- Types ---------------- */
type Product = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
};

type PurchaseItem = {
  sku: string;
  name: string;
  category: string;
  cost: number;
  qty: number;
};

type PurchaseHistory = {
  id: string;
  date: string;
  supplier?: string;
  items: PurchaseItem[];
  totalCost: number;
};

/* ---------------- Page ---------------- */
export default function PurchasePage() {
  const router = useRouter();

  const [inventory, setInventory] = useState<Product[]>([]);
  const [cart, setCart] = useState<PurchaseItem[]>([]);
  const [search, setSearch] = useState("");

  /* Load Inventory */
  useEffect(() => {
    const inv = localStorage.getItem("inventory");
    if (inv) setInventory(JSON.parse(inv));
  }, []);

  /* ---------------- Add Item ---------------- */
  const addItem = () => {
    if (!search.trim()) return;

    setCart((prev) => {
      const found = prev.find((i) => i.sku === search);
      if (found) {
        return prev.map((i) =>
          i.sku === search ? { ...i, qty: i.qty + 1 } : i
        );
      }

      const existing = inventory.find((p) => p.sku === search);

      return [
        ...prev,
        {
          sku: search,
          name: existing?.name || "New Product",
          category: existing?.category || "General",
          cost: existing?.cost || 0,
          qty: 1,
        },
      ];
    });

    setSearch("");
  };

  /* ---------------- Qty Control ---------------- */
  const updateQty = (sku: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.sku === sku ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  /* ---------------- Total ---------------- */
  const totalCost = cart.reduce(
    (s, i) => s + i.cost * i.qty,
    0
  );

  /* ---------------- Complete Purchase ---------------- */
  const completePurchase = () => {
    let updatedInventory = [...inventory];

    cart.forEach((item) => {
      const index = updatedInventory.findIndex(
        (p) => p.sku === item.sku
      );

      if (index > -1) {
        updatedInventory[index].stock += item.qty;
        updatedInventory[index].cost = item.cost;
      } else {
        updatedInventory.push({
          sku: item.sku,
          name: item.name,
          category: item.category,
          cost: item.cost,
          price: item.cost * 1.3,
          stock: item.qty,
        });
      }
    });

    localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    setInventory(updatedInventory);

    const history: PurchaseHistory[] = JSON.parse(
      localStorage.getItem("purchase_history") || "[]"
    );

    history.unshift({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      items: cart,
      totalCost,
    });

    localStorage.setItem(
      "purchase_history",
      JSON.stringify(history)
    );

    setCart([]);
    alert("Purchase completed successfully ✅");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter SKU and press Add..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={addItem}>Add</Button>

          <Button
            variant="outline"
            onClick={() => router.push("/inventory")}
          >
            <Warehouse className="mr-2 h-4 w-4" />
            Warehouse
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Items</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No items added
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.sku}>
                      <TableCell>
                        {item.name}
                        <div className="text-xs text-muted-foreground">
                          {item.sku}
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => updateQty(item.sku, -1)}
                        >
                          <Minus size={14} />
                        </Button>
                        {item.qty}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => updateQty(item.sku, 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </TableCell>
                      <TableCell>${item.cost}</TableCell>
                      <TableCell>
                        <Badge>${item.cost * item.qty}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            updateQty(item.sku, -item.qty)
                          }
                        >
                          <Trash size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total Cost</span>
              <strong>${totalCost}</strong>
            </div>

            <Button
              className="w-full"
              disabled={cart.length === 0}
              onClick={completePurchase}
            >
              Complete Purchase
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
