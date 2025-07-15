import { Category } from "./category.type";
import { InventoryItem } from "./inventory.type";
import { OrderItem } from "./order.type";

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  categoryId: string;
  isAvailable: boolean;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  category?: Category;
  variants?: MenuVariant[];
  orderItems?: OrderItem[];
  inventoryItems?: InventoryItem[];
}

export interface MenuVariant {
  id: string;
  menuItemId: string;
  name: string;
  priceAdd: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  menuItem?: MenuItem;
  orderItems?: OrderItem[];
}
