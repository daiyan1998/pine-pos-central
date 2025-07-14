// Types aligned with Prisma schema
export interface InventoryItem {
  id: string;
  menuItemId: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  menuItem?: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
}

export interface InventoryFormData {
  menuItemId: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}