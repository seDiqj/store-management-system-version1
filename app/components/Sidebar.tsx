'use client';

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
  ChevronLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Inventory", icon: Package, href: "/inventory" },
  { title: "Purchases", icon: Truck, href: "/purchases" },
  { title: "Sales", icon: ShoppingCart, href: "/sales" },
  { title: "Finance", icon: Wallet, href: "/finance" },
  { title: "Reports", icon: BarChart3, href: "/reports" },
  { title: "Users", icon: Users, href: "/users" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "group fixed inset-y-0 left-0 z-40 flex flex-col",
        "border-r bg-background/70 backdrop-blur-xl",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide">
            Business OS
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full hover:bg-muted"
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
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            const content = (
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
                  "transition-all duration-200",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {/* Active Glow */}
                {active && (
                  <span className="absolute inset-0 rounded-xl bg-primary/10 blur-md" />
                )}

                <Icon className="relative z-10 h-5 w-5" />

                {!collapsed && (
                  <span className="relative z-10 text-sm font-medium">
                    {item.title}
                  </span>
                )}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  {content}
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.href}>{content}</div>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* Footer */}
      <div className="px-4 py-3 text-xs text-muted-foreground">
        {!collapsed && "v1.0 • SaaS Platform"}
      </div>
    </aside>
  );
}
