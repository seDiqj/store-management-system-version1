"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
import { Button } from "@/app/components/ui/button";

/* ---------------- Types ---------------- */
type Sale = {
  id: number;
  customer: {
    id: string;
    name: string;
  };
  total: number;
  profit: number;
  date: string;
};

/* ---------------- Page ---------------- */
export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("sales");
    if (stored) setSales(JSON.parse(stored));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Sales History
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>All Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No sales yet
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {new Date(sale.date).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {sale.customer.name}
                    </TableCell>
                    <TableCell>
                      ${sale.total}
                    </TableCell>
                    <TableCell className="text-green-600">
                      ${sale.profit}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/sales/history/${sale.id}`}
                      >
                        <Button size="sm">
                          View
                        </Button>
                      </Link>
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
