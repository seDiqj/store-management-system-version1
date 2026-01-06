"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

import CustomerCheckoutSection from "./../components/sell/CustomerSection";

/* ---------------- Types ---------------- */
type Product = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
  status: "in_stock" | "low" | "out";
};

type CartItem = Product & { qty: number };

type SaleRecord = {
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  date: string;
};

export default function SalesPagePhase1() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [showHistory, setShowHistory] = useState(false);
  const [sales, setSales] = useState<SaleRecord[]>([]);

  /* Load inventory */
  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (stored) setInventory(JSON.parse(stored));
  }, []);

  /* Load sales history */
  useEffect(() => {
    if (showHistory) {
      const storedSales = localStorage.getItem("sales");
      setSales(storedSales ? JSON.parse(storedSales) : []);
    }
  }, [showHistory]);

  /* Filter products */
  const filteredProducts = inventory.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  /* Add to cart */
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.sku === product.sku);
      if (existing) {
        return prev.map((i) =>
          i.sku === product.sku ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  /* Complete Sale */
  const completeSale = () => {
    const sale = {
      items: cart,
      customer,
      date: new Date().toISOString(),
    };

    const storedSales = localStorage.getItem("sales");
    const sales = storedSales ? JSON.parse(storedSales) : [];
    sales.push(sale);
    localStorage.setItem("sales", JSON.stringify(sales));

    const updatedInventory = inventory.map((p) => {
      const item = cart.find((c) => c.sku === p.sku);
      if (!item) return p;
      return { ...p, stock: Math.max(0, p.stock - item.qty) };
    });

    setInventory(updatedInventory);
    localStorage.setItem("inventory", JSON.stringify(updatedInventory));

    setCart([]);
    setCustomer({ name: "", phone: "", email: "", address: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">
            Search & select products for sale
          </p>
        </div>

        <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide Sale History" : "View Sale History"}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name / SKU / scan barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="max-h-[320px] overflow-y-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((p) => (
                  <TableRow key={p.sku}>
                    <TableCell className="font-medium">
                      {p.name}
                    </TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>
                      {p.status === "out" && (
                        <Badge variant="destructive">Out</Badge>
                      )}
                      {p.status === "low" && (
                        <Badge variant="secondary">Low</Badge>
                      )}
                      {p.status === "in_stock" && (
                        <Badge className="bg-green-600">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={p.stock === 0}
                        onClick={() => addToCart(p)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Checkout */}
      <CustomerCheckoutSection
        customer={customer}
        setCustomer={setCustomer}
        cart={cart.map((i) => ({
          ...i,
          quantity: i.qty,
          id: i.sku,
        }))}
        onCompleteSale={completeSale}
      />

      {/* Sale History */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle>Sale History</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="max-h-[240px] overflow-y-auto space-y-3"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {sales.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No sales recorded
                </p>
              )}

              {sales.map((s, idx) => (
                <div key={idx} className="rounded border p-3 text-sm">
                  <div className="font-semibold">
                    {s.customer?.name || "Walk-in Customer"}
                  </div>
                  <div className="text-muted-foreground">
                    {new Date(s.date).toLocaleString()}
                  </div>
                  <div className="mt-1">
                    Items:{" "}
                    {s.items.reduce(
                      (a: number, b: any) =>
                        a + (b.qty ?? b.quantity ?? 1),
                      0
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
