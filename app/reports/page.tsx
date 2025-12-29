"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";

/* ---------------- Types ---------------- */
type SaleItem = {
  sku: string;
  name: string;
  qty: number;
  price: number;
  cost: number;
};

type Sale = {
  date: string;
  customerName: string;
  items: SaleItem[];
};

type Purchase = {
  date: string;
  total: number;
};

type Product = {
  sku: string;
  name: string;
  stock: number;
  cost: number;
};

/* ---------------- Page ---------------- */
export default function ReportPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [range, setRange] = useState<"today" | "month" | "all">("all");

  useEffect(() => {
    setSales(JSON.parse(localStorage.getItem("sales_history") || "[]"));
    setPurchases(JSON.parse(localStorage.getItem("purchase_history") || "[]"));
    setInventory(JSON.parse(localStorage.getItem("inventory") || "[]"));
  }, []);

  /* ---------------- Date Filter ---------------- */
  const filteredSales = sales.filter((s) => {
    if (range === "all") return true;
    const d = new Date(s.date);
    const now = new Date();

    if (range === "today") {
      return d.toDateString() === now.toDateString();
    }

    if (range === "month") {
      return d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    }

    return true;
  });

  const flatItems = filteredSales.flatMap((s) => s.items);

  /* ---------------- KPIs ---------------- */
  const totalRevenue = flatItems.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  const totalProfit = flatItems.reduce(
    (s, i) => s + (i.price - i.cost) * i.qty,
    0
  );

  /* Best Customer */
  const customerMap: Record<string, number> = {};
  filteredSales.forEach((s) => {
    const total = s.items.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );
    customerMap[s.customerName] =
      (customerMap[s.customerName] || 0) + total;
  });

  const bestCustomer =
    Object.entries(customerMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  /* ---------------- Sales Trend ---------------- */
  const salesTrend: { date: string; total: number }[] = [];

  filteredSales.forEach((s) => {
    const day = s.date.split("T")[0];
    const total = s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const found = salesTrend.find((d) => d.date === day);
    if (found) found.total += total;
    else salesTrend.push({ date: day, total });
  });

  /* ---------------- Purchase vs Sales ---------------- */
  const totalPurchases = purchases.reduce((s, p) => s + p.total, 0);

  const compareData = [
    { name: "Sales", value: totalRevenue },
    { name: "Purchases", value: totalPurchases },
  ];

  /* ---------------- Top Products ---------------- */
  const productMap: Record<string, number> = {};
  flatItems.forEach((i) => {
    productMap[i.name] = (productMap[i.name] || 0) + i.qty;
  });

  const topProducts = Object.entries(productMap).map(([name, qty]) => ({
    name,
    qty,
  }));

  /* ---------------- Forecast ---------------- */
  const avgDailySales =
    salesTrend.length === 0
      ? 0
      : totalRevenue / salesTrend.length;

  const forecast30 = Math.round(avgDailySales * 30);

  /* ---------------- Product Intelligence ---------------- */
  const productStats = inventory.map((p) => {
    const sold = flatItems.filter((i) => i.sku === p.sku);
    const qtySold = sold.reduce((s, x) => s + x.qty, 0);
    const profit = sold.reduce(
      (s, x) => s + (x.price - x.cost) * x.qty,
      0
    );

    return {
      ...p,
      qtySold,
      profit,
      daysLeft:
        qtySold === 0 ? "∞" : Math.round(p.stock / (qtySold / 30)),
    };
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Reports</h1>

      {/* Range */}
      <div className="flex gap-2">
        {["today", "month", "all"].map((r) => (
          <Button
            key={r}
            onClick={() => setRange(r as any)}
            variant={range === r ? "default" : "outline"}
          >
            {r.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* KPI */}
      <Card>
        <CardContent className="space-y-2 p-4">
          <div>Total Revenue: <strong>${totalRevenue}</strong></div>
          <div className="text-green-600">
            Net Profit: <strong>${totalProfit}</strong>
          </div>
          <div>Best Customer: <strong>{bestCustomer}</strong></div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card>
        <CardHeader><CardTitle>Sales Trend</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="total" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Purchase vs Sales</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={topProducts} dataKey="qty" nameKey="name" outerRadius={90}>
                {topProducts.map((_, i) => <Cell key={i} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Forecast */}
      <Card>
        <CardHeader><CardTitle>30-Day Forecast</CardTitle></CardHeader>
        <CardContent>
          <strong className="text-2xl">${forecast30}</strong>
        </CardContent>
      </Card>

      {/* Product Intelligence */}
      <Card>
        <CardHeader><CardTitle>Product Intelligence</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {productStats.map((p) => (
            <div key={p.sku} className="border p-3 rounded">
              <strong>{p.name}</strong>
              <div>Sold: {p.qtySold}</div>
              <div>Profit: ${p.profit}</div>
              <div>
                Days Left:{" "}
                {p.daysLeft === "∞" ? (
                  <Badge variant="secondary">No sales</Badge>
                ) : (
                  <Badge>{p.daysLeft} days</Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={() => alert("Export Ready")}>
        Export Report
      </Button>
    </div>
  );
}
