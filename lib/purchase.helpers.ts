// import { Product, PurchaseItem } from "./purchase.types";

// /* ================= Helpers ================= */

// /**
//  * محاسبه وضعیت موجودی محصول
//  * در صورت صفر بودن موجودی -> "out"
//  * اگر کمتر یا مساوی حداقل موجودی -> "low"
//  * در غیر این صورت -> "in_stock"
//  */
// export type StockStatus = "in_stock" | "low" | "out";

// export function getStockStatus(stock: number, minStock?: number): StockStatus {
//   if (stock === 0) return "out";
//   if (minStock !== undefined && stock <= minStock) return "low";
//   return "in_stock";
// }

// /**
//  * محاسبه مقدار کل موجودی (Inventory Value) برای یک آرایه محصول
//  */
// export function calculateInventoryValue(items: PurchaseItem[]): number {
//   return items.reduce((sum, item) => sum + item.cost * item.stock, 0);
// }

// /**
//  * محاسبه حاشیه سود برای یک محصول
//  */
// export function calculateProfitMargin(cost: number, price: number): number {
//   if (price === 0) return 0;
//   return ((price - cost) / price) * 100;
// }

// /**
//  * فیلتر محصولات بر اساس نوع خرید (New, Used, Return)
//  */
// export function filterByPurchaseType(items: PurchaseItem[], type: string): PurchaseItem[] {
//   return items.filter(item => item.purchaseType === type);
// }

// /**
//  * پیدا کردن محصولات انتخاب شده برای اعمال اکشن‌ها
//  */
// export function getSelectedItems(items: PurchaseItem[]): PurchaseItem[] {
//   return items.filter(item => item.selected);
// }

// /**
//  * بروزرسانی یک محصول در آرایه محصولات
//  */
// export function updateItem(
//   items: PurchaseItem[],
//   updatedItem: PurchaseItem
// ): PurchaseItem[] {
//   return items.map(item => (item.id === updatedItem.id ? updatedItem : item));
// }

// /**
//  * حذف محصولات انتخاب شده از آرایه
//  */
// export function deleteSelectedItems(items: PurchaseItem[]): PurchaseItem[] {
//   return items.filter(item => !item.selected);
// }