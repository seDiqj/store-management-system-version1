"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  UserPlus,
  Shield,
  Key,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Filter,
  Search,
  Download,
  Upload,
  UserCheck,
  UserX,
  Activity,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

// Types
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastLogin: string;
  department: string;
  permissions: string[];
  avatar?: string;
  address?: string;
  notes?: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  createdAt: string;
  isDefault: boolean;
  canDelete: boolean;
};

type Permission = {
  id: string;
  name: string;
  category: string;
  description: string;
  roles: string[];
  createdAt: string;
};

type AuditLog = {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: string;
};

type Department = {
  id: string;
  name: string;
  managerId: string;
  userCount: number;
  description: string;
};

export default function UsersAndPermissionsPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  // Data states
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Ahmad Khan",
      email: "ahmad@techstore.af",
      phone: "+93 70 123 4567",
      role: "admin",
      status: "active",
      joinDate: "2023-01-15",
      lastLogin: "2024-01-20",
      department: "Management",
      permissions: ["all"],
      avatar: "/avatars/ahmad.jpg",
    },
    {
      id: "2",
      name: "Sara Mohammadi",
      email: "sara@techstore.af",
      phone: "+93 70 987 6543",
      role: "manager",
      status: "active",
      joinDate: "2023-03-10",
      lastLogin: "2024-01-19",
      department: "Sales",
      permissions: ["view_sales", "edit_products", "manage_inventory"],
    },
    {
      id: "3",
      name: "Karim Azizi",
      email: "karim@techstore.af",
      phone: "+93 70 555 1234",
      role: "cashier",
      status: "active",
      joinDate: "2023-05-20",
      lastLogin: "2024-01-20",
      department: "Sales",
      permissions: ["process_sales", "view_inventory"],
    },
    {
      id: "4",
      name: "Zahra Habibi",
      email: "zahra@techstore.af",
      phone: "+93 70 777 8888",
      role: "inventory_manager",
      status: "active",
      joinDate: "2023-07-12",
      lastLogin: "2024-01-18",
      department: "Inventory",
      permissions: ["manage_inventory", "view_reports"],
    },
    {
      id: "5",
      name: "Jamal Rahimi",
      email: "jamal@techstore.af",
      phone: "+93 70 999 0000",
      role: "viewer",
      status: "inactive",
      joinDate: "2023-09-05",
      lastLogin: "2023-12-15",
      department: "Finance",
      permissions: ["view_reports"],
    },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Admin",
      description: "Full system access",
      userCount: 1,
      permissions: ["all"],
      createdAt: "2023-01-01",
      isDefault: false,
      canDelete: false,
    },
    {
      id: "2",
      name: "Manager",
      description: "Department management access",
      userCount: 1,
      permissions: ["view_sales", "edit_products", "manage_inventory", "view_reports"],
      createdAt: "2023-01-01",
      isDefault: false,
      canDelete: true,
    },
    {
      id: "3",
      name: "Cashier",
      description: "Sales processing access",
      userCount: 2,
      permissions: ["process_sales", "view_inventory"],
      createdAt: "2023-01-01",
      isDefault: true,
      canDelete: true,
    },
    {
      id: "4",
      name: "Inventory Manager",
      description: "Inventory management access",
      userCount: 1,
      permissions: ["manage_inventory", "view_reports"],
      createdAt: "2023-01-01",
      isDefault: false,
      canDelete: true,
    },
    {
      id: "5",
      name: "Viewer",
      description: "Read-only access",
      userCount: 1,
      permissions: ["view_reports", "view_sales"],
      createdAt: "2023-01-01",
      isDefault: false,
      canDelete: true,
    },
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: "1", name: "view_dashboard", category: "General", description: "View main dashboard", roles: ["admin", "manager", "inventory_manager", "viewer"], createdAt: "2023-01-01" },
    { id: "2", name: "view_sales", category: "Sales", description: "View sales data and reports", roles: ["admin", "manager", "cashier", "viewer"], createdAt: "2023-01-01" },
    { id: "3", name: "process_sales", category: "Sales", description: "Process new sales", roles: ["admin", "manager", "cashier"], createdAt: "2023-01-01" },
    { id: "4", name: "edit_sales", category: "Sales", description: "Edit existing sales", roles: ["admin", "manager"], createdAt: "2023-01-01" },
    { id: "5", name: "view_inventory", category: "Inventory", description: "View inventory data", roles: ["admin", "manager", "cashier", "inventory_manager", "viewer"], createdAt: "2023-01-01" },
    { id: "6", name: "manage_inventory", category: "Inventory", description: "Add/edit/delete inventory items", roles: ["admin", "manager", "inventory_manager"], createdAt: "2023-01-01" },
    { id: "7", name: "view_reports", category: "Reports", description: "View financial and sales reports", roles: ["admin", "manager", "inventory_manager", "viewer"], createdAt: "2023-01-01" },
    { id: "8", name: "manage_users", category: "System", description: "Manage users and roles", roles: ["admin"], createdAt: "2023-01-01" },
    { id: "9", name: "system_settings", category: "System", description: "Configure system settings", roles: ["admin"], createdAt: "2023-01-01" },
    { id: "10", name: "all", category: "System", description: "Full system access", roles: ["admin"], createdAt: "2023-01-01" },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: "1", userId: "1", userName: "Ahmad Khan", action: "CREATE", entity: "User", entityId: "6", timestamp: "2024-01-20 14:30:00", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0", details: "Created new user: Ali" },
    { id: "2", userId: "2", userName: "Sara Mohammadi", action: "UPDATE", entity: "Product", entityId: "P123", timestamp: "2024-01-20 13:15:00", ipAddress: "192.168.1.101", userAgent: "Firefox/121.0", details: "Updated product price" },
    { id: "3", userId: "3", userName: "Karim Azizi", action: "CREATE", entity: "Sale", entityId: "S456", timestamp: "2024-01-20 11:45:00", ipAddress: "192.168.1.102", userAgent: "Safari/17.2", details: "Processed new sale" },
    { id: "4", userId: "1", userName: "Ahmad Khan", action: "DELETE", entity: "User", entityId: "7", timestamp: "2024-01-19 16:20:00", ipAddress: "192.168.1.100", userAgent: "Chrome/120.0", details: "Deleted inactive user" },
    { id: "5", userId: "4", userName: "Zahra Habibi", action: "UPDATE", entity: "Inventory", entityId: "I789", timestamp: "2024-01-19 10:30:00", ipAddress: "192.168.1.103", userAgent: "Edge/120.0", details: "Updated stock quantity" },
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "Management", managerId: "1", userCount: 2, description: "Overall store management" },
    { id: "2", name: "Sales", managerId: "2", userCount: 4, description: "Sales and customer service" },
    { id: "3", name: "Inventory", managerId: "4", userCount: 3, description: "Inventory management and stocking" },
    { id: "4", name: "Finance", managerId: "1", userCount: 2, description: "Financial operations and reporting" },
  ]);

  // Dialog states
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [viewPermissionsOpen, setViewPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "cashier",
    department: "Sales",
    address: "",
    notes: "",
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedUsers = localStorage.getItem("users");
      const storedRoles = localStorage.getItem("roles");
      const storedPermissions = localStorage.getItem("permissions");
      
      if (storedUsers) setUsers(JSON.parse(storedUsers) as User[]);
      if (storedRoles) setRoles(JSON.parse(storedRoles) as Role[]);
      if (storedPermissions) setPermissions(JSON.parse(storedPermissions) as Permission[]);
    };
    
    loadData();
  }, []);

  // Save data to localStorage
  const saveData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Get role details
  const getRoleDetails = (roleName: string) => {
    return roles.find(role => role.name === roleName) || null;
  };

  // Get department details
  const getDepartmentDetails = (deptName: string) => {
    return departments.find(dept => dept.name === deptName) || null;
  };

  // Get manager name by ID
  const getManagerName = (managerId: string) => {
    const manager = users.find(user => user.id === managerId);
    return manager ? manager.name : "Unknown";
  };

  // Handle add user
  const handleAddUser = () => {
    const newUserObj: User = {
      id: `U${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: "active",
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
      department: newUser.department,
      permissions: getRoleDetails(newUser.role)?.permissions || [],
      address: newUser.address,
      notes: newUser.notes,
    };
    
    const updatedUsers = [...users, newUserObj];
    setUsers(updatedUsers as User[]);
    saveData("users", updatedUsers);
    
    // Add to audit log
    const newAuditLog: AuditLog = {
      id: `AL${Date.now()}`,
      userId: "1", // Assuming admin is adding
      userName: "Admin",
      action: "CREATE",
      entity: "User",
      entityId: newUserObj.id,
      timestamp: new Date().toISOString(),
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0",
      details: `Created new user: ${newUserObj.name} with role: ${newUserObj.role}`
    };
    
    setAuditLogs([newAuditLog, ...auditLogs]);
    
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "cashier",
      department: "Sales",
      address: "",
      notes: "",
    });
    setAddUserOpen(false);
  };

  // Handle edit user
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    );
    
    setUsers(updatedUsers as User[]);
    saveData("users", updatedUsers);
    
    // Add to audit log
    const newAuditLog: AuditLog = {
      id: `AL${Date.now()}`,
      userId: "1",
      userName: "Admin",
      action: "UPDATE",
      entity: "User",
      entityId: selectedUser.id,
      timestamp: new Date().toISOString(),
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0",
      details: `Updated user: ${selectedUser.name}`
    };
    
    setAuditLogs([newAuditLog, ...auditLogs]);
    setEditUserOpen(false);
    setSelectedUser(null);
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers as User[]);
      saveData("users", updatedUsers);
      
      // Add to audit log
      const newAuditLog: AuditLog = {
        id: `AL${Date.now()}`,
        userId: "1",
        userName: "Admin",
        action: "DELETE",
        entity: "User",
        entityId: userId,
        timestamp: new Date().toISOString(),
        ipAddress: "192.168.1.100",
        userAgent: "Chrome/120.0",
        details: `Deleted user: ${user.name}`
      };
      
      setAuditLogs([newAuditLog, ...auditLogs]);
    }
  };

  // Handle add role
  const handleAddRole = () => {
    const newRoleObj: Role = {
      id: `R${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      userCount: 0,
      permissions: newRole.permissions,
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: false,
      canDelete: true,
    };
    
    const updatedRoles = [...roles, newRoleObj];
    setRoles(updatedRoles);
    saveData("roles", updatedRoles);
    
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    });
    setAddRoleOpen(false);
  };

  // Handle edit role
  const handleEditRole = () => {
    if (!selectedRole) return;
    
    const updatedRoles = roles.map(role => 
      role.id === selectedRole.id ? selectedRole : role
    );
    
    setRoles(updatedRoles);
    saveData("roles", updatedRoles);
    setEditRoleOpen(false);
    setSelectedRole(null);
  };

  // Handle toggle user status
  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === "active" ? "inactive" : "active";
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers as User[]);
    saveData("users", updatedUsers);
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get status badge
  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get permission categories
  const permissionCategories = Array.from(
    new Set(permissions.map(p => p.category))
  );

  // Export data
  const handleExportData = (type: "users" | "roles" | "permissions") => {
    const data = type === "users" ? users :
                 type === "roles" ? roles : permissions;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format date
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
          <h1 className="text-3xl font-bold tracking-tight">Users & Permissions</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and system permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-[180px]">
              <Shield className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="roles">Roles</SelectItem>
              <SelectItem value="permissions">Permissions</SelectItem>
              <SelectItem value="audit">Audit Log</SelectItem>
              <SelectItem value="departments">Departments</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => handleExportData("users")}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Key className="mr-2 h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Activity className="mr-2 h-4 w-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="departments">
            <Users className="mr-2 h-4 w-4" />
            Departments
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search users by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setAddUserOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Users Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-xs text-muted-foreground">
                  {users.filter(u => u.status === "active").length} active
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === "active").length}
                </div>
                <div className="text-xs text-muted-foreground">Currently active</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roles.length}</div>
                <div className="text-xs text-muted-foreground">Different roles</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departments.length}</div>
                <div className="text-xs text-muted-foreground">Active departments</div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users List</CardTitle>
              <CardDescription>
                {filteredUsers.length} users found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {getUserInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{user.department}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(user.lastLogin)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setEditUserOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === "active" ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Roles Management</h2>
            <Button onClick={() => setAddRoleOpen(true)}>
              <Shield className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className={role.isDefault ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {role.name}
                        {role.isDefault && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRole(role);
                            setEditRoleOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setViewPermissionsOpen(true)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Permissions
                        </DropdownMenuItem>
                        {role.canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Role
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Users:</span>
                      <span className="font-medium">{role.userCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Permissions:</span>
                      <span className="font-medium">{role.permissions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{formatDate(role.createdAt)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Key Permissions:</div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">System Permissions</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportData("permissions")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Permission Categories */}
          {permissionCategories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  {category} Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {permissions
                    .filter(perm => perm.category === category)
                    .map((permission) => (
                      <div key={permission.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{permission.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {permission.description}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {permission.roles.length} roles
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Assigned to: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {permission.roles.map(role => (
                              <Badge key={role} variant="secondary" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>
                Track all user activities and system changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{log.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.action} {log.entity} #{log.entityId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatDate(log.timestamp)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.timestamp.split(' ')[1]}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">{log.details}</div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>IP: {log.ipAddress}</span>
                      <span>{log.userAgent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Departments</CardTitle>
                <CardDescription>Store organizational structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{dept.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {dept.description}
                          </div>
                        </div>
                        <Badge variant="outline">{dept.userCount} users</Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Manager: </span>
                        <span className="font-medium">
                          {getManagerName(dept.managerId)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Users per department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departments.map((dept) => {
                    const deptUsers = users.filter(u => u.department === dept.name);
                    const activeUsers = deptUsers.filter(u => u.status === "active");
                    
                    return (
                      <div key={dept.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{dept.name}</span>
                          <span className="text-sm">
                            {activeUsers.length}/{deptUsers.length} active
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(activeUsers.length / deptUsers.length) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Manager: {getManagerName(dept.managerId)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specific role and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                className="col-span-3"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select
                value={newUser.department}
                onValueChange={(value) => setNewUser({ ...newUser, department: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Textarea
                id="address"
                className="col-span-3"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                placeholder="Enter address (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                className="col-span-3"
                value={newUser.notes}
                onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
                placeholder="Additional notes (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  className="col-span-3"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => {
                    const roleDetails = getRoleDetails(value);
                    setSelectedUser({
                      ...selectedUser,
                      role: value,
                      permissions: roleDetails?.permissions || []
                    });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedUser.status}
                  onValueChange={(value: User["status"]) => 
                    setSelectedUser({ ...selectedUser, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={addRoleOpen} onOpenChange={setAddRoleOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-name" className="text-right">
                Role Name
              </Label>
              <Input
                id="role-name"
                className="col-span-3"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="e.g., Senior Manager"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-desc" className="text-right">
                Description
              </Label>
              <Textarea
                id="role-desc"
                className="col-span-3"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Describe the role responsibilities"
              />
            </div>
            <div className="col-span-4">
              <Label className="mb-2 block">Select Permissions</Label>
              <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto">
                {permissionCategories.map((category) => (
                  <div key={category} className="mb-4">
                    <div className="font-semibold mb-2">{category}</div>
                    <div className="space-y-2 pl-2">
                      {permissions
                        .filter(p => p.category === category)
                        .map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`perm-${permission.id}`}
                              checked={newRole.permissions.includes(permission.name)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewRole({
                                    ...newRole,
                                    permissions: [...newRole.permissions, permission.name]
                                  });
                                } else {
                                  setNewRole({
                                    ...newRole,
                                    permissions: newRole.permissions.filter(p => p !== permission.name)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={`perm-${permission.id}`} className="cursor-pointer">
                              <div className="font-medium">{permission.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {permission.description}
                              </div>
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Permissions Dialog */}
      <Dialog open={viewPermissionsOpen} onOpenChange={setViewPermissionsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Role Permissions</DialogTitle>
            <DialogDescription>
              View and manage permissions for this role
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <div className="font-semibold">{selectedRole.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedRole.permissions.length} permissions assigned
                  </div>
                </div>
                <Badge variant="outline">
                  {selectedRole.userCount} users
                </Badge>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className={`p-3 border rounded-lg ${
                        selectedRole.permissions.includes(permission.name)
                          ? 'bg-blue-50 border-blue-200'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {permission.description}
                          </div>
                        </div>
                        {selectedRole.permissions.includes(permission.name) ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewPermissionsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}