'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  ShoppingCart,
  Boxes,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ---------- Mock Data ---------- */

const salesData = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 2100 },
  { day: "Wed", sales: 1800 },
  { day: "Thu", sales: 2600 },
  { day: "Fri", sales: 3200 },
  { day: "Sat", sales: 4000 },
  { day: "Sun", sales: 3450 },
];

const inventoryData = [
  { name: "In Stock", value: 75 },
  { name: "Low Stock", value: 15 },
  { name: "Out of Stock", value: 10 },
];

const COLORS = ["#16a34a", "#facc15", "#dc2626"];

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Business Dashboard
        </h1>
        <p className="text-muted-foreground">
          Everything you need to know — at a glance
        </p>
      </div>

      <Separator />

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card className="transition-all hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Total Inventory Value
            </CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$120,000</div>
            <p className="text-xs text-muted-foreground">
              All warehouses combined
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Today Sales
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,450</div>
            <Badge className="mt-2" variant="secondary">
              ↑ Growing
            </Badge>
          </CardContent>
        </Card>

        <Card className="transition-all hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Monthly Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,200</div>
            <p className="text-xs text-muted-foreground">
              Net income
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Critical Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              7
            </div>
            <p className="text-xs text-muted-foreground">
              Needs action today
            </p>
          </CardContent>
        </Card>

      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Sales Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              How your business is moving
            </p>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value}`, "Sales"]}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Stock distribution
            </p>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {inventoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
