"use client";

import { useEffect, useState } from "react";

/* ---------- Components ---------- */
import InventoryTable from "./../components/InventoryTable";
import AddProductDialog from "@/app/components/AddProductDialog";
import StockInDialog from "@/app/components/StockInDialog";
import StockOutDialog from "@/app/components/StockOutDialog";
import KpiCard from "@/app/components/KpiCard";

/* ---------- Icons ---------- */
import {
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
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
  condition: "New" | "Used";
};

/* ---------- Helper ---------- */
const computeStatus = (stock: number): Product["status"] => {
  if (stock === 0) return "out";
  if (stock <= 5) return "low";
  return "in_stock";
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);

  /* ---------- Load ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (stored) {
      const parsed: Product[] = JSON.parse(stored);
      setProducts(
        parsed.map((p) => ({
          ...p,
          status: computeStatus(p.stock),
        }))
      );
    }
  }, []);

  /* ---------- Save ---------- */
  const save = (data: Product[]) => {
    setProducts(data);
    localStorage.setItem("inventory", JSON.stringify(data));
  };

  /* ---------- Add Product ---------- */
  const addProduct = (product: any) => {
    const normalized: Product = {
      ...product,
      condition: product.condition ?? "New",
      status: computeStatus(product.stock),
    };
    save([normalized, ...products]);
  };

  /* ---------- Stock In ---------- */
  const stockIn = (sku: string, qty: number) => {
    save(
      products.map((p) =>
        p.sku === sku
          ? {
              ...p,
              stock: p.stock + qty,
              status: computeStatus(p.stock + qty),
            }
          : p
      )
    );
  };

  /* ---------- Stock Out ---------- */
  const stockOut = (sku: string, qty: number) => {
    save(
      products.map((p) =>
        p.sku === sku
          ? {
              ...p,
              stock: Math.max(0, p.stock - qty),
              status: computeStatus(
                Math.max(0, p.stock - qty)
              ),
            }
          : p
      )
    );
  };

  /* ---------- Delete ---------- */
  const deleteProducts = (skus: string[]) => {
    save(products.filter((p) => !skus.includes(p.sku)));
  };

  /* ---------- KPI ---------- */
  const totalValue = products.reduce(
    (sum, p) => sum + p.cost * p.stock,
    0
  );

  const lowStockCount = products.filter(
    (p) => p.stock > 0 && p.stock <= 5
  ).length;

  const outOfStockCount = products.filter(
    (p) => p.stock === 0
  ).length;

  return (
    <div className="space-y-8">
      {/* ---------- Header ---------- */}
      <div>
        <h1 className="text-3xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">
          Manage your stock in real time
        </p>
      </div>

      {/* ---------- KPI ---------- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Products"
          value={products.length.toString()}
          icon={Package}
        />
        <KpiCard
          title="Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
        <KpiCard
          title="Low Stock"
          value={lowStockCount.toString()}
          icon={AlertTriangle}
          variant="warning"
        />
        <KpiCard
          title="Out of Stock"
          value={outOfStockCount.toString()}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* ---------- Inventory Table + Toolbar ---------- */}
      <InventoryTable
        products={products}
        onDelete={deleteProducts}
        actions={
          <>
            <StockInDialog
              products={products}
              onStockIn={stockIn}
            />
            <StockOutDialog
              products={products}
              onStockOut={stockOut}
            />
            <AddProductDialog onAdd={addProduct} />
          </>
        }
      />
    </div>
  );
}
