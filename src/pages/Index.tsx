
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { KitchenDisplay } from "@/components/kitchen-display/KitchenDisplay";
import { TableManagement } from "@/components/table-management/TableManagement";
import { MenuManagement } from "@/components/menu-management/MenuManagement";
import { OrderManagement } from "@/components/order-management/OrderManagement";
import { BillingPayments } from "@/components/billing-payments/BillingPayments";
import { SalesReports } from "@/components/sales-reports/SalesReports";
import { InventoryManagement } from "@/components/inventory-management/InventoryManagement";
import { StaffManagement } from "@/components/staff-management/StaffManagement";
import { AuthProvider } from "@/contexts/AuthContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserDashboard from "./UserDashboard";
import CategoryManagement from "@/components/admin/domains/CategoryManagement";
import { LogOut } from "lucide-react";
import { useLogout } from "@/api/mutations/auth";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const { user, logout } = useAuth();

  const {mutate: logoutMutation} = useLogout()

  if (user?.role !== "Admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="w-full px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">POSPine</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name} • {user?.role}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <main>
          <UserDashboard />
        </main>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveView} />;
      case "kitchen":
        return <KitchenDisplay />;
      case "tables":
        return <TableManagement />;
      case "menu":
        return <MenuManagement />;
      case "orders":
        return <OrderManagement />;
      case "billing":
        return <BillingPayments />;
      case "reports":
        return <SalesReports />;
      case "inventory":
        return <InventoryManagement />;
      case "staff":
        return <StaffManagement />;
      case "category":
        return <CategoryManagement />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <RestaurantProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar activeItem={activeView} onItemClick={setActiveView} />
          <main className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold text-gray-800">POSPine Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, Admin</span>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <button
                  onClick={() => logoutMutation()}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </header>
            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </RestaurantProvider>
  );
};

export default Index;
