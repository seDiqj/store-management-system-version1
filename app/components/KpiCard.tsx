"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

export default function KpiCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-bold">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            variant === "success" && "bg-green-100 text-green-700",
            variant === "warning" && "bg-yellow-100 text-yellow-700",
            variant === "danger" && "bg-red-100 text-red-700",
            variant === "default" && "bg-muted text-foreground"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
