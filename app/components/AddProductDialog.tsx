"use client";

import { useEffect, useState } from "react";
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
import { Plus, Check } from "lucide-react";

/* ---------- Types ---------- */
type Product = {
  name: string;
  sku: string;
  category: string;
  brand: string;
  stock: number;
  cost: number;
  price: number;
  status: "in_stock" | "low" | "out";
  condition: "new" | "used";
  usageDuration?: string;
  warranty?: string;
  defects?: string;
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
  const [brand, setBrand] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [condition, setCondition] = useState<"new" | "used">("new");
  const [usageDuration, setUsageDuration] = useState("");
  const [warranty, setWarranty] = useState("");
  const [defects, setDefects] = useState("");

  /* ---------- Alerts ---------- */
  const [productSuccess, setProductSuccess] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState(false);
  const [brandSuccess, setBrandSuccess] = useState(false);

  /* ---------- Category ---------- */
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  /* ---------- Brand ---------- */
  const [brands, setBrands] = useState<string[]>([]);
  const [newBrand, setNewBrand] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  /* ---------- Load ---------- */
  useEffect(() => {
    setCategories(
      JSON.parse(localStorage.getItem("categories") || '["Mobile","Laptop"]')
    );
    setBrands(
      JSON.parse(localStorage.getItem("brands") || '["Apple","Samsung"]')
    );
  }, []);

  /* ---------- Helpers ---------- */
  const flash = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    if (!categories.includes(newCategory)) {
      const updated = [...categories, newCategory];
      setCategories(updated);
      localStorage.setItem("categories", JSON.stringify(updated));
      setCategory(newCategory);
      flash(setCategorySuccess);
    }
    setNewCategory("");
  };

  const addBrand = () => {
    if (!newBrand.trim()) return;
    if (!brands.includes(newBrand)) {
      const updated = [...brands, newBrand];
      setBrands(updated);
      localStorage.setItem("brands", JSON.stringify(updated));
      setBrand(newBrand);
      flash(setBrandSuccess);
    }
    setNewBrand("");
  };

  const handleSubmit = () => {
    if (!name || !sku || !category || !brand) return;

    const stockNumber = Number(stock);
    const status =
      stockNumber === 0 ? "out" : stockNumber <= 5 ? "low" : "in_stock";

    const productData: Product = {
      name,
      sku,
      category,
      brand,
      stock: stockNumber,
      cost: Number(cost),
      price: Number(price),
      status,
      condition,
      ...(condition === "used" && {
        usageDuration,
        warranty,
        defects,
      }),
    };

    onAdd(productData);
    flash(setProductSuccess);

    setName("");
    setSku("");
    setCategory("");
    setBrand("");
    setCost("");
    setPrice("");
    setStock("");
    setCondition("new");
    setUsageDuration("");
    setWarranty("");
    setDefects("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>

      <DialogContent className="min-w-[85vw] lg:min-w-[70vw] max-w-none h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        {/* ---------- Form ---------- */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-6">
          {/* Name + SKU */}
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="Search..."
                  className="mb-2"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
                {categories
                  .filter((c) =>
                    c.toLowerCase().includes(categorySearch.toLowerCase())
                  )
                  .map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder="Add category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
              />
              <Button size="icon" variant="outline" onClick={addCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {categorySuccess && (
              <p className="text-green-600 text-sm flex items-center gap-1">
                <Check className="h-4 w-4" /> Category added
              </p>
            )}
          </div>

          {/* Brand */}
          <div className="space-y-3">
            <Label>Brand</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="Search..."
                  className="mb-2"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                />
                {brands
                  .filter((b) =>
                    b.toLowerCase().includes(brandSearch.toLowerCase())
                  )
                  .map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder="Add brand"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addBrand()}
              />
              <Button size="icon" variant="outline" onClick={addBrand}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {brandSuccess && (
              <p className="text-green-600 text-sm flex items-center gap-1">
                <Check className="h-4 w-4" /> Brand added
              </p>
            )}
          </div>

          {/* Cost + Selling Price (SAME ROW) */}
          <div className="space-y-2">
            <Label>Cost Price</Label>
            <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Selling Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>

          {/* Condition (MOVED TO END) */}
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select
              value={condition}
              onValueChange={(value: "new" | "used") => setCondition(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Extra fields for USED */}
          {condition === "used" && (
            <>
              <div className="space-y-2">
                <Label>Usage Duration</Label>
                <Input value={usageDuration} onChange={(e) => setUsageDuration(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Warranty Status</Label>
                <Input value={warranty} onChange={(e) => setWarranty(e.target.value)} />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Defects or Issues</Label>
                <Input value={defects} onChange={(e) => setDefects(e.target.value)} />
              </div>
            </>
          )}
        </div>

        {productSuccess && (
          <div className="text-green-700 text-sm flex items-center gap-2 pb-2">
            <Check className="h-4 w-4" /> Product added successfully
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Add Product</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
