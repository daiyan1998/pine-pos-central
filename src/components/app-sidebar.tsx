
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Calendar, 
  Home, 
  Users, 
  Settings, 
  FileText, 
  ShoppingCart, 
  UtensilsCrossed,
  CreditCard,
  BarChart3,
  Package,
  UserCheck
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: Home,
    id: "dashboard"
  },
  {
    title: "Table Management",
    url: "#tables",
    icon: Calendar,
    id: "tables"
  },
  {
    title: "Menu Management",
    url: "#menu",
    icon: UtensilsCrossed,
    id: "menu"
  },
  {
    title: "Order Management",
    url: "#orders",
    icon: ShoppingCart,
    id: "orders"
  },
  {
    title: "Billing & Payments",
    url: "#billing",
    icon: CreditCard,
    id: "billing"
  },
  {
    title: "Sales Reports",
    url: "#reports",
    icon: BarChart3,
    id: "reports"
  },
  {
    title: "Inventory",
    url: "#inventory",
    icon: Package,
    id: "inventory"
  },
  {
    title: "Staff Management",
    url: "#staff",
    icon: UserCheck,
    id: "staff"
  },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">POSPine</h2>
            <p className="text-xs text-gray-500">Restaurant POS</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-500 font-medium px-3 py-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`mx-2 rounded-lg transition-all duration-200 ${
                      activeItem === item.id 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <button
                      onClick={() => setActiveItem(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
