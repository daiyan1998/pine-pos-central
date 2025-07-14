import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Activity, User, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      action: 'ORDER_CREATED',
      entity: 'Order',
      entityId: 'ORD-001',
      details: { orderNumber: 'ORD-001', totalAmount: 45.50 },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date('2024-01-01T12:00:00'),
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jane Smith',
      action: 'PAYMENT_RECEIVED',
      entity: 'Payment',
      entityId: 'PAY-001',
      details: { amount: 45.50, method: 'CARD' },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      createdAt: new Date('2024-01-01T12:30:00'),
    },
    {
      id: '3',
      userId: '1',
      userName: 'John Doe',
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: '1',
      details: { loginTime: '2024-01-01T11:00:00Z' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      createdAt: new Date('2024-01-01T11:00:00'),
    },
    {
      id: '4',
      userId: '3',
      userName: 'Mike Johnson',
      action: 'MENU_ITEM_UPDATED',
      entity: 'MenuItem',
      entityId: 'MENU-001',
      details: { itemName: 'Caesar Salad', priceChanged: true },
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: new Date('2024-01-01T10:00:00'),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const actions = Array.from(new Set(logs.map(log => log.action)));
  const entities = Array.from(new Set(logs.map(log => log.entity)));
  const users = Array.from(new Set(logs.map(log => log.userName)));

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !actionFilter || log.action === actionFilter;
    const matchesEntity = !entityFilter || log.entity === entityFilter;
    const matchesUser = !userFilter || log.userName === userFilter;
    
    return matchesSearch && matchesAction && matchesEntity && matchesUser;
  });

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      ORDER_CREATED: 'bg-green-100 text-green-800',
      ORDER_UPDATED: 'bg-blue-100 text-blue-800',
      ORDER_CANCELLED: 'bg-red-100 text-red-800',
      PAYMENT_RECEIVED: 'bg-emerald-100 text-emerald-800',
      USER_LOGIN: 'bg-purple-100 text-purple-800',
      USER_LOGOUT: 'bg-gray-100 text-gray-800',
      MENU_ITEM_CREATED: 'bg-cyan-100 text-cyan-800',
      MENU_ITEM_UPDATED: 'bg-orange-100 text-orange-800',
      MENU_ITEM_DELETED: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={colors[action] || 'bg-gray-100 text-gray-800'}>
        {action.replace(/_/g, ' ')}
      </Badge>
    );
  };

  const getEntityBadge = (entity: string) => {
    const colors: Record<string, string> = {
      Order: 'bg-blue-100 text-blue-800',
      Payment: 'bg-green-100 text-green-800',
      User: 'bg-purple-100 text-purple-800',
      MenuItem: 'bg-orange-100 text-orange-800',
      Table: 'bg-yellow-100 text-yellow-800',
      Bill: 'bg-indigo-100 text-indigo-800',
    };
    
    return (
      <Badge className={colors[entity] || 'bg-gray-100 text-gray-800'}>
        {entity}
      </Badge>
    );
  };

  const formatDetails = (details: any) => {
    if (!details) return 'No details';
    
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Activity Logs</span>
              </CardTitle>
              <CardDescription>Track all system activities and user actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                {actions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Entities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Entities</SelectItem>
                {entities.map((entity) => (
                  <SelectItem key={entity} value={entity}>
                    {entity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {log.createdAt.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{log.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>{getEntityBadge(log.entity)}</TableCell>
                  <TableCell className="font-mono text-sm">{log.entityId}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {formatDetails(log.details)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;