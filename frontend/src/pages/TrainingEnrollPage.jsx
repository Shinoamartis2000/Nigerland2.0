import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TrainingEnrollPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    position: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just send to contact/inquiry since we don't have specific program IDs
      await axios.post(`${API}/contact`, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: `Training Enrollment - ${category || 'General'}`,
        message: `Organization: ${formData.organization}\nPosition: ${formData.position}\n\nI would like to enroll in the ${category || 'training'} program.`
      });

      toast({
        title: 'Registration Submitted!',
        description: 'We have received your training enrollment request. Check your email for confirmation and next steps.',
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        position: ''
      });

      // Redirect to training page after 2 seconds
      setTimeout(() => {
        navigate('/training');
      }, 2000);
    } catch (error) {
      toast({
        title: 'Enrollment Failed',
        description: error.response?.data?.detail || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-4xl font-bold mb-4">Training Program Enrollment</h1>
            {category && (
              <p className="text-xl text-gray-600 capitalize">{category.replace('-', ' ')} Training</p>
            )}
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-2xl">Reserve Your Spot</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="organization">Organization/Company *</Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    placeholder="Your organization name"
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position/Role *</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    placeholder="Your current position"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>Next Steps:</strong> After submitting this form, you will receive a confirmation email with:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                    <li>Program details and schedule</li>
                    <li>Payment information</li>
                    <li>Training materials information</li>
                    <li>Venue or online meeting details</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
                >
                  {loading ? 'Submitting...' : 'Reserve My Spot'}
                  {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingEnrollPage;