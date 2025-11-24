import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, BookOpen, Mail, LogOut, Download, Search, 
  TrendingUp, DollarSign, Edit, Trash2, Plus, BarChart3,
  FileText, Bell, Send, Settings, Eye, Check, X, Video, Briefcase
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
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
import BookFormDialog from '../components/admin/BookFormDialog';
import TeamMemberFormDialog from '../components/admin/TeamMemberFormDialog';
import AnnouncementFormDialog from '../components/admin/AnnouncementFormDialog';
import ProjectFormDialog from '../components/admin/ProjectFormDialog';
import TrainingFormDialog from '../components/admin/TrainingFormDialog';
import MoreLifeFormDialog from '../components/admin/MoreLifeFormDialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboardNew = () => {
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
  const [trainings, setTrainings] = useState([]);
  const [morelifeSessions, setMorelifeSessions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Dialog states
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [selectedMoreLifeSession, setSelectedMoreLifeSession] = useState(null);
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);
  const [showMoreLifeDialog, setShowMoreLifeDialog] = useState(false);
  const [bookPurchases, setBookPurchases] = useState([]);

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
      toast({
        title: 'Error Loading Data',
        description: 'Failed to load dashboard data. Please refresh.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContentData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [confsRes, booksRes, teamRes, announcementsRes, projectsRes, purchasesRes, trainingsRes, morelifeRes] = await Promise.all([
        axios.get(`${API}/admin/conferences`, config).catch((e) => { console.error('Conferences error:', e); return { data: [] }; }),
        axios.get(`${API}/admin/books`).catch((e) => { console.error('Books error:', e); return { data: [] }; }),
        axios.get(`${API}/admin/team`).catch((e) => { console.error('Team error:', e); return { data: [] }; }),
        axios.get(`${API}/admin/announcements`).catch((e) => { console.error('Announcements error:', e); return { data: [] }; }),
        axios.get(`${API}/admin/projects`).catch((e) => { console.error('Projects error:', e); return { data: [] }; }),
        axios.get(`${API}/books/purchases`, config).catch((e) => { console.error('Purchases error:', e.response?.data); return { data: [] }; }),
        axios.get(`${API}/admin/trainings`).catch((e) => { console.error('Trainings error:', e); return { data: [] }; }),
        axios.get(`${API}/admin/morelife/assessments`, config).catch((e) => { console.error('MoreLife error:', e); return { data: [] }; })
      ]);
      
      setConferences(confsRes.data);
      setBooks(booksRes.data);
      setTeamMembers(teamRes.data);
      setAnnouncements(announcementsRes.data);
      setProjects(projectsRes.data);
      setBookPurchases(purchasesRes.data);
      setTrainings(trainingsRes.data);
      setMorelifeSessions(morelifeRes.data);
      
      console.log('Loaded data:', {
        conferences: confsRes.data.length,
        books: booksRes.data.length,
        team: teamRes.data.length,
        announcements: announcementsRes.data.length,
        projects: projectsRes.data.length,
        purchases: purchasesRes.data.length,
        trainings: trainingsRes.data.length,
        morelife: morelifeRes.data.length
      });
      
      console.log('Sample purchase:', purchasesRes.data[0]);
      console.log('Completed purchases:', purchasesRes.data.filter(p => p.paymentStatus === 'completed').length);
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
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
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

  const handleMessageStatus = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API}/contact/${messageId}/status?status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: 'Status Updated',
        description: `Message marked as ${newStatus}.`,
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.detail || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRegistrationStatus = async (registrationId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${API}/registrations/${registrationId}/status?status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: 'Status Updated',
        description: `Registration marked as ${newStatus}.`,
      });
      
      fetchData();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.detail || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast({
        title: 'No Data',
        description: 'No data available to export.',
        variant: 'destructive',
      });
      return;
    }
    
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    toast({
      title: 'Export Successful',
      description: `${filename} has been downloaded.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
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
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
          <TabsList className="grid w-full grid-cols-10 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">All Payments</TabsTrigger>
            <TabsTrigger value="conferences">Conferences</TabsTrigger>
            <TabsTrigger value="ebooks">E-Books</TabsTrigger>
            <TabsTrigger value="trainings">Trainings</TabsTrigger>
            <TabsTrigger value="morelife">MoreLife</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
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
                  <Button 
                    className="h-20" 
                    onClick={() => handleTabChange('conferences')}
                  >
                    <div className="text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Manage Conferences</div>
                    </div>
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={() => handleTabChange('ebooks')}
                  >
                    <div className="text-center">
                      <BookOpen className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Manage Books</div>
                    </div>
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={() => handleTabChange('messages')}
                  >
                    <div className="text-center">
                      <Mail className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">View Messages</div>
                    </div>
                  </Button>
                  <Button 
                    className="h-20" 
                    onClick={() => exportToCSV(registrations, 'registrations.csv')}
                  >
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
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                {registrations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No registrations yet</p>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Payments Tab - Comprehensive View */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Payments & Transactions</CardTitle>
                    <CardDescription>Complete payment tracking across all services</CardDescription>
                  </div>
                  <Button onClick={() => {
                    const allPayments = [
                      ...registrations.map(r => ({ ...r, type: 'Conference', date: r.createdAt })),
                      ...bookPurchases.map(p => ({ ...p, type: 'Book Purchase', date: p.createdAt }))
                    ];
                    exportToCSV(allPayments, 'all_payments.csv');
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Revenue Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-2 border-green-200">
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-600">Conference Revenue</div>
                        <div className="text-2xl font-bold text-green-600">
                          ₦{registrations.filter(r => r.paymentStatus === 'completed').reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-600">Book Sales Revenue</div>
                        <div className="text-2xl font-bold text-blue-600">
                          ₦{bookPurchases.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-purple-200">
                      <CardContent className="p-4">
                        <div className="text-sm text-gray-600">Total Revenue</div>
                        <div className="text-2xl font-bold text-purple-600">
                          ₦{(
                            registrations.filter(r => r.paymentStatus === 'completed').reduce((sum, r) => sum + (r.amount || 0), 0) +
                            bookPurchases.filter(p => p.paymentStatus === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0)
                          ).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Conference Payments */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Conference Registrations ({registrations.length})</h3>
                    {registrations.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No conference payments yet</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Conference</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registrations.slice(0, 10).map((reg) => (
                            <TableRow key={reg.registrationId}>
                              <TableCell className="font-medium">{reg.fullName}</TableCell>
                              <TableCell>{reg.conference}</TableCell>
                              <TableCell>₦{(reg.amount || 0).toLocaleString()}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  reg.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {reg.paymentStatus || 'pending'}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  {/* Book Purchases */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Book Purchases ({bookPurchases.length})</h3>
                    {bookPurchases.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No book purchases yet</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Book</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookPurchases.slice(0, 10).map((purchase) => (
                            <TableRow key={purchase.purchaseId}>
                              <TableCell className="font-medium">{purchase.fullName}</TableCell>
                              <TableCell>{purchase.bookId}</TableCell>
                              <TableCell>₦{(purchase.amount || 0).toLocaleString()}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  purchase.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {purchase.paymentStatus || 'pending'}
                                </span>
                              </TableCell>
                              <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conferences Tab */}
          <TabsContent value="conferences" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Conference Registrations</CardTitle>
                    <CardDescription>Manage all conference registrations</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search..."
                      className="w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={() => exportToCSV(registrations, 'conference_registrations.csv')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {registrations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No conference registrations yet</p>
                ) : (
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
                        r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.conference?.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((reg) => (
                        <TableRow key={reg.registrationId}>
                          <TableCell className="font-medium">{reg.fullName}</TableCell>
                          <TableCell>{reg.email}</TableCell>
                          <TableCell>{reg.conference}</TableCell>
                          <TableCell>{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              reg.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reg.status || 'pending'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Select
                                value={reg.status || 'pending'}
                                onValueChange={(value) => handleRegistrationStatus(reg.registrationId, value)}
                              >
                                <SelectTrigger className="w-32 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" variant="outline" title="View Details">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* E-Books Tab */}
          <TabsContent value="ebooks" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>E-Books Management</CardTitle>
                    <CardDescription>{books.length} book{books.length !== 1 ? 's' : ''} available</CardDescription>
                  </div>
                  <Button onClick={() => { setSelectedBook(null); setShowBookDialog(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {books.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">No books available yet</p>
                    <p className="text-sm text-gray-400 mb-4">Start building your digital library</p>
                    <Button className="mt-4" onClick={() => { setSelectedBook(null); setShowBookDialog(true); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Book
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                      <Card key={book.id} className="border-2 hover:border-blue-400 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{book.author || 'Nigerland Consult'}</p>
                              {book.description && (
                                <p className="text-xs text-gray-500 mb-3">{book.description.substring(0, 80)}...</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-2xl font-bold text-blue-600">₦{book.price?.toLocaleString()}</p>
                              {book.isActive && (
                                <span className="text-xs text-green-600">● Active</span>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" title="Edit" onClick={() => { setSelectedBook(book); setShowBookDialog(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" title="Delete" onClick={() => handleDelete('books', book.id)}>
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Book Purchases */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Book Purchases</CardTitle>
                    <CardDescription>{bookPurchases.length} purchase{bookPurchases.length !== 1 ? 's' : ''}</CardDescription>
                  </div>
                  <Button onClick={() => exportToCSV(bookPurchases, 'book_purchases.csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {bookPurchases.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No purchases yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Book</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookPurchases.map((purchase) => (
                        <TableRow key={purchase.purchaseId}>
                          <TableCell className="font-medium">{purchase.fullName}</TableCell>
                          <TableCell>{purchase.email}</TableCell>
                          <TableCell>{purchase.bookId}</TableCell>
                          <TableCell>₦{purchase.amount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              purchase.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                              purchase.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {purchase.paymentStatus || 'pending'}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trainings Tab */}
          <TabsContent value="trainings" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Training Programs</CardTitle>
                    <CardDescription>Manage all training courses and enrollments</CardDescription>
                  </div>
                  <Button onClick={() => { setSelectedTraining(null); setShowTrainingDialog(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Training
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {trainings.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">No training programs yet</p>
                    <p className="text-sm text-gray-400 mb-6">Create your first training program to get started</p>
                    <Button onClick={() => { setSelectedTraining(null); setShowTrainingDialog(true); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Training Program
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Program Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Enrollments</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trainings.map((training) => (
                          <TableRow key={training.id}>
                            <TableCell className="font-medium">{training.title}</TableCell>
                            <TableCell>{training.category}</TableCell>
                            <TableCell>{training.duration}</TableCell>
                            <TableCell>{training.enrollments || 0}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                training.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {training.isActive ? 'Active' : 'Inactive'}
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* MoreLife Sessions Tab */}
          <TabsContent value="morelife" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>MoreLife Sessions</CardTitle>
                    <CardDescription>Manage coaching sessions and assessments</CardDescription>
                  </div>
                  <Button onClick={() => { setSelectedMoreLifeSession(null); setShowMoreLifeDialog(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {morelifeSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">No MoreLife sessions yet</p>
                    <p className="text-sm text-gray-400 mb-6">Start scheduling coaching sessions for your clients</p>
                    <Button onClick={() => { setSelectedMoreLifeSession(null); setShowMoreLifeDialog(true); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule First Session
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Session Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {morelifeSessions.map((session) => (
                          <TableRow key={session.id}>
                            <TableCell className="font-medium">{session.name}</TableCell>
                            <TableCell>{session.email}</TableCell>
                            <TableCell>{session.sessionType}</TableCell>
                            <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {session.status}
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contact Messages</CardTitle>
                  <Button onClick={() => exportToCSV(messages, 'messages.csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <Card key={msg.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold">{msg.name}</h3>
                                <span className="text-xs text-gray-500">
                                  {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{msg.email}</p>
                              <p className="text-sm font-medium text-blue-600 mb-2">{msg.subject}</p>
                              <p className="text-sm text-gray-700">{msg.message}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMessageStatus(msg.id, 'read')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Mark Read
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleMessageStatus(msg.id, 'archived')}
                            >
                              Archive
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Upload Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Members */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Team Members ({teamMembers.length})</CardTitle>
                    <Button size="sm" onClick={() => { setSelectedTeamMember(null); setShowTeamDialog(true); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {teamMembers.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No team members</p>
                  ) : (
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-gray-600">{member.role}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedTeamMember(member); setShowTeamDialog(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete('team', member.id)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Projects ({projects.length})</CardTitle>
                    <Button size="sm" onClick={() => { setSelectedProject(null); setShowProjectDialog(true); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No projects</p>
                  ) : (
                    <div className="space-y-2">
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{project.title}</p>
                            <p className="text-xs text-gray-600">{project.category}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedProject(project); setShowProjectDialog(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete('projects', project.id)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Announcements - Full Width */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Announcements ({announcements.length})</CardTitle>
                  <Button size="sm" onClick={() => { setSelectedAnnouncement(null); setShowAnnouncementDialog(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No announcements</p>
                ) : (
                  <div className="space-y-2">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{ann.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => { setSelectedAnnouncement(ann); setShowAnnouncementDialog(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete('announcements', ann.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <Button variant="outline" className="h-24" onClick={() => exportToCSV(registrations, 'all_data.csv')}>
                    <div className="text-center">
                      <Download className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Export All</div>
                    </div>
                  </Button>
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

      {/* Dialogs */}
      <BookFormDialog 
        open={showBookDialog} 
        onOpenChange={setShowBookDialog}
        book={selectedBook}
        onSuccess={fetchContentData}
      />
      <TeamMemberFormDialog 
        open={showTeamDialog} 
        onOpenChange={setShowTeamDialog}
        member={selectedTeamMember}
        onSuccess={fetchContentData}
      />
      <AnnouncementFormDialog 
        open={showAnnouncementDialog} 
        onOpenChange={setShowAnnouncementDialog}
        announcement={selectedAnnouncement}
        onSuccess={fetchContentData}
      />
      <ProjectFormDialog 
        open={showProjectDialog} 
        onOpenChange={setShowProjectDialog}
        project={selectedProject}
        onSuccess={fetchContentData}
      />
      <TrainingFormDialog 
        open={showTrainingDialog} 
        onOpenChange={setShowTrainingDialog}
        training={selectedTraining}
        onSuccess={fetchContentData}
      />
      <MoreLifeFormDialog 
        open={showMoreLifeDialog} 
        onOpenChange={setShowMoreLifeDialog}
        session={selectedMoreLifeSession}
        onSuccess={fetchContentData}
      />
    </div>
  );
};

export default AdminDashboardNew;
