
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState } from "react";

const Index = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
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
              <Dashboard />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
};

export default Index;
