"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Area,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  FileText,
  CreditCard,
  Building,
  Truck,
  Download,
  Filter,
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  Wallet,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Types
type FinancialTransaction = {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  reference: string;
  status: "completed" | "pending" | "cancelled";
  paymentMethod: string;
};

type CustomerCredit = {
  id: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  lastPaymentDate: string;
  dueDate: string;
  status: "paid" | "partial" | "overdue";
  notes: string;
};

type SupplierPayment = {
  id: string;
  supplierName: string;
  contact: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  items: string[];
};

type Expense = {
  id: string;
  date: string;
  category: "rent" | "utilities" | "salary" | "inventory" | "tax" | "transport" | "other";
  amount: number;
  description: string;
  paidBy: string;
  receiptNumber: string;
};

type AccountBalance = {
  id: string;
  name: string;
  type: "cash" | "bank" | "mobile_money";
  balance: number;
  lastUpdated: string;
};

export default function FinanceDashboard() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "quarter" | "year" | "all">("month");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [customerCredits, setCustomerCredits] = useState<CustomerCredit[]>([]);
  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<AccountBalance[]>([
    { id: "1", name: "Cash in Hand", type: "cash", balance: 25000, lastUpdated: new Date().toISOString() },
    { id: "2", name: "Bank Account", type: "bank", balance: 150000, lastUpdated: new Date().toISOString() },
    { id: "3", name: "Mobile Money", type: "mobile_money", balance: 50000, lastUpdated: new Date().toISOString() },
  ]);
  
  // Dialog states
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  
  // Form states
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    category: "other" as Expense["category"],
    amount: 0,
    description: "",
    paidBy: "cash",
  });
  
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "income" as "income" | "expense",
    category: "",
    amount: 0,
    description: "",
    paymentMethod: "cash",
  });

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      // Load transactions
      const storedTransactions = localStorage.getItem("financial_transactions");
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      
      // Load customer credits
      const storedCredits = localStorage.getItem("customer_credits");
      if (storedCredits) {
        setCustomerCredits(JSON.parse(storedCredits));
      }
      
      // Load supplier payments
      const storedSuppliers = localStorage.getItem("supplier_payments");
      if (storedSuppliers) {
        setSupplierPayments(JSON.parse(storedSuppliers));
      }
      
      // Load expenses
      const storedExpenses = localStorage.getItem("expenses");
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
    };
    
    loadData();
  }, []);

  // Calculate financial KPIs
  const calculateFinancialKPIs = () => {
    const filteredTransactions = transactions.filter(t => 
      filterByDateRange(t.date, timeRange)
    );
    
    const filteredExpenses = expenses.filter(e =>
      filterByDateRange(e.date, timeRange)
    );
    
    const totalRevenue = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0) +
      filteredTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const cogs = filteredExpenses
      .filter(e => e.category === "inventory")
      .reduce((sum, e) => sum + e.amount, 0);
    
    const totalAccountsBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const totalCustomerCredit = customerCredits.reduce((sum, c) => sum + c.dueAmount, 0);
    const totalSupplierDebt = supplierPayments.reduce((sum, s) => sum + s.dueAmount, 0);
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      cogs,
      totalAccountsBalance,
      totalCustomerCredit,
      totalSupplierDebt,
      profitMargin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0,
    };
  };

  // Filter by date range
  const filterByDateRange = (dateString: string, range: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    switch (range) {
      case "today":
        return date.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return date >= weekAgo;
      case "month":
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear();
      case "quarter":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        return Math.floor(date.getMonth() / 3) === currentQuarter &&
               date.getFullYear() === now.getFullYear();
      case "year":
        return date.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const financialKPIs = calculateFinancialKPIs();

  // Prepare chart data
  const revenueExpenseData = [
    { month: "Jan", revenue: 50000, expenses: 30000 },
    { month: "Feb", revenue: 55000, expenses: 32000 },
    { month: "Mar", revenue: 60000, expenses: 35000 },
    { month: "Apr", revenue: 58000, expenses: 34000 },
    { month: "May", revenue: 62000, expenses: 38000 },
    { month: "Jun", revenue: 65000, expenses: 40000 },
  ];

  const expenseCategoryData = [
    { name: "Inventory", value: 40 },
    { name: "Salary", value: 25 },
    { name: "Rent", value: 15 },
    { name: "Utilities", value: 10 },
    { name: "Transport", value: 5 },
    { name: "Other", value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Handle add expense
  const handleAddExpense = () => {
    const newExpenseItem: Expense = {
      id: `EXP-${Date.now()}`,
      date: newExpense.date,
      category: newExpense.category,
      amount: newExpense.amount,
      description: newExpense.description,
      paidBy: newExpense.paidBy,
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
    };
    
    const updatedExpenses = [...expenses, newExpenseItem];
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: "other",
      amount: 0,
      description: "",
      paidBy: "cash",
    });
    setAddExpenseOpen(false);
  };

  // Handle add transaction
  const handleAddTransaction = () => {
    const newTransactionItem: FinancialTransaction = {
      id: `TRX-${Date.now()}`,
      date: newTransaction.date,
      type: newTransaction.type,
      category: newTransaction.category,
      amount: newTransaction.amount,
      description: newTransaction.description,
      reference: `REF-${Date.now().toString().slice(-8)}`,
      status: "completed",
      paymentMethod: newTransaction.paymentMethod,
    };
    
    const updatedTransactions = [...transactions, newTransactionItem];
    setTransactions(updatedTransactions);
    localStorage.setItem("financial_transactions", JSON.stringify(updatedTransactions));
    
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      type: "income",
      category: "",
      amount: 0,
      description: "",
      paymentMethod: "cash",
    });
    setAddTransactionOpen(false);
  };

  // Export report
  const handleExportReport = (format: "pdf" | "excel") => {
    const data = {
      kpis: financialKPIs,
      transactions: transactions.filter(t => filterByDateRange(t.date, timeRange)),
      expenses: expenses.filter(e => filterByDateRange(e.date, timeRange)),
      customerCredits,
      supplierPayments,
      period: timeRange,
      generatedAt: new Date().toISOString(),
    };
    
    alert(`Exporting ${format.toUpperCase()} report...`);
    // In real implementation, generate and download file
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your store's financial health
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
          
          <Select value={selectedTab} onValueChange={setSelectedTab}>
            <SelectTrigger className="w-[180px]">
              <FileText className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expenses">Expenses</SelectItem>
              <SelectItem value="profit-loss">Profit & Loss</SelectItem>
              <SelectItem value="transactions">Transactions</SelectItem>
              <SelectItem value="credits">Customer Credits</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => handleExportReport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Financial KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialKPIs.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All income sources</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialKPIs.totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All costs & expenditures</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <TrendingUp className={`h-4 w-4 ${financialKPIs.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${financialKPIs.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${financialKPIs.netProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {financialKPIs.profitMargin.toFixed(1)}% profit margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">COGS</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialKPIs.cogs.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Cost of Goods Sold</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        name="Revenue"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                        name="Expenses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                        }

                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accounts & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>Current cash positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">{account.type.replace('_', ' ')}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${account.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total Balance:</span>
                      <span>${financialKPIs.totalAccountsBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Quick overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Assets:</span>
                        <span className="font-medium">${(financialKPIs.totalAccountsBalance + financialKPIs.totalCustomerCredit).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Customer Credits:</span>
                        <Badge variant="outline" className="text-amber-600">
                          ${financialKPIs.totalCustomerCredit.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Supplier Debts:</span>
                        <Badge variant="outline" className="text-red-600">
                          ${financialKPIs.totalSupplierDebt.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Daily Revenue:</span>
                        <span className="font-medium">${(financialKPIs.totalRevenue / 30).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Daily Expenses:</span>
                        <span className="font-medium">${(financialKPIs.totalExpenses / 30).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cash Flow:</span>
                        <Badge variant={financialKPIs.netProfit >= 0 ? "default" : "destructive"}>
                          {financialKPIs.netProfit >= 0 ? "Positive" : "Negative"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Income Tab */}
        <TabsContent value="income" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Income Analysis</h2>
            <Button onClick={() => setAddTransactionOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Product Sales", value: 45000 },
                    { name: "Services", value: 12000 },
                    { name: "Installation", value: 8000 },
                    { name: "Other", value: 5000 },
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
              <CardTitle>Recent Income Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .filter(t => t.type === "income")
                    .slice(0, 10)
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.status === "completed" ? "default" :
                            transaction.status === "pending" ? "secondary" : "destructive"
                          }>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Expense Management</h2>
            <Button onClick={() => setAddExpenseOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,500</div>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Utilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$850</div>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$8,000</div>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$25,000</div>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.slice(0, 10).map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{formatDate(expense.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        ${expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{expense.paidBy}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profit & Loss Tab */}
        <TabsContent value="profit-loss" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>For {timeRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Income Section */}
                <div>
                  <h3 className="font-semibold mb-2">Income</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Product Sales</span>
                      <span className="font-medium">${(financialKPIs.totalRevenue * 0.8).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Services</span>
                      <span className="font-medium">${(financialKPIs.totalRevenue * 0.15).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Income</span>
                      <span className="font-medium">${(financialKPIs.totalRevenue * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span>Total Income</span>
                      <span className="text-green-600">${financialKPIs.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses Section */}
                <div>
                  <h3 className="font-semibold mb-2">Expenses</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cost of Goods Sold</span>
                      <span className="font-medium">${financialKPIs.cogs.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operating Expenses</span>
                      <span className="font-medium">${(financialKPIs.totalExpenses - financialKPIs.cogs).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span>Total Expenses</span>
                      <span className="text-red-600">${financialKPIs.totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Net Profit */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Profit/Loss</span>
                    <span className={financialKPIs.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${financialKPIs.netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Profit Margin: {financialKPIs.profitMargin.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 15).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                      <TableCell className={`text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        ${transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.status === "completed" ? "default" :
                          transaction.status === "pending" ? "secondary" : "destructive"
                        }>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{transaction.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Credits Tab */}
        <TabsContent value="credits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Customer Credits</CardTitle>
                <CardDescription>Outstanding customer debts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerCredits.map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell className="font-medium">{credit.customerName}</TableCell>
                        <TableCell>{credit.phone}</TableCell>
                        <TableCell>${credit.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>${credit.paidAmount.toLocaleString()}</TableCell>
                        <TableCell className="font-bold">${credit.dueAmount.toLocaleString()}</TableCell>
                        <TableCell>{formatDate(credit.dueDate)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            credit.status === "paid" ? "default" :
                            credit.status === "partial" ? "secondary" : "destructive"
                          }>
                            {credit.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Payments</CardTitle>
                <CardDescription>Pending supplier debts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierPayments.map((supplier) => (
                    <div key={supplier.id} className="p-3 border rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{supplier.supplierName}</div>
                          <div className="text-sm text-muted-foreground">{supplier.contact}</div>
                        </div>
                        <Badge variant={supplier.status === "paid" ? "default" : "destructive"}>
                          {supplier.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>${supplier.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Due:</span>
                          <span className="font-bold">${supplier.dueAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Due Date:</span>
                          <span>{formatDate(supplier.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Expense Dialog */}
      <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Record a new expense for your store.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newExpense.category}
                onValueChange={(value: Expense["category"]) =>
                  setNewExpense({ ...newExpense, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="tax">Tax</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Enter expense details..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paidBy" className="text-right">
                Payment Method
              </Label>
              <Select
                value={newExpense.paidBy}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, paidBy: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExpenseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>Save Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={addTransactionOpen} onOpenChange={setAddTransactionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Record a new income or expense transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newTransaction.type}
                onValueChange={(value: "income" | "expense") =>
                  setNewTransaction({ ...newTransaction, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                className="col-span-3"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                placeholder="e.g., Sales, Services, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                placeholder="Enter transaction details..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">
                Payment Method
              </Label>
              <Select
                value={newTransaction.paymentMethod}
                onValueChange={(value) =>
                  setNewTransaction({ ...newTransaction, paymentMethod: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTransactionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}