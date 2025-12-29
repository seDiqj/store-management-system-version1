"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Plus, Minus, Trash } from "lucide-react";

/* ---------------- Types ---------------- */
type Product = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
};

type CartItem = Product & {
  qty: number;
};

type Customer = {
  id: string;
  name: string;
};

type Sale = {
  id: number;
  customer: Customer;
  items: CartItem[];
  total: number;
  profit: number;
  date: string;
};

/* ---------------- Page ---------------- */
export default function SalesPage() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  /* Customer */
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  /* ---------------- Load Inventory & Customers ---------------- */
  useEffect(() => {
    const inv = localStorage.getItem("inventory");
    if (inv) setInventory(JSON.parse(inv));

    const cust = localStorage.getItem("customers");
    if (cust) setCustomers(JSON.parse(cust));
  }, []);

  /* ---------------- Cart Logic ---------------- */
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const found = prev.find((p) => p.sku === product.sku);
      if (found) {
        if (found.qty >= product.stock) return prev;
        return prev.map((p) =>
          p.sku === product.sku ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (sku: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.sku === sku ? { ...p, qty: p.qty + delta } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  /* ---------------- Summary ---------------- */
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const profit = cart.reduce(
    (s, i) => s + (i.price - i.cost) * i.qty,
    0
  );

  /* ---------------- Customer ---------------- */
  const addCustomer = () => {
    if (!customerName.trim()) return;

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: customerName,
    };

    const updated = [...customers, newCustomer];
    setCustomers(updated);
    localStorage.setItem("customers", JSON.stringify(updated));

    setSelectedCustomer(newCustomer);
    setCustomerName("");
  };

  /* ---------------- Complete Sale ---------------- */
  const completeSale = () => {
    if (!selectedCustomer) {
      alert("Please select customer ❌");
      return;
    }

    const updatedInventory = inventory.map((p) => {
      const sold = cart.find((c) => c.sku === p.sku);
      if (!sold) return p;
      return { ...p, stock: p.stock - sold.qty };
    });

    /* Save inventory */
    localStorage.setItem(
      "inventory",
      JSON.stringify(updatedInventory)
    );
    setInventory(updatedInventory);

    /* Save sale */
    const sale: Sale = {
      id: Date.now(),
      customer: selectedCustomer,
      items: cart,
      total,
      profit,
      date: new Date().toISOString(),
    };

    const history = JSON.parse(
      localStorage.getItem("sales") || "[]"
    );
    localStorage.setItem(
      "sales",
      JSON.stringify([sale, ...history])
    );

    setCart([]);
    setSelectedCustomer(null);

    alert("Sale completed successfully ✅");
  };

  /* ---------------- Filter ---------------- */
  const filteredProducts = inventory.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="lg:col-span-2 space-y-4">
        <Input
          placeholder="Search / Scan product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((p) => (
                  <TableRow key={p.sku}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      {p.stock <= 5 ? (
                        <Badge variant="destructive">
                          {p.stock}
                        </Badge>
                      ) : (
                        p.stock
                      )}
                    </TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => addToCart(p)}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT */}
      <div className="space-y-4">

        {/* Customer */}
        <Card>
          <CardHeader>
            <CardTitle>Customer (Required)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedCustomer?.id || ""}
              onChange={(e) => {
                const c = customers.find(
                  (c) => c.id === e.target.value
                );
                setSelectedCustomer(c || null);
              }}
            >
              <option value="">Select customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Input
                placeholder="New customer name"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
              />
              <Button onClick={addCustomer}>Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoice */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No items added
              </p>
            ) : (
              <Table>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.sku}>
                      <TableCell>
                        {item.name}
                        <div className="text-xs text-muted-foreground">
                          Profit/item: $
                          {item.price - item.cost}
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            updateQty(item.sku, -1)
                          }
                        >
                          <Minus size={14} />
                        </Button>
                        {item.qty}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            updateQty(item.sku, 1)
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        ${item.price * item.qty}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            updateQty(
                              item.sku,
                              -item.qty
                            )
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

        {/* Summary */}
        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total</span>
              <strong>${total}</strong>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Profit</span>
              <strong>${profit}</strong>
            </div>

            <Button
              className="w-full mt-4"
              disabled={
                cart.length === 0 || !selectedCustomer
              }
              onClick={completeSale}
            >
              Complete Sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
