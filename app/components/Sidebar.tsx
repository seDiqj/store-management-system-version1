"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Wallet,
  BarChart3,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  // ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ---------------- Menu Config ---------------- */
const menu = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Sales", icon: ShoppingCart, href: "/sales" },
  { title: "Customers", icon: Users, href: "/customers" },
  { title: "Inventory", icon: Package, href: "/inventory" },
  { title: "Purchase", icon: Truck, href: "/purchases" },
  { title: "Finance", icon: Wallet, href: "/finance" },
  { title: "Reports", icon: BarChart3, href: "/reports" },
  { title: "Users", icon: Users, href: "/users" },
  { title: "Notifications", icon: Bell, href: "/notifications" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

/* ---------------- Sidebar ---------------- */
export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // const [openMenus, setOpenMenus] = useState<string[]>([]);
  // const toggleMenu = (title: string) => {
  //   setOpenMenus((prev) =>
  //     prev.includes(title)
  //       ? prev.filter((t) => t !== title)
  //       : [...prev, title]
  //   );
  // };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col",
        "border-r bg-background/70 backdrop-blur-xl",
        "transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <span className="text-sm font-semibold">Business OS</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Menu */}
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 px-2 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            const content = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  {content}
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.title}>{content}</div>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* Footer */}
      <div className="px-4 py-3 text-xs text-muted-foreground">
        {!collapsed && "v1.0 • ERP Platform"}
      </div>
    </aside>
  );
}
