"use client";

import { useEffect, useState } from "react";

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

import { Plus } from "lucide-react";

/* ---------- Types ---------- */
type Product = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
  status: "in_stock" | "low" | "out";
};

export default function AddProductDialog({
  onAdd,
}: {
  onAdd: (product: Product) => void;
}) {
  /* ---------- Form State ---------- */
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  /* ---------- Categories ---------- */
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  /* ---------- Load Categories ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("categories");
    if (stored) {
      setCategories(JSON.parse(stored));
    } else {
      const initial = ["Mobile", "Laptop"];
      setCategories(initial);
      localStorage.setItem(
        "categories",
        JSON.stringify(initial)
      );
    }
  }, []);

  /* ---------- Add Category ---------- */
  const addCategory = () => {
    if (!newCategory.trim()) return;

    if (!categories.includes(newCategory)) {
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem(
        "categories",
        JSON.stringify(updated)
      );
      setCategory(newCategory);
    }

    setNewCategory("");
  };

  /* ---------- Submit ---------- */
  const handleSubmit = () => {
    if (!name || !sku || !category) return;

    const stockNumber = Number(stock);

    const status: Product["status"] =
      stockNumber === 0
        ? "out"
        : stockNumber <= 5
        ? "low"
        : "in_stock";

    const product: Product = {
      name,
      sku,
      category,
      stock: stockNumber,
      cost: Number(cost),
      price: Number(price),
      status,
    };

    onAdd(product);

    /* Reset */
    setName("");
    setSku("");
    setCategory("");
    setCost("");
    setPrice("");
    setStock("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">Add Product</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Product Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>SKU / Barcode</Label>
            <Input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Add New Category</Label>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addCategory}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Cost Price</Label>
            <Input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Selling Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Initial Stock</Label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Add Product</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
