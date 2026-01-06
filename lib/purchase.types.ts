// /* ================= Purchase Types ================= */

// export type PurchaseType = "new" | "used" | "return";

// export interface Product {
//   id: string;
//   name: string;
//   sku: string;
//   category: string;
//   brand?: string;
//   uom?: "piece" | "box" | "kg";
//   cost: number;
//   price: number;
//   stock: number;
//   minStock?: number;
//   isActive?: boolean;
//   createdAt: string;
//   purchaseType?: PurchaseType; // نوع خرید: جدید، مستعمل یا بازگشت
// }

// export interface PurchaseItem extends Product {
//   selected?: boolean; // برای انتخاب ردیف جهت اعمال اکشن‌ها
// }