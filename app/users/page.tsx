"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Plus, Pencil } from "lucide-react";

/* ---------------- Types ---------------- */
type Role =
  | "admin"
  | "manager"
  | "cashier"
  | "warehouse"
  | "viewer";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
};

/* ---------------- Helpers ---------------- */
const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  cashier: "Cashier",
  warehouse: "Warehouse",
  viewer: "Viewer",
};

/* ---------------- Page ---------------- */
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  /* Load users */
  useEffect(() => {
    const stored = localStorage.getItem("users");
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      const initial: User[] = [
        {
          id: crypto.randomUUID(),
          name: "System Admin",
          email: "admin@system.local",
          role: "admin",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("users", JSON.stringify(initial));
      setUsers(initial);
    }
  }, []);

  const saveUsers = (data: User[]) => {
    setUsers(data);
    localStorage.setItem("users", JSON.stringify(data));
  };

  const toggleActive = (id: string) => {
    saveUsers(
      users.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      )
    );
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage system users & permissions
          </p>
        </div>

        <AddUserDialog onAdd={(u) => saveUsers([u, ...users])} />
      </div>

      {/* Search */}
      <Input
        placeholder="Search user name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.name}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {ROLE_LABELS[u.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={u.active}
                        onCheckedChange={() =>
                          toggleActive(u.id)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled
                      >
                        <Pencil size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Add User Dialog ---------------- */
function AddUserDialog({
  onAdd,
}: {
  onAdd: (user: User) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("cashier");

  const submit = () => {
    if (!name || !email) return;

    onAdd({
      id: crypto.randomUUID(),
      name,
      email,
      role,
      active: true,
      createdAt: new Date().toISOString(),
    });

    setName("");
    setEmail("");
    setRole("cashier");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} /> Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email / Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROLE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={submit}>Create User</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
