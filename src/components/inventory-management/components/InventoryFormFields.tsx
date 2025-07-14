import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryFormData, MenuItem } from "../types";

interface InventoryFormFieldsProps {
  control: Control<InventoryFormData>;
  menuItems: MenuItem[];
}

export const InventoryFormFields = ({ control, menuItems }: InventoryFormFieldsProps) => {
  const units = [
    { value: "pcs", label: "Pieces" },
    { value: "kg", label: "Kilogram" },
    { value: "liters", label: "Liters" },
    { value: "grams", label: "Grams" },
    { value: "ml", label: "Milliliters" },
  ];

  return (
    <>
      <FormField
        control={control}
        name="menuItemId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Menu Item *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select menu item" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {menuItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.category.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="currentStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Stock *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="minStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Stock *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="maxStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};