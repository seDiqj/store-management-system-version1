"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  RotateCcw,
  FilterX,
  MoreVertical,
  Search,
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import AddProductDialog from "./../components/AddProductDialog";

/* ---------- Types ---------- */
type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  stock: number;
  cost: number;
  price: number;
  status: "in_stock" | "low" | "out";
  condition: "new" | "used" | "returned";
  usageDuration?: string;
  warranty?: string;
  defects?: string;
  purchaseDate?: string;
  supplier?: string;
  location?: string;
  returnReason?: string;
};

type SelectedProducts = {
  [key: string]: boolean;
};

/* ---------- Helper ---------- */
const computeStatus = (stock: number): Product["status"] => {
  if (stock === 0) return "out";
  if (stock <= 5) return "low";
  return "in_stock";
};

/* ---------- Status Badge ---------- */
function StatusBadge({ status }: { status: Product["status"] }) {
  if (status === "in_stock")
    return <Badge className="bg-green-600">In Stock</Badge>;
  if (status === "low")
    return <Badge variant="secondary">Low</Badge>;
  return <Badge variant="destructive">Out</Badge>;
}

/* ---------- KPI Card ---------- */
function KpiCard({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default" 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  variant?: "default" | "success" | "warning" | "danger" 
}) {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${variantClasses[variant]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PurchasesPage() {
  const [activeTab, setActiveTab] = useState<"new" | "used" | "returned">("new");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [returnReason, setReturnReason] = useState("");
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  /* ---------- Load ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("purchases");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as any[];
        const normalized: Product[] = parsed.map((item) => ({
          id: String(item.id ?? Date.now().toString()),
          name: String(item.name ?? ""),
          sku: String(item.sku ?? ""),
          category: String(item.category ?? ""),
          brand: String(item.brand ?? ""),
          stock: Number(item.stock ?? 0),
          cost: Number(item.cost ?? 0),
          price: Number(item.price ?? 0),
          status: computeStatus(Number(item.stock ?? 0)),
          condition: item.condition === "used" || item.condition === "returned"
            ? item.condition
            : "new",
          usageDuration: item.usageDuration,
          warranty: item.warranty,
          defects: item.defects,
          purchaseDate: item.purchaseDate,
          supplier: item.supplier,
          location: item.location,
          returnReason: item.returnReason,
        }));
        setProducts(normalized);
      } catch {
        setProducts([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(products));
  }, [products]);

  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand)));

  const filteredProducts = products.filter(product => {
    if (product.condition !== activeTab) return false;

    if (
      filter &&
      !product.name.toLowerCase().includes(filter.toLowerCase()) &&
      !product.sku.toLowerCase().includes(filter.toLowerCase())
    )
      return false;

    if (categoryFilter !== "all" && product.category !== categoryFilter)
      return false;

    if (brandFilter !== "all" && product.brand !== brandFilter)
      return false;

    if (statusFilter !== "all" && product.status !== statusFilter)
      return false;

    return true;
  });

  const handleAddProduct = (newProduct: Partial<Product>) => {
    const condition: Product["condition"] =
      newProduct.condition === "used" || newProduct.condition === "returned"
        ? newProduct.condition
        : "new";

    const product: Product = {
      id: Date.now().toString(),
      name: String(newProduct.name ?? ""),
      sku: String(newProduct.sku ?? ""),
      category: String(newProduct.category ?? ""),
      brand: String(newProduct.brand ?? ""),
      stock: Number(newProduct.stock ?? 0),
      cost: Number(newProduct.cost ?? 0),
      price: Number(newProduct.price ?? 0),
      status: computeStatus(Number(newProduct.stock ?? 0)),
      condition,
      usageDuration: newProduct.usageDuration,
      warranty: newProduct.warranty,
      defects: newProduct.defects,
      purchaseDate: new Date().toISOString().split('T')[0],
      supplier: newProduct.supplier || "Default Supplier",
      location: newProduct.location || "Main Warehouse",
    };

    setProducts(prev => [...prev, product]);
  };

  const toggleAll = () => {
    if (
      Object.values(selectedProducts).filter(Boolean).length ===
      filteredProducts.length
    ) {
      setSelectedProducts({});
    } else {
      const obj: SelectedProducts = {};
      filteredProducts.forEach(p => (obj[p.id] = true));
      setSelectedProducts(obj);
    }
  };

  const toggleRow = (id: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;
  const selectedIds = Object.keys(selectedProducts).filter(id => selectedProducts[id]);

  const handleDeleteSelected = () => {
    const ids = Object.keys(selectedProducts).filter(id => selectedProducts[id]);
    setProducts(products.filter(p => !ids.includes(p.id)));
    setSelectedProducts({});
  };
  const handleReturnSelected = () => {
    const ids = Object.keys(selectedProducts).filter(id => selectedProducts[id]);
    const updated: Product[] = products.map(p =>
      ids.includes(p.id)
        ? { 
            ...p, 
            condition: "returned" as Product["condition"], 
            location: "Returns Dept",
            returnReason: returnReason
          }
        : p
    );
    setProducts(updated);
    setSelectedProducts({});
    setReturnReason("");
    setReturnDialogOpen(false);
  };

  /* ---------- KPI ---------- */
  const totalValue = products.reduce((sum, p) => sum + p.cost * p.stock, 0);
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.status === "low").length;
  const outOfStockCount = products.filter(p => p.status === "out").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Purchases</h1>
        <p className="text-muted-foreground">
          Manage your products inventory
        </p>
      </div>

      {/* Tabs - Full Width */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">New Products</TabsTrigger>
          <TabsTrigger value="used">Used Products</TabsTrigger>
          <TabsTrigger value="returned">Returned Products</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between mt-6">
          <div className="flex gap-3 flex-wrap">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {brands.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="out">Out</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setFilter("");
                setCategoryFilter("all");
                setBrandFilter("all");
                setStatusFilter("all");
              }}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <AddProductDialog onAdd={handleAddProduct} />
          </div>
        </div>
        {/* Action Icons - Only icons when items are selected */}
        {selectedCount > 0 && (
          <div className="flex gap-2 mt-4 p-3 bg-muted/50 rounded-lg">
            <Button variant="ghost" size="icon" title="Edit">
              <Edit className="h-5 w-5" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Delete">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will delete {selectedCount} selected product{selectedCount > 1 ? 's' : ''}. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteSelected}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {activeTab !== "returned" && (
              <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" title="Return">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Return Products</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for returning {selectedCount} product{selectedCount > 1 ? 's' : ''}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Enter return reason..."
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setReturnDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleReturnSelected}>
                      Confirm Return
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            
            <div className="ml-auto text-sm text-muted-foreground">
              {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
            </div>
          </div>
        )}

        {/* Table */}
        <TabsContent value={activeTab} className="mt-4">
          <ProductTable
            products={filteredProducts}
            selectedProducts={selectedProducts}
            onSelectAll={toggleAll}
            onSelectProduct={toggleRow}
            activeTab={activeTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Product Table ---------- */
function ProductTable({
  products,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  activeTab,
}: {
  products: Product[];
  selectedProducts: SelectedProducts;
  onSelectAll: () => void;
  onSelectProduct: (id: string) => void;
  activeTab: "new" | "used" | "returned";
}) {
  const allSelected = products.length > 0 && 
    Object.values(selectedProducts).filter(Boolean).length === products.length;
  const someSelected = Object.values(selectedProducts).filter(Boolean).length > 0 && 
    Object.values(selectedProducts).filter(Boolean).length < products.length;
    if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">No products found</div>
            <div className="text-sm text-muted-foreground">
              Add products using the "Add Product" button above
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <div className="flex items-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onSelectAll}
                    ref={undefined}
                  />
                </div>
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Condition</TableHead>
              {activeTab === "returned" && <TableHead>Return Reason</TableHead>}
              <TableHead>Purchase Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts[p.id] || false}
                    onCheckedChange={() => onSelectProduct(p.id)}
                    ref={undefined}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.sku}</div>
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>${p.cost.toFixed(2)}</TableCell>
                <TableCell>${p.price.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell>
                  {p.condition === "new" && (
                    <Badge className="bg-blue-600">New</Badge>
                  )}
                  {p.condition === "used" && (
                    <Badge variant="secondary">Used</Badge>
                  )}
                  {p.condition === "returned" && (
                    <Badge variant="destructive">Returned</Badge>
                  )}
                </TableCell>
                {activeTab === "returned" && (
                  <TableCell className="max-w-[200px] truncate">
                    {p.returnReason || "No reason provided"}
                  </TableCell>
                )}
                <TableCell>{p.purchaseDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}