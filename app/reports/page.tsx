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
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/* ---------------- Types ---------------- */
interface SaleItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  cost: number;
  category?: string;
}

interface Sale {
  id: string;
  date: string;
  customerName: string;
  customerId?: string;
  items: SaleItem[];
  paymentMethod: string;
  discount?: number;
  tax?: number;
  totalAmount: number;
}

interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
  reorderPoint: number;
  supplier?: string;
  lastPurchaseDate?: string;
}

interface Purchase {
  id: string;
  date: string;
  supplier: string;
  items: PurchaseItem[];
  total: number;
  status: 'pending' | 'received' | 'cancelled';
}

interface PurchaseItem {
  sku: string;
  name: string;
  qty: number;
  unitCost: number;
  totalCost: number;
}

interface KPI {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  description: string;
}

/* ---------------- Page ---------------- */
export default function ProfessionalReportPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "quarter" | "year" | "all">("month");
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<"overview" | "sales" | "inventory" | "customers">("overview");

  useEffect(() => {
    // Load data from localStorage (simulating API calls)
    setTimeout(() => {
      const salesData = JSON.parse(localStorage.getItem("sales_history") || "[]");
      const purchaseData = JSON.parse(localStorage.getItem("purchase_history") || "[]");
      const inventoryData = JSON.parse(localStorage.getItem("inventory") || "[]");
      
      setSales(salesData);
      setPurchases(purchaseData);
      setInventory(inventoryData);
      setLoading(false);
    }, 1000);
  }, []);

  /* ---------------- Date Filtering ---------------- */
  const filterDataByDate = (date: string) => {
    const itemDate = new Date(date);
    const now = new Date();
    
    switch (timeRange) {
      case "today":
        return itemDate.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return itemDate >= weekAgo;
      case "month":
        return itemDate.getMonth() === now.getMonth() && 
               itemDate.getFullYear() === now.getFullYear();
      case "quarter":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        return Math.floor(itemDate.getMonth() / 3) === currentQuarter &&
               itemDate.getFullYear() === now.getFullYear();
      case "year":
        return itemDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const filteredSales = sales.filter(s => filterDataByDate(s.date));
  const filteredPurchases = purchases.filter(p => filterDataByDate(p.date));

  /* ---------------- KPIs Calculation ---------------- */
  const calculateKPIs = (): KPI[] => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalCost = filteredSales.flatMap(s => s.items)
      .reduce((sum, item) => sum + (item.cost * item.qty), 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
    
    const uniqueCustomers = new Set(filteredSales.map(s => s.customerName)).size;
    
    const avgTransactionValue = filteredSales.length > 0 
      ? totalRevenue / filteredSales.length 
      : 0;
    
    const lowStockItems = inventory.filter(p => p.stock <= p.reorderPoint).length;
    
    // Calculate changes (simplified - in real app, compare with previous period)
    const previousPeriodRevenue = totalRevenue * 0.85; // Mock data
    const revenueChange = ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue * 100);

    return [
      {
        label: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        change: revenueChange,
        icon: <DollarSign className="h-4 w-4" />,
        description: "Gross sales revenue"
      },
      {
        label: "Net Profit",
        value: `$${totalProfit.toLocaleString()}`,
        change: revenueChange * 1.2,
        icon: <TrendingUp className="h-4 w-4" />,
        description: "After costs and expenses"
      },
      {
        label: "Profit Margin",
        value: `${profitMargin}%`,
        change: 2.5,
        icon: <BarChart3 className="h-4 w-4" />,
        description: "Net profit percentage"
      },
      {
        label: "Avg. Transaction",
        value: `$${avgTransactionValue.toFixed(2)}`,
        change: -1.2,
        icon: <ShoppingCart className="h-4 w-4" />,
        description: "Average order value"
      },
      {
        label: "Active Customers",
        value: uniqueCustomers,
        change: 8.5,
        icon: <Users className="h-4 w-4" />,
        description: "Unique customers this period"
      },
      {
        label: "Low Stock Items",
        value: lowStockItems,
        change: lowStockItems > 0 ? -15 : 0,
        icon: <AlertCircle className="h-4 w-4" />,
        description: "Items below reorder point"
      }
    ];
  };

  const kpis = calculateKPIs();

  /* ---------------- Sales Trend Data ---------------- */
  const getSalesTrendData = () => {
    const trendData: { date: string; sales: number; orders: number }[] = [];
    
    filteredSales.forEach(sale => {
      const day = sale.date.split('T')[0];
      const existing = trendData.find(d => d.date === day);
      
      if (existing) {
        existing.sales += sale.totalAmount;
        existing.orders += 1;
      } else {
        trendData.push({
          date: day,
          sales: sale.totalAmount,
          orders: 1
        });
      }
    });
    
    return trendData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  /* ---------------- Top Products Data ---------------- */
  const getTopProductsData = () => {
    const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};
    
    filteredSales.flatMap(s => s.items).forEach(item => {
      if (!productSales[item.sku]) {
        productSales[item.sku] = {
          name: item.name,
          sold: 0,
          revenue: 0
        };
      }
      productSales[item.sku].sold += item.qty;
      productSales[item.sku].revenue += item.price * item.qty;
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  /* ---------------- Category Distribution ---------------- */
  const getCategoryData = () => {
    const categorySales: Record<string, number> = {};
    
    filteredSales.flatMap(s => s.items).forEach(item => {
      const category = item.category || 'Uncategorized';
      categorySales[category] = (categorySales[category] || 0) + (item.price * item.qty);
    });
    
    return Object.entries(categorySales).map(([name, value]) => ({
      name,
      value
    }));
  };

  /* ---------------- Inventory Health ---------------- */
  const getInventoryHealth = () => {
    const totalValue = inventory.reduce((sum, item) => sum + (item.cost * item.stock), 0);
    const lowStockValue = inventory
      .filter(item => item.stock <= item.reorderPoint)
      .reduce((sum, item) => sum + (item.cost * item.stock), 0);
    const outOfStockItems = inventory.filter(item => item.stock === 0).length;
    
    return {
      totalValue,
      lowStockValue,
      outOfStockItems,
      turnoverRate: filteredSales.length > 0 ? (totalValue / filteredSales.length).toFixed(2) : 0
    };
  };

  /* ---------------- Top Customers ---------------- */
  const getTopCustomers = () => {
    const customerSpending: Record<string, { name: string; total: number; orders: number }> = {};
    
    filteredSales.forEach(sale => {
      if (!customerSpending[sale.customerName]) {
        customerSpending[sale.customerName] = {
          name: sale.customerName,
          total: 0,
          orders: 0
        };
      }
      customerSpending[sale.customerName].total += sale.totalAmount;
      customerSpending[sale.customerName].orders += 1;
    });
    
    return Object.values(customerSpending)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  /* ---------------- Export Function ---------------- */
  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const data = {
      kpis,
      sales: filteredSales,
      inventory: inventory,
      period: timeRange,
      generatedAt: new Date().toISOString()
    };
    
    alert(`Exporting ${format.toUpperCase()} report...`);
    // In real implementation, generate and download file
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading report data...</p>
        </div>
      </div>
    );
  }

  const inventoryHealth = getInventoryHealth();
  const topProducts = getTopProductsData();
  const topCustomers = getTopCustomers();
  const categoryData = getCategoryData();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your store performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
            <SelectTrigger className="w-[180px]">
              <BarChart3 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="sales">Sales Report</SelectItem>
              <SelectItem value="inventory">Inventory Report</SelectItem>
              <SelectItem value="customers">Customer Report</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.label}
              </CardTitle>
              <div className={`p-2 rounded-full ${kpi.change >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {kpi.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {kpi.change >= 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {kpi.change >= 0 ? '+' : ''}{kpi.change.toFixed(1)}%
                </span>
                <span className="ml-2">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={reportType} onValueChange={(value) => setReportType(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Daily revenue and order count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getSalesTrendData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        name="Revenue ($)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                        name="Orders"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>By revenue this period</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Units Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.sold}</TableCell>
                        <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                          label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`
                        }

                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Analysis Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales vs Purchases</CardTitle>
                <CardDescription>Comparison over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Sales', value: filteredSales.reduce((sum, s) => sum + s.totalAmount, 0) },
                      { name: 'Purchases', value: filteredPurchases.reduce((sum, p) => p.total, 0) },
                      { name: 'Profit', value: filteredSales.reduce((sum, s) => sum + s.totalAmount, 0) - 
                        filteredPurchases.reduce((sum, p) => p.total, 0) }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution by payment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(
                          filteredSales.reduce((acc, sale) => {
                            acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                          label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`
                        }

                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Status Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Inventory Value</span>
                  <span className="text-2xl font-bold">${inventoryHealth.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Low Stock Value</span>
                  <span className="text-2xl font-bold text-amber-600">${inventoryHealth.lowStockValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Out of Stock Items</span>
                  <Badge variant={inventoryHealth.outOfStockItems > 0 ? "destructive" : "default"}>
                    {inventoryHealth.outOfStockItems}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Turnover Rate</span>
                  <span className="text-2xl font-bold">{inventoryHealth.turnoverRate}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Items below reorder point</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory
                      .filter(item => item.stock <= item.reorderPoint)
                      .slice(0, 5)
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Badge variant={item.stock === 0 ? "destructive" : "secondary"}>
                              {item.stock}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.reorderPoint}</TableCell>
                          <TableCell>
                            {item.stock === 0 ? (
                              <span className="flex items-center text-red-600">
                                <AlertCircle className="mr-1 h-4 w-4" />
                                Out of Stock
                              </span>
                            ) : (
                              <span className="flex items-center text-amber-600">
                                <Clock className="mr-1 h-4 w-4" />
                                Low Stock
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Insights Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>By total spending</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead className="text-right">Avg. Order Value</TableHead>
                    <TableHead>Customer Since</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-right">{customer.orders}</TableCell>
                      <TableCell className="text-right">${customer.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        ${(customer.total / customer.orders).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {filteredSales.find(s => s.customerName === customer.name)?.date.split('T')[0] || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Reports</CardTitle>
          <CardDescription>Generate detailed reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4" onClick={() => setReportType('sales')}>
              <div className="text-left">
                <div className="font-semibold">Sales Detail Report</div>
                <div className="text-sm text-muted-foreground">Daily sales breakdown</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4" onClick={() => setReportType('inventory')}>
              <div className="text-left">
                <div className="font-semibold">Inventory Report</div>
                <div className="text-sm text-muted-foreground">Stock levels & valuation</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4" onClick={() => handleExport('excel')}>
              <div className="text-left">
                <div className="font-semibold">Financial Summary</div>
                <div className="text-sm text-muted-foreground">P&L statement</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4" onClick={() => handleExport('pdf')}>
              <div className="text-left">
                <div className="font-semibold">Custom Report</div>
                <div className="text-sm text-muted-foreground">Build your own report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}