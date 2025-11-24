import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, BookOpen, Mail, LogOut, Download, Search, 
  TrendingUp, DollarSign, Edit, Trash2, Plus, BarChart3,
  FileText, Bell, Send, Settings, Eye
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { getAllRegistrations, getAllMessages, getDashboardStats } from '../services/api';
import Logo from '../components/Logo';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboardAdvanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [activeTab, setActiveTab] = useState('overview');

  // States for content management
  const [conferences, setConferences] = useState([]);
  const [books, setBooks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createType, setCreateType] = useState('');

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

  const fetchContentData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [confsRes, booksRes, teamRes, announcementsRes] = await Promise.all([
        axios.get(`${API}/admin/conferences`, config),
        axios.get(`${API}/books`),
        axios.get(`${API}/admin/team`),
        axios.get(`${API}/admin/announcements`)
      ]);
      
      setConferences(confsRes.data);
      setBooks(booksRes.data);
      setTeamMembers(teamRes.data);
      setAnnouncements(announcementsRes.data);
    } catch (error) {
      console.error('Error fetching content data:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    } else {
      fetchData();
      fetchContentData();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API}/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: 'Deleted Successfully',
        description: 'Item has been removed.',
      });
      
      fetchContentData();
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: error.response?.data?.detail || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size="sm" />
              <div>
                <h1 className="text-xl font-bold">Advanced Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Complete management system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  <Users className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalRegistrations}</div>
                  <p className="text-xs text-gray-600 mt-1">All-time registrations</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">₦{stats.totalRevenue?.toLocaleString() || 0}</div>
                  <p className="text-xs text-gray-600 mt-1">All sources</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <Mail className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{messages.length}</div>
                  <p className="text-xs text-gray-600 mt-1">Contact inquiries</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{stats.confirmedRegistrations}</div>
                  <p className="text-xs text-gray-600 mt-1">Confirmed registrations</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20" onClick={() => { setCreateType('conference'); setShowCreateDialog(true); }}>
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Add Conference</div>
                    </div>
                  </Button>
                  <Button className="h-20" onClick={() => { setCreateType('book'); setShowCreateDialog(true); }}>
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Add Book</div>
                    </div>
                  </Button>
                  <Button className="h-20" onClick={() => { setCreateType('announcement'); setShowCreateDialog(true); }}>
                    <div className="text-center">
                      <Plus className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">New Announcement</div>
                    </div>
                  </Button>
                  <Button className="h-20" onClick={() => exportToCSV(registrations, 'registrations.csv')}>
                    <div className="text-center">
                      <Download className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Export Data</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {registrations.slice(0, 5).map((reg, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{reg.fullName}</p>
                          <p className="text-xs text-gray-600">{reg.conference}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(reg.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Registrations</CardTitle>
                    <CardDescription>Manage conference registrations</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search..."
                      className="w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={() => exportToCSV(registrations, 'registrations.csv')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Conference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.filter(r => 
                      r.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      r.email?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.fullName}</TableCell>
                        <TableCell>{reg.email}</TableCell>
                        <TableCell>{reg.conference}</TableCell>
                        <TableCell>{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            reg.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reg.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Conferences */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Conferences</CardTitle>
                    <Button size="sm" onClick={() => { setCreateType('conference'); setShowCreateDialog(true); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {conferences.slice(0, 5).map((conf) => (
                      <div key={conf.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{conf.title}</p>
                          <p className="text-xs text-gray-600">{conf.date}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('conferences', conf.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Books */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Books</CardTitle>
                    <Button size="sm" onClick={() => { setCreateType('book'); setShowCreateDialog(true); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {books.slice(0, 5).map((book) => (
                      <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{book.title}</p>
                          <p className="text-xs text-gray-600">₦{book.price?.toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Announcements</CardTitle>
                  <Button onClick={() => { setCreateType('announcement'); setShowCreateDialog(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{ann.title}</p>
                        <p className="text-sm text-gray-600">{ann.content}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete('announcements', ann.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg">Conference Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">₦0</div>
                  <p className="text-sm text-gray-600 mt-2">From registrations</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Book Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">₦0</div>
                  <p className="text-sm text-gray-600 mt-2">From book purchases</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg">Training Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">₦0</div>
                  <p className="text-sm text-gray-600 mt-2">From trainings</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Generate and export financial reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24">
                    <div className="text-center">
                      <FileText className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Revenue Report</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-24">
                    <div className="text-center">
                      <BarChart3 className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Sales Analytics</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-24">
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Tax Report</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-24">
                    <div className="text-center">
                      <Download className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Export All</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Campaign</CardTitle>
                <CardDescription>Send bulk emails to your subscribers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <Input placeholder="Email subject..." />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea placeholder="Email content..." rows={6} />
                </div>
                <div>
                  <Label>Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="registrations">Conference Registrations</SelectItem>
                      <SelectItem value="books">Book Purchasers</SelectItem>
                      <SelectItem value="training">Training Enrollments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Campaign
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {messages.slice(0, 10).map((msg) => (
                    <div key={msg.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{msg.name}</p>
                        <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{msg.subject}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">User Management</h3>
                  <Button variant="outline">Manage Admin Users</Button>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Email Templates</h3>
                  <Button variant="outline">Edit Email Templates</Button>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Payment Settings</h3>
                  <Button variant="outline">Configure Payment Gateway</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardAdvanced;
