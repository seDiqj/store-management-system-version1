'use client';

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

export default function  Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Let’s set up your business</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input placeholder="john_doe" />
          </div>

          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input placeholder="My Store" />
          </div>

          <div className="space-y-2">
            <Label>Business Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">Finish & Go to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
}
