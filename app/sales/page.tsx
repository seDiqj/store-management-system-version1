"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Printer, Eye } from "lucide-react";

import CustomerCheckoutSection from "./../components/sell/CustomerSection";

/* ---------------- Types ---------------- */
type Product = {
  name: string;
  sku: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
  status: "in_stock" | "low" | "out";
};

type CartItem = Product & { qty: number };

type SaleRecord = {
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  date: string;
  receiptNumber: string;
  totalAmount: number;
  paymentMethod?: string;
  tax?: number;
  discount?: number;
};

export default function SalesPagePhase1() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [showHistory, setShowHistory] = useState(false);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<SaleRecord | null>(null);
  const [selectedSaleDetail, setSelectedSaleDetail] = useState<SaleRecord | null>(null);
  const [saleDetailOpen, setSaleDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  /* Load inventory */
  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInventory(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Error parsing inventory:", error);
        setInventory([]);
      }
    }
  }, []);

  /* Load sales history */
  useEffect(() => {
    if (showHistory) {
      setLoading(true);
      try {
        // سعی می‌کنیم از چند کلید مختلف بخوانیم برای سازگاری
        let storedSalesData = localStorage.getItem("sales_history");
        if (!storedSalesData) {
          storedSalesData = localStorage.getItem("sales");
        }
        
        if (storedSalesData) {
          const parsed = JSON.parse(storedSalesData);
          // مطمئن شویم که آرایه است و داده‌ها را پاکسازی کنیم
          if (Array.isArray(parsed)) {
            // فیلتر کردن داده‌های نامعتبر و اضافه کردن مقادیر پیش‌فرض
            const cleanedSales = parsed
              .filter(sale => sale && typeof sale === 'object')
              .map(sale => ({
                ...sale,
                items: Array.isArray(sale.items) ? sale.items : [],
                customer: sale.customer || { name: "", phone: "", email: "", address: "" },
                date: sale.date || new Date().toISOString(),
                receiptNumber: sale.receiptNumber || 'N/A',
                totalAmount: typeof sale.totalAmount === 'number' ? sale.totalAmount : 0,
                paymentMethod: sale.paymentMethod || "Cash",
                tax: typeof sale.tax === 'number' ? sale.tax : 0,
                discount: typeof sale.discount === 'number' ? sale.discount : 0
              }));
            setSales(cleanedSales);
          } else {
            setSales([]);
          }
        } else {
          setSales([]);
        }
      } catch (error) {
        console.error("Error loading sales history:", error);
        setSales([]);
      } finally {
        setLoading(false);
      }
    }
  }, [showHistory]);

  /* Filter products */
  const filteredProducts = inventory.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  /* Add to cart */
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.sku === product.sku);
      if (existing) {
        return prev.map((i) =>
          i.sku === product.sku ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  /* Remove from cart */
  const removeFromCart = (sku: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.sku === sku);
      if (existing && existing.qty > 1) {
        return prev.map((i) =>
          i.sku === sku ? { ...i, qty: i.qty - 1 } : i
        );
      }
      return prev.filter((i) => i.sku !== sku);
    });
  };

  /* Calculate total for cart */
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  /* Generate receipt number */
  const generateReceiptNumber = () => {
    return 'RCP-' + Date.now().toString().slice(-8);
  };

  /* Complete Sale */
  const completeSale = () => {
    const receiptNumber = generateReceiptNumber();
    const totalAmount = calculateCartTotal();
    
    const sale: SaleRecord = {
      items: [...cart],
      customer: { ...customer },
      date: new Date().toISOString(),
      receiptNumber,
      totalAmount,
      paymentMethod: "Cash",
      tax: 0,
      discount: 0
    };

    // Set current receipt for modal
    setCurrentReceipt(sale);
    setReceiptOpen(true);

    // Save to sales history - با کلید سازگار با صفحه گزارشات
    try {
      // ابتدا داده‌های موجود را می‌خوانیم
      let existingSales: SaleRecord[] = [];
      const storedSalesHistory = localStorage.getItem("sales_history");
      
      if (storedSalesHistory) {
        try {
          const parsed = JSON.parse(storedSalesHistory);
          if (Array.isArray(parsed)) {
            existingSales = parsed.filter(s => s && typeof s === 'object');
          }
        } catch (e) {
          console.error("Error parsing existing sales:", e);
        }
      }
      
      // فروش جدید را اضافه می‌کنیم
      existingSales.push(sale);
      
      // در localStorage ذخیره می‌کنیم - با کلید سازگار
      localStorage.setItem("sales_history", JSON.stringify(existingSales));
      localStorage.setItem("sales", JSON.stringify(existingSales)); // برای سازگاری با این صفحه
      
      // Update inventory
      const updatedInventory = inventory.map((p) => {
        const item = cart.find((c) => c.sku === p.sku);
        if (!item) return p;
        return { ...p, stock: Math.max(0, p.stock - item.qty) };
      });

      setInventory(updatedInventory);
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));

      // Clear cart and customer
      setCart([]);
      setCustomer({ name: "", phone: "", email: "", address: "" });
      
      // به‌روزرسانی لیست sales برای نمایش فوری
      setSales(existingSales.map(s => ({
        ...s,
        items: Array.isArray(s.items) ? s.items : [],
        customer: s.customer || { name: "", phone: "", email: "", address: "" },
        totalAmount: typeof s.totalAmount === 'number' ? s.totalAmount : 0
      })));
    } catch (error) {
      console.error("Error saving sale:", error);
    }
  };

  /* Print receipt */
  const handlePrint = () => {
    const printContent = document.getElementById('printable-receipt');
    if (printContent && currentReceipt) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<!DOCTYPE html>
  <html>
    <head>
      <title>Sales Receipt</title>
      <style>
        @media print {
          body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
          .receipt { width: 100%; max-width: 800px; margin: 0 auto; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { font-weight: bold; background-color: #f5f5f5; }
          .total-row { font-weight: bold; font-size: 1.1em; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .border-top { border-top: 2px solid #000; padding-top: 10px; }
          .company-header { text-align: center; margin-bottom: 20px; }
          .customer-info, .sale-details { margin-bottom: 15px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        }
      </style>
    </head>
    <body>
      ${printContent.innerHTML}
    </body>
  </html>`);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  /* Show sale details in modal */
  const showSaleDetails = (sale: SaleRecord) => {
    // اطمینان از وجود مقادیر
    const safeSale = {
      ...sale,
      items: Array.isArray(sale.items) ? sale.items : [],
      customer: sale.customer || { name: "", phone: "", email: "", address: "" },
      totalAmount: typeof sale.totalAmount === 'number' ? sale.totalAmount : 0,
      receiptNumber: sale.receiptNumber || 'N/A',
      date: sale.date || new Date().toISOString(),
      paymentMethod: sale.paymentMethod || "Cash",
      tax: typeof sale.tax === 'number' ? sale.tax : 0,
      discount: typeof sale.discount === 'number' ? sale.discount : 0
    };
    
    setSelectedSaleDetail(safeSale);
    setSaleDetailOpen(true);
  };

  // تابع کمکی برای محاسبه ایمن مجموع
  const getTotalItems = (sale: SaleRecord) => {
    if (!Array.isArray(sale.items)) return 0;
    return sale.items.reduce((total, item) => {
      const qty = typeof item.qty === 'number' ? item.qty : 0;
      return total + qty;
    }, 0);
  };

  // تابع کمکی برای گرفتن ایمن totalAmount
  const getSafeTotalAmount = (sale: SaleRecord) => {
    return typeof sale.totalAmount === 'number' ? sale.totalAmount : 0;
  };

  // تابع برای تشخیص حالت دارک مود
  const isDarkMode = () => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Receipt Modal */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Sales Receipt</DialogTitle>
          </DialogHeader>
          
          {currentReceipt && (
            <div id="printable-receipt" className="receipt-container p-6 bg-white text-gray-800">
              {/* Company Header */}
              <div className="company-header text-center mb-6">
                <h1 className="text-3xl font-bold mb-1">TECH STORE</h1>
                <p className="text-gray-600">Mobile & Electronics Shop</p>
                <p className="text-sm text-gray-500">123 Main Street, Kabul, Afghanistan</p>
                <p className="text-sm text-gray-500">Phone: +93 70 123 4567 | Email: info@techstore.af</p>
              </div>

              <div className="border-t border-b border-gray-300 py-4 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="customer-info">
                    <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {currentReceipt.customer.name || "Walk-in Customer"}
                    </p>
                    {currentReceipt.customer.phone && (
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span> {currentReceipt.customer.phone}
                      </p>
                      )}
                    {currentReceipt.customer.email && (
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {currentReceipt.customer.email}
                      </p>
                    )}
                  </div>
                  <div className="sale-details text-right">
                    <h3 className="font-semibold text-gray-700 mb-2">Sale Details</h3>
                    <p className="text-sm">
                      <span className="font-medium">Receipt #:</span> {currentReceipt.receiptNumber}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {new Date(currentReceipt.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time:</span> {new Date(currentReceipt.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <Table className="mb-6">
                <TableHeader>
                  <TableRow className="border-b-2 border-gray-800">
                    <TableHead className="font-bold text-gray-800">#</TableHead>
                    <TableHead className="font-bold text-gray-800">Product</TableHead>
                    <TableHead className="font-bold text-gray-800">SKU</TableHead>
                    <TableHead className="font-bold text-gray-800 text-right">Qty</TableHead>
                    <TableHead className="font-bold text-gray-800 text-right">Unit Price</TableHead>
                    <TableHead className="font-bold text-gray-800 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReceipt.items.map((item, index) => (
                    <TableRow key={item.sku} className="border-b border-gray-200">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-gray-600">{item.sku}</TableCell>
                      <TableCell className="text-right">{item.qty}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">${(item.price * item.qty).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="border-top border-gray-300 pt-4">
                <div className="flex justify-end">
                  <div className="w-72">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal:</span>
                      <span>${currentReceipt.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-lg font-bold border-t border-gray-300 pt-2 total-row">
                      <span>Total Amount:</span>
                      <span>${currentReceipt.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border-t border-gray-300 mt-6 pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Payment Method:</span> Cash
                      </p>
                    <p className="text-sm">
                      <span className="font-medium">Amount Paid:</span> ${currentReceipt.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      <span className="font-medium">Change:</span> $0.00
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="footer text-center mt-8 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Thank you for your purchase!</p>
                <p className="text-xs text-gray-500">Terms & Conditions:</p>
                <p className="text-xs text-gray-500">
                  • 7-day return policy with original receipt<br/>
                  • 1-year warranty on new products<br/>
                  • Defective items must be reported within 3 days
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  This is a computer-generated receipt. No signature required.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setReceiptOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sale Details Modal */}
      <Dialog open={saleDetailOpen} onOpenChange={setSaleDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Sale Details</DialogTitle>
          </DialogHeader>
          
          {selectedSaleDetail && (
            <div className="space-y-4">
              {/* Sale Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedSaleDetail.customer.name || "Walk-in Customer"}</p>
                    {selectedSaleDetail.customer.phone && (
                      <p><span className="font-medium">Phone:</span> {selectedSaleDetail.customer.phone}</p>
                    )}
                    {selectedSaleDetail.customer.email && (
                      <p><span className="font-medium">Email:</span> {selectedSaleDetail.customer.email}</p>
                    )}
                    {selectedSaleDetail.customer.address && (
                      <p><span className="font-medium">Address:</span> {selectedSaleDetail.customer.address}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sale Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Receipt #:</span> {selectedSaleDetail.receiptNumber}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedSaleDetail.date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Time:</span> {new Date(selectedSaleDetail.date).toLocaleTimeString()}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedSaleDetail.paymentMethod || "Cash"}</p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="font-semibold mb-2">Items Purchased</h3>
                <div className="border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(selectedSaleDetail.items) && selectedSaleDetail.items.map((item, index) => (
                        <TableRow key={`${item?.sku || index}-${index}`}>
                          <TableCell className="font-medium">{item?.name || "Unknown Product"}</TableCell>
                          <TableCell className="text-right">{item?.qty || 0}</TableCell>
                          <TableCell className="text-right">${(item?.price || 0).toFixed(2)}</TableCell>
                          <TableCell className="text-right">${((item?.price || 0) * (item?.qty || 0)).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal:</span>
                      <span>${getSafeTotalAmount(selectedSaleDetail).toFixed(2)}</span>
                    </div>
                    {selectedSaleDetail.discount && selectedSaleDetail.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span className="font-medium">Discount:</span>
                        <span>-${selectedSaleDetail.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedSaleDetail.tax && selectedSaleDetail.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="font-medium">Tax:</span>
                        <span>${selectedSaleDetail.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total Amount:</span>
                      <span>${getSafeTotalAmount(selectedSaleDetail).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setSaleDetailOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <p className="text-muted-foreground">
            Search & select products for sale
          </p>
        </div>

        <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide Sale History" : "View Sale History"}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name / SKU / scan barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Current Cart Summary */}
      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.sku} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.sku)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <div>${item.price.toFixed(2)} × {item.qty}</div>
                      <div className="font-bold">${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t">
                <div className="font-bold text-lg">Cart Total:</div>
                <div className="font-bold text-2xl">${calculateCartTotal().toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="max-h-[320px] overflow-y-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((p) => (
                  <TableRow key={p.sku}>
                    <TableCell className="font-medium">
                      {p.name}
                    </TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell>${p.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {p.status === "out" && (
                        <Badge variant="destructive">Out</Badge>
                      )}
                      {p.status === "low" && (
                        <Badge variant="secondary">Low</Badge>
                      )}
                      {p.status === "in_stock" && (
                        <Badge className="bg-green-600">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={p.stock === 0}
                        onClick={() => addToCart(p)}
                      >
                        Add to Cart
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Checkout */}
      <CustomerCheckoutSection
        customer={customer}
        setCustomer={setCustomer}
        cart={cart.map((i) => ({
          ...i,
          quantity: i.qty,
          id: i.sku,
        }))}
        onCompleteSale={completeSale}
      />

      {/* Sale History */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle>Sale History</CardTitle>
            {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
          </CardHeader>
          <CardContent>
            <div
              className="max-h-[400px] overflow-y-auto space-y-3"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {sales.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground">
                  No sales recorded
                </p>
              )}

              {sales.map((s, idx) => (
                <div 
                  key={idx} 
                  className="rounded-lg border p-3 text-sm cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: hoveredIndex === idx 
                      ? (isDarkMode() ? '#1e293b' : '#eff6ff') 
                      : 'transparent',
                    borderColor: hoveredIndex === idx 
                      ? (isDarkMode() ? '#475569' : '#93c5fd')
                      : (isDarkMode() ? '#334155' : '#e5e7eb'),
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => showSaleDetails(s)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {s.customer?.name || "Walk-in Customer"}
                        <Eye className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="text-muted-foreground text-xs mt-1">
                        Receipt: {s.receiptNumber || 'N/A'}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {s.date ? new Date(s.date).toLocaleString() : 'Unknown date'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${getSafeTotalAmount(s).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {getTotalItems(s)} items
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {Array.isArray(s.items) && s.items.slice(0, 3).map((item, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {item?.name || 'Unknown'} ×{item?.qty || 0}
                      </Badge>
                    ))}
                    {Array.isArray(s.items) && s.items.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{s.items.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}