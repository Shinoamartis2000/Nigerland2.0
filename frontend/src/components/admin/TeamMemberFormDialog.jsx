import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TeamMemberFormDialog = ({ open, onOpenChange, member, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    credentials: '',
    bio: '',
    image: '',
    order: 0
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        title: member.title || '',
        credentials: member.credentials || '',
        bio: member.bio || '',
        image: member.image || '',
        order: member.order || 0
      });
    } else {
      setFormData({
        name: '',
        title: '',
        credentials: '',
        bio: '',
        image: '',
        order: 0
      });
    }
  }, [member, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (member) {
        // Update existing member
        await axios.put(`${API}/admin/team/${member.id}`, formData, config);
        toast({
          title: 'Team Member Updated',
          description: 'Team member has been updated successfully.',
        });
      } else {
        // Create new member
        await axios.post(`${API}/admin/team`, formData, config);
        toast({
          title: 'Team Member Added',
          description: 'New team member has been added successfully.',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save team member.',
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
          <DialogTitle>{member ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          <DialogDescription>
            {member ? 'Update team member information' : 'Add a new team member'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Mr. John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title/Position *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Managing Director"
              />
            </div>
            <div>
              <Label htmlFor="credentials">Credentials *</Label>
              <Input
                id="credentials"
                name="credentials"
                value={formData.credentials}
                onChange={handleChange}
                required
                placeholder="MBA, FCIT"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Professional background and experience"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/assets/team/photo.jpg"
              />
            </div>
            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                placeholder="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : member ? 'Update Member' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberFormDialog;
