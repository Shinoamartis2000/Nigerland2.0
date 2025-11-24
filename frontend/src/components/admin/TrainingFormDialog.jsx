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

const TrainingFormDialog = ({ open, onOpenChange, training, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    price: '',
    startDate: '',
    isActive: true
  });

  useEffect(() => {
    if (training) {
      setFormData({
        title: training.title || '',
        description: training.description || '',
        category: training.category || '',
        duration: training.duration || '',
        price: training.price || '',
        startDate: training.startDate || '',
        isActive: training.isActive !== undefined ? training.isActive : true
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        duration: '',
        price: '',
        startDate: '',
        isActive: true
      });
    }
  }, [training, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Need to match the TrainingProgramCreate model
      const trainingData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        duration: formData.duration,
        fee: parseFloat(formData.price),
        objectives: formData.objectives || [],
        targetAudience: formData.targetAudience || 'General audience',
        isActive: formData.isActive
      };

      if (training) {
        await axios.put(`${API}/admin/trainings/${training.id}`, trainingData, config);
        toast({
          title: 'Training Updated',
          description: 'Training program has been updated successfully.',
        });
      } else {
        await axios.post(`${API}/admin/trainings`, trainingData, config);
        toast({
          title: 'Training Created',
          description: 'New training program has been added successfully.',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save training program.',
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
          <DialogTitle>{training ? 'Edit Training Program' : 'Add Training Program'}</DialogTitle>
          <DialogDescription>
            {training ? 'Update training program details' : 'Create a new training program'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="title">Program Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Advanced Tax Planning"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g. Tax, Business"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="e.g. 4 weeks"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Program description and objectives"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : training ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingFormDialog;