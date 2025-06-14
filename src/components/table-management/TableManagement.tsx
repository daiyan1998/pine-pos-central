
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock, CheckCircle } from "lucide-react";

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: string;
  reservationTime?: string;
}

export const TableManagement = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, seats: 2, status: 'available' },
    { id: '2', number: 2, seats: 4, status: 'occupied', currentOrder: '#001' },
    { id: '3', number: 3, seats: 2, status: 'available' },
    { id: '4', number: 4, seats: 6, status: 'reserved', reservationTime: '7:30 PM' },
    { id: '5', number: 5, seats: 4, status: 'occupied', currentOrder: '#002' },
    { id: '6', number: 6, seats: 2, status: 'available' },
    { id: '7', number: 7, seats: 4, status: 'available' },
    { id: '8', number: 8, seats: 4, status: 'occupied', currentOrder: '#003' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'occupied': return <Users className="w-4 h-4" />;
      case 'reserved': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const handleTableClick = (table: Table) => {
    console.log('Table clicked:', table);
    // Handle table selection logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-600">Manage your restaurant tables and their current status.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-xl font-bold text-gray-900">
                  {tables.filter(t => t.status === 'available').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-xl font-bold text-gray-900">
                  {tables.filter(t => t.status === 'occupied').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-xl font-bold text-gray-900">
                  {tables.filter(t => t.status === 'reserved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card 
            key={table.id} 
            className={`border-2 cursor-pointer transition-all hover:shadow-md ${
              table.status === 'available' ? 'border-green-200 hover:border-green-400' :
              table.status === 'occupied' ? 'border-red-200 hover:border-red-400' :
              'border-yellow-200 hover:border-yellow-400'
            }`}
            onClick={() => handleTableClick(table)}
          >
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gray-100 rounded-full">
                  <span className="text-lg font-bold text-gray-700">T{table.number}</span>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Table {table.number}</h3>
                  <p className="text-sm text-gray-600">{table.seats} seats</p>
                </div>
                
                <Badge className={`${getStatusColor(table.status)} flex items-center gap-1 justify-center`}>
                  {getStatusIcon(table.status)}
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </Badge>
                
                {table.currentOrder && (
                  <div className="text-xs text-gray-600">
                    Order: {table.currentOrder}
                  </div>
                )}
                
                {table.reservationTime && (
                  <div className="text-xs text-gray-600">
                    Reserved: {table.reservationTime}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
