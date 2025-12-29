"use client";

import { useState } from "react";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { Minus } from "lucide-react";

/* ---------- Types ---------- */
type Product = {
  sku: string;
  name: string;
  stock: number;
};

/* ---------- Component ---------- */
export default function StockOutDialog({
  products,
  onStockOut,
}: {
  products: Product[];
  onStockOut: (sku: string, qty: number, reason: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("sale");

  /* ---------- Filter ---------- */
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const submit = () => {
    if (!selectedSku || quantity <= 0) return;

    onStockOut(selectedSku, quantity, reason);

    setQuantity(1);
    setSearch("");
    setSelectedSku("");
    setReason("sale");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Minus className="h-4 w-4" />
          Stock Out
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Stock Out</DialogTitle>
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

          {/* Select Product */}
          <div className="grid gap-2">
            <Label>Select Product</Label>
            <Select value={selectedSku} onValueChange={setSelectedSku}>
              <SelectTrigger>
                <SelectValue placeholder="Choose product" />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.map((p) => (
                  <SelectItem key={p.sku} value={p.sku}>
                    {p.name} — Stock: {p.stock}
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

          {/* Reason */}
          <div className="grid gap-2">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="damage">Damaged</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
              </SelectContent>
            </Select>
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
