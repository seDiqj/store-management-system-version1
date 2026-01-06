"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";

/* ---------- Types ---------- */
type Product = {
  sku: string;
  name: string;
  stock: number;
};

/* ---------- Props ---------- */
export default function StockInDialog({
  products,
  onStockIn,
}: {
  products: Product[];
  onStockIn: (sku: string, qty: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [quantity, setQuantity] = useState(1);

  /* ---------- Filter ---------- */
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const submit = () => {
    if (!selectedSku || quantity <= 0) return;

    onStockIn(selectedSku, quantity);
    setQuantity(1);
    setSearch("");
    setSelectedSku("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Stock In
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Stock In</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          {/* Search */}
          <div className="grid gap-2">
            <Label>Search Product</Label>
            <Input
              placeholder="Search name or SKU"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Select */}
          <div className="grid gap-2">
            <Label>Select Product</Label>
            <Select value={selectedSku} onValueChange={setSelectedSku}>
              <SelectTrigger>
                <SelectValue placeholder="Choose product" />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.map((p) => (
                  <SelectItem key={p.sku} value={p.sku}>
                    {p.name} — ({p.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="grid gap-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
