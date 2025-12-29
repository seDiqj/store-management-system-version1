'use client';

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" />
          </div>

          <Button className="w-full">Login</Button>

          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="text-primary underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
