import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRegistrations, getAllMessages, getDashboardStats } from '../services/api';
import Logo from '../components/Logo';
import { Users, Calendar, BookOpen, Mail, LogOut, Download, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalMessages: 0,
    pendingRegistrations: 0,
    confirmedRegistrations: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [regsData, msgsData, statsData] = await Promise.all([
        getAllRegistrations(),
        getAllMessages(),
        getDashboardStats()
      ]);
      
      setRegistrations(regsData);
      setMessages(msgsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    } else {
      fetchData();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const exportToCSV = (data, filename) => {
    // Simple CSV export
    console.log('Exporting to CSV:', filename, data);
    alert('Export functionality will be implemented with backend');
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.conference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(msg =>
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size="sm" />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your conferences and content</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalRegistrations}</div>
              <p className="text-xs text-gray-600 mt-1">All-time registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <Mail className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{messages.length}</div>
              <p className="text-xs text-gray-600 mt-1">Contact inquiries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conferences</CardTitle>
              <Calendar className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.confirmedRegistrations}</div>
              <p className="text-xs text-gray-600 mt-1">Confirmed registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Books Published</CardTitle>
              <BookOpen className="w-4 h-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">\u20a6{stats.totalRevenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Total revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Management Console</CardTitle>
                <CardDescription>View and manage registrations and messages</CardDescription>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="registrations" className="w-full" onValueChange={() => window.scrollTo(0, 0)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="registrations" onClick={() => window.scrollTo(0, 0)}>Registrations</TabsTrigger>
                <TabsTrigger value="messages" onClick={() => window.scrollTo(0, 0)}>Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="registrations" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(registrations, 'registrations.csv')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Conference</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No registrations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRegistrations.map((reg) => (
                          <TableRow key={reg.id}>
                            <TableCell className="font-medium">{reg.fullName}</TableCell>
                            <TableCell>{reg.email}</TableCell>
                            <TableCell>{reg.phone}</TableCell>
                            <TableCell>{reg.conference}</TableCell>
                            <TableCell>{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                reg.status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : reg.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {reg.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(messages, 'messages.csv')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No messages found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMessages.map((msg) => (
                          <TableRow key={msg.id}>
                            <TableCell className="font-medium">{msg.name}</TableCell>
                            <TableCell>{msg.email}</TableCell>
                            <TableCell className="max-w-xs truncate">{msg.subject}</TableCell>
                            <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                msg.status === 'read' 
                                  ? 'bg-gray-100 text-gray-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {msg.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
