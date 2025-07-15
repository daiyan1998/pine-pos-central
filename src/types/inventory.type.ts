import { MenuItem } from "./menu.type";

export interface InventoryItem {
  id: string;
  menuItemId: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  menuItem?: MenuItem;
}
