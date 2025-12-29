"use client";

import { useEffect, useState } from "react";

import AddProductDialog from "@/app/components/AddProductDialog";
import StockInDialog from "@/app/components/StockInDialog";
import StockOutDialog from "@/app/components/StockOutDialog";
import KpiCard from "@/app/components/KpiCard";

import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

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
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

import {
  Search,
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
  FilterX,
} from "lucide-react";

/* ---------- Types ---------- */
export type Product = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
  status: "in_stock" | "low" | "out";
};

/* ---------- Initial Data ---------- */
const initialInventory: Product[] = [
  {
    name: "iPhone 14 Pro",
    sku: "IP14-PRO",
    category: "Mobile",
    stock: 25,
    cost: 800,
    price: 950,
    status: "in_stock",
  },
  {
    name: "Samsung A51",
    sku: "SAM-A51",
    category: "Mobile",
    stock: 5,
    cost: 200,
    price: 260,
    status: "low",
  },
];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  /* ---------- Load ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      localStorage.setItem("inventory", JSON.stringify(initialInventory));
      setProducts(initialInventory);
    }
  }, []);

  /* ---------- Save ---------- */
  const save = (data: Product[]) => {
    setProducts(data);
    localStorage.setItem("inventory", JSON.stringify(data));
  };

  /* ---------- Helpers ---------- */
  const computeStatus = (stock: number): Product["status"] => {
    if (stock === 0) return "out";
    if (stock <= 5) return "low";
    return "in_stock";
  };

  /* ---------- Add Product ---------- */
  const addProduct = (product: Product) => {
    save([product, ...products]);
  };

  /* ---------- Stock In ---------- */
  const stockIn = (sku: string, qty: number) => {
    const updated = products.map((p) =>
      p.sku === sku
        ? {
            ...p,
            stock: p.stock + qty,
            status: computeStatus(p.stock + qty),
          }
        : p
    );
    save(updated);
  };

  /* ---------- Stock Out ---------- */
  const stockOut = (sku: string, qty: number) => {
    const updated = products.map((p) =>
      p.sku === sku
        ? {
            ...p,
            stock: Math.max(0, p.stock - qty),
            status: computeStatus(Math.max(0, p.stock - qty)),
          }
        : p
    );
    save(updated);
  };

  /* ---------- Filters ---------- */
  const filtered = products.filter((p) => {
    const s =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const c = category === "all" || p.category === category;
    const st = status === "all" || p.status === status;
    return s && c && st;
  });

  /* ---------- KPI ---------- */
  const totalValue = products.reduce(
    (sum, p) => sum + p.cost * p.stock,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">
          Manage your stock in real time
        </p>
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Products" value={products.length.toString()} icon={Package} />
        <KpiCard
          title="Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
        <KpiCard
          title="Low Stock"
          value={products.filter(p => p.status === "low").length.toString()}
          icon={AlertTriangle}
          variant="warning"
        />
        <KpiCard
          title="Out of Stock"
          value={products.filter(p => p.status === "out").length.toString()}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {[...new Set(products.map(p => p.category))].map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="out">Out</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setStatus("all");
            }}
          >
            <FilterX className="h-4 w-4" />
          </Button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <StockInDialog products={products} onStockIn={stockIn} />
          <StockOutDialog products={products} onStockOut={stockOut} />
          <AddProductDialog onAdd={addProduct} />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.sku}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>${p.cost}</TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Badge ---------- */
function StatusBadge({ status }: { status: Product["status"] }) {
  if (status === "in_stock") return <Badge className="bg-green-600">In Stock</Badge>;
  if (status === "low") return <Badge variant="secondary">Low</Badge>;
  return <Badge variant="destructive">Out</Badge>;
}
