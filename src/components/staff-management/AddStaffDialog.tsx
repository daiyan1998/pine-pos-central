
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Waiter' | 'Chef';
  status: 'active' | 'inactive' | 'on-break';
  joinDate: string;
  lastActive: string;
  shift: string;
  hourlyRate: number;
}

interface AddStaffDialogProps {
  onAddStaff: (staff: Omit<StaffMember, 'id' | 'lastActive' | 'joinDate' | 'status'>) => void;
}

export const AddStaffDialog = ({ onAddStaff }: AddStaffDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "" as StaffMember['role'],
      shift: "",
      hourlyRate: 0,
    },
  });

  const onSubmit = (data: any) => {
    onAddStaff({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      shift: data.shift,
      hourlyRate: parseFloat(data.hourlyRate),
    });
    
    toast({
      title: "Staff Added",
      description: `${data.name} has been added to the team.`,
    });
    
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Add a new team member to your restaurant staff.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} required>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Chef">Chef</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                      <SelectItem value="Waiter">Waiter</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} required>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.25" 
                      min="0" 
                      placeholder="Enter hourly rate" 
                      {...field}
                      required 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Staff Member</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
