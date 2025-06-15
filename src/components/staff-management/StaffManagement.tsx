import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, User, Clock, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddStaffDialog } from "./AddStaffDialog";
import { EditStaffDialog } from "./EditStaffDialog";

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

interface ActivityLog {
  id: string;
  staffId: string;
  staffName: string;
  action: string;
  timestamp: string;
  details: string;
}

export const StaffManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [activeTab, setActiveTab] = useState("staff");
  
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 'STF001',
      name: 'John Smith',
      email: 'john.smith@restaurant.com',
      phone: '+1 234 567 8901',
      role: 'Manager',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2025-06-14 12:30',
      shift: 'Morning',
      hourlyRate: 18.50
    },
    {
      id: 'STF002',
      name: 'Sarah Johnson',
      email: 'sarah.j@restaurant.com',
      phone: '+1 234 567 8902',
      role: 'Waiter',
      status: 'active',
      joinDate: '2024-03-20',
      lastActive: '2025-06-14 12:25',
      shift: 'Evening',
      hourlyRate: 14.00
    },
    {
      id: 'STF003',
      name: 'Mike Chen',
      email: 'mike.chen@restaurant.com',
      phone: '+1 234 567 8903',
      role: 'Chef',
      status: 'on-break',
      joinDate: '2023-11-10',
      lastActive: '2025-06-14 11:45',
      shift: 'Morning',
      hourlyRate: 22.00
    },
    {
      id: 'STF004',
      name: 'Emily Davis',
      email: 'emily.d@restaurant.com',
      phone: '+1 234 567 8904',
      role: 'Cashier',
      status: 'active',
      joinDate: '2024-05-08',
      lastActive: '2025-06-14 12:20',
      shift: 'Evening',
      hourlyRate: 15.50
    },
    {
      id: 'STF005',
      name: 'David Wilson',
      email: 'david.w@restaurant.com',
      phone: '+1 234 567 8905',
      role: 'Waiter',
      status: 'inactive',
      joinDate: '2024-02-14',
      lastActive: '2025-06-13 18:30',
      shift: 'Morning',
      hourlyRate: 14.00
    }
  ]);

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: 'LOG001',
      staffId: 'STF001',
      staffName: 'John Smith',
      action: 'Order Created',
      timestamp: '2025-06-14 12:30',
      details: 'Created order ORD001 for Table 5'
    },
    {
      id: 'LOG002',
      staffId: 'STF002',
      staffName: 'Sarah Johnson',
      action: 'Table Assignment',
      timestamp: '2025-06-14 12:25',
      details: 'Assigned to Table 8'
    },
    {
      id: 'LOG003',
      staffId: 'STF003',
      staffName: 'Mike Chen',
      action: 'Order Prepared',
      timestamp: '2025-06-14 12:20',
      details: 'Completed preparation for Order ORD002'
    },
    {
      id: 'LOG004',
      staffId: 'STF004',
      staffName: 'Emily Davis',
      action: 'Payment Processed',
      timestamp: '2025-06-14 12:15',
      details: 'Processed payment for Bill BILL001 - $36.76'
    }
  ]);

  const roles = ['Admin', 'Manager', 'Cashier', 'Waiter', 'Chef'];

  const addStaff = (newStaff: Omit<StaffMember, 'id' | 'lastActive' | 'joinDate' | 'status'>) => {
    const staffMember: StaffMember = {
      ...newStaff,
      id: `STF${String(staff.length + 1).padStart(3, '0')}`,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toLocaleString()
    };
    
    setStaff(prev => [...prev, staffMember]);
  };

  const editStaff = (staffId: string, updatedStaff: Omit<StaffMember, 'id' | 'lastActive' | 'joinDate' | 'status'>) => {
    setStaff(prev => prev.map(member => 
      member.id === staffId 
        ? { 
            ...member, 
            ...updatedStaff, 
            lastActive: new Date().toLocaleString() 
          }
        : member
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'on-break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Chef': return 'bg-orange-100 text-orange-800';
      case 'Cashier': return 'bg-green-100 text-green-800';
      case 'Waiter': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStaffStatus = (staffId: string, newStatus: StaffMember['status']) => {
    setStaff(prev => prev.map(member => 
      member.id === staffId 
        ? { ...member, status: newStatus, lastActive: new Date().toLocaleString() }
        : member
    ));
    
    toast({
      title: "Staff Status Updated",
      description: `Staff member status changed to ${newStatus}`,
    });
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const activeStaffCount = staff.filter(s => s.status === 'active').length;
  const totalHourlyRate = staff.reduce((sum, s) => sum + s.hourlyRate, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage your restaurant team and track their activities.</p>
        </div>
        <AddStaffDialog onAddStaff={addStaff} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-xl font-bold text-gray-900">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-xl font-bold text-gray-900">{activeStaffCount}</p>
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
                <p className="text-sm text-gray-600">On Break</p>
                <p className="text-xl font-bold text-gray-900">
                  {staff.filter(s => s.status === 'on-break').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hourly</p>
                <p className="text-xl font-bold text-gray-900">${totalHourlyRate.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "staff" ? "default" : "ghost"}
          onClick={() => setActiveTab("staff")}
          className="px-4 py-2"
        >
          Staff Members
        </Button>
        <Button
          variant={activeTab === "activity" ? "default" : "ghost"}
          onClick={() => setActiveTab("activity")}
          className="px-4 py-2"
        >
          Activity Log
        </Button>
      </div>

      {activeTab === "staff" && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Role:</span>
                      <Badge className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shift:</span>
                      <span className="font-medium">{member.shift}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-medium">${member.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Active:</span>
                      <span className="text-xs">{member.lastActive}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {member.status === 'active' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStaffStatus(member.id, 'on-break')}
                      >
                        Set Break
                      </Button>
                    )}
                    {member.status === 'on-break' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStaffStatus(member.id, 'active')}
                      >
                        End Break
                      </Button>
                    )}
                    {member.status === 'inactive' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateStaffStatus(member.id, 'active')}
                      >
                        Activate
                      </Button>
                    )}
                    <EditStaffDialog staff={member} onEditStaff={editStaff} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === "activity" && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {log.staffName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{log.staffName}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{log.details}</p>
                    <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredStaff.length === 0 && activeTab === "staff" && (
        <div className="text-center py-12">
          <p className="text-gray-500">No staff members found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
