import { MenuItem } from "./menu.type";

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  menuItems?: MenuItem[];
}
