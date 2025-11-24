import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MoreLifeFormDialog = ({ open, onOpenChange, session, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    sessionType: 'private_1week',
    scheduledDate: '',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    if (session) {
      setFormData({
        clientName: session.clientName || session.name || '',
        email: session.email || '',
        phone: session.phone || '',
        sessionType: session.sessionType || 'private_1week',
        scheduledDate: session.scheduledDate || session.date || '',
        notes: session.notes || '',
        status: session.status || 'scheduled'
      });
    } else {
      setFormData({
        clientName: '',
        email: '',
        phone: '',
        sessionType: 'private_1week',
        scheduledDate: '',
        notes: '',
        status: 'scheduled'
      });
    }
  }, [session, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (session) {
        await axios.put(`${API}/morelife/sessions/${session.id}`, formData, config);
        toast({
          title: 'Session Updated',
          description: 'MoreLife session has been updated successfully.',
        });
      } else {
        await axios.post(`${API}/morelife/sessions`, formData, config);
        toast({
          title: 'Session Scheduled',
          description: 'New MoreLife session has been scheduled successfully.',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save session.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{session ? 'Edit MoreLife Session' : 'Schedule MoreLife Session'}</DialogTitle>
          <DialogDescription>
            {session ? 'Update session details' : 'Schedule a new coaching session'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                placeholder="Full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
            <div>
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sessionType">Session Type *</Label>
              <Select 
                value={formData.sessionType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sessionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private_1week">Private - 1 Week (₦45,000)</SelectItem>
                  <SelectItem value="private_2weeks">Private - 2 Weeks (₦85,000)</SelectItem>
                  <SelectItem value="joint">Joint Session (₦30,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Session notes or special requirements"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : session ? 'Update Session' : 'Schedule Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MoreLifeFormDialog;