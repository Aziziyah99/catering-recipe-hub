export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  lowStockThreshold: number;
  notes: string;
}

export const INVENTORY_CATEGORIES = [
  "General", "Dairy", "Produce", "Spices", "Grains", "Meat", "Oils & Fats", "Beverages", "Baking", "Canned Goods", "Frozen",
] as const;
