"use client";

import { useState, ReactNode } from "react";
import { Product } from "@/app/inventory/page";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, FilterX } from "lucide-react";

/* ---------- Helper ---------- */
const computeStatus = (stock: number): Product["status"] => {
  if (stock === 0) return "out";
  if (stock <= 5) return "low";
  return "in_stock";
};

/* ---------- Props ---------- */
type Props = {
  products: Product[];
  onDelete: (skus: string[]) => void;
  actions?: ReactNode; // 👈 StockIn / StockOut / AddProduct
};

export default function InventoryTable({
  products,
  onDelete,
  actions,
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  /* ---------- Filters ---------- */
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "all" || p.category === category;

    const matchStatus =
      status === "all" || computeStatus(p.stock) === status;

    return matchSearch && matchCategory && matchStatus;
  });

  /* ---------- Selection ---------- */
  const toggleRow = (sku: string) => {
    setSelectedRows((prev) =>
      prev.includes(sku)
        ? prev.filter((s) => s !== sku)
        : [...prev, sku]
    );
  };

  const toggleAll = () => {
    setSelectedRows(
      selectedRows.length === filtered.length
        ? []
        : filtered.map((p) => p.sku)
    );
  };

  return (
    <div className="space-y-4">
      {/* ---------- Toolbar ---------- */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div className="flex flex-wrap items-center gap-3">
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
              {[...new Set(products.map((p) => p.category))].map(
                (c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                )
              )}
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

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>

      {/* ---------- Table ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {selectedRows.length > 0 && (
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(selectedRows);
                  setSelectedRows([]);
                }}
              >
                Delete
              </Button>
              <Button disabled={selectedRows.length !== 1}>
                Edit
              </Button>
              <Button>Sell</Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === filtered.length &&
                      filtered.length > 0
                    }
                    onChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.sku}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(p.sku)}
                      onChange={() => toggleRow(p.sku)}
                    />
                  </TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>${p.cost}</TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell>
                    <StatusBadge status={computeStatus(p.stock)} />
                  </TableCell>
                  <TableCell>{p.condition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Status Badge ---------- */
function StatusBadge({
  status,
}: {
  status: Product["status"];
}) {
  if (status === "in_stock")
    return <Badge className="bg-green-600">In Stock</Badge>;
  if (status === "low")
    return <Badge variant="secondary">Low</Badge>;
  return <Badge variant="destructive">Out</Badge>;
}
