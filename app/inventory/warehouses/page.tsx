"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";

export type Warehouse = {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive";
  capacity: number;
  createdAt: string;
};

const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: "1", name: "Main Warehouse", location: "City Center", status: "active", capacity: 5000, createdAt: new Date().toISOString() },
  { id: "2", name: "Backup Warehouse", location: "Industrial Zone", status: "inactive", capacity: 3000, createdAt: new Date().toISOString() },
];

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("warehouses");
    if (stored) setWarehouses(JSON.parse(stored));
    else {
      localStorage.setItem("warehouses", JSON.stringify(INITIAL_WAREHOUSES));
      setWarehouses(INITIAL_WAREHOUSES);
    }
  }, []);

  const save = (data: Warehouse[]) => {
    setWarehouses(data);
    localStorage.setItem("warehouses", JSON.stringify(data));
  };

  // Filters
  const filtered = useMemo(() => {
    return warehouses.filter(w => {
      const s = w.name.toLowerCase().includes(search.toLowerCase());
      const st = statusFilter === "all" || w.status === statusFilter;
      return s && st;
    });
  }, [warehouses, search, statusFilter]);

  // Add warehouse
  const addWarehouse = (w: Warehouse) => {
    save([w, ...warehouses]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Warehouses</h1>
        <p className="text-muted-foreground">Manage your warehouses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="relative w-64">
            <Input
              className="pl-2"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "active" | "inactive")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AddWarehouseDialog onAdd={addWarehouse} />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse List</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No warehouses found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(w => (
                  <TableRow key={w.id}>
                    <TableCell>{w.name}</TableCell>
                    <TableCell>{w.location}</TableCell>
                    <TableCell>
                      <Badge variant={w.status === "active" ? "secondary" : "destructive"}>
                        {w.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{w.capacity}</TableCell>
                    <TableCell>{new Date(w.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Add Warehouse Dialog ---------- */

function AddWarehouseDialog({ onAdd }: { onAdd: (w: Warehouse) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [capacity, setCapacity] = useState<number | "">("");

  const reset = () => {
    setName(""); setLocation(""); setStatus("active"); setCapacity("");
  };

  const handleAdd = () => {
    if (!name || !location || capacity === "") {
      alert("Please fill all required fields");
      return;
    }

    const newWarehouse: Warehouse = {
      id: crypto.randomUUID(),
      name,
      location,
      status,
      capacity: Number(capacity),
      createdAt: new Date().toISOString(),
    };

    onAdd(newWarehouse);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Warehouse</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Warehouse</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Warehouse name" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Location *</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Status *</label>
            <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Capacity *</label>
            <Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} placeholder="Capacity" />
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
          <Button onClick={handleAdd}>Add Warehouse</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}