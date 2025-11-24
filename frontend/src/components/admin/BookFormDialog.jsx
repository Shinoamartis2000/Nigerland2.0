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

const BookFormDialog = ({ open, onOpenChange, book, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    image: '',
    pdfUrl: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        price: book.price || '',
        category: book.category || '',
        image: book.image || '',
        pdfUrl: book.pdfUrl || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        category: '',
        image: '',
        pdfUrl: ''
      });
    }
  }, [book, open]);

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

      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        isPaid: true
      };

      if (book) {
        // Update existing book
        await axios.put(`${API}/admin/books/${book.id}`, bookData, config);
        toast({
          title: 'Book Updated',
          description: 'Book has been updated successfully.',
        });
      } else {
        // Create new book
        await axios.post(`${API}/admin/books`, bookData, config);
        toast({
          title: 'Book Created',
          description: 'New book has been added successfully.',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save book.',
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
          <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {book ? 'Update book information' : 'Fill in the details to add a new book'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Book title"
              />
            </div>
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₦) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="5000"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g. Nation Building"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Book description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="/assets/books/book-cover.jpg"
            />
          </div>

          <div>
            <Label htmlFor="pdfUrl">PDF URL</Label>
            <Input
              id="pdfUrl"
              name="pdfUrl"
              value={formData.pdfUrl}
              onChange={handleChange}
              placeholder="/assets/books/book.pdf"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookFormDialog;
