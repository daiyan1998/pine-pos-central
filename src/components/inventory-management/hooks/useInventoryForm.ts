import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InventoryFormData } from "../types";

const inventoryFormSchema = z.object({
  menuItemId: z.string().min(1, "Menu item is required"),
  currentStock: z.number().min(0, "Current stock must be 0 or greater"),
  minStock: z.number().min(0, "Minimum stock must be 0 or greater"),
  maxStock: z.number().min(0, "Maximum stock must be 0 or greater").optional(),
  unit: z.string().min(1, "Unit is required"),
});

export const useInventoryForm = (defaultValues?: Partial<InventoryFormData>) => {
  return useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      menuItemId: "",
      currentStock: 0,
      minStock: 0,
      maxStock: undefined,
      unit: "pcs",
      ...defaultValues,
    },
  });
};