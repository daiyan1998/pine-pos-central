
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TableManagement } from "@/components/table-management/TableManagement";
import { MenuManagement } from "@/components/menu-management/MenuManagement";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState } from "react";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "tables":
        return <TableManagement />;
      case "menu":
        return <MenuManagement />;
      case "orders":
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Order Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case "billing":
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case "reports":
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Sales Reports</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case "inventory":
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      case "staff":
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Staff Management</h2><p className="text-gray-600 mt-2">Coming soon...</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
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
              </div>
            </header>
            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default Index;
