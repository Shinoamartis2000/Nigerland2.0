import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { conferences2026 } from '../mock';
import { registerForConference, initializePayment } from '../services/api';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';

const Conferences2026Page = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedConference, setSelectedConference] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    profession: '',
    additionalInfo: ''
  });

  const handleOpenDialog = (conference) => {
    setSelectedConference(conference);
    setShowDialog(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Extract amount from fee string
      let amount = parseInt(selectedConference.fee.replace(/[^0-9]/g, ''));
      if (!amount || isNaN(amount)) {
        amount = 50000; // Default ₦50,000
      }

      // Direct Paystack initialization with conference details
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${BACKEND_URL}/api/conference/register-and-pay`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization || 'N/A',
        profession: formData.profession || 'N/A',
        additionalInfo: formData.additionalInfo || '',
        conference: selectedConference.title,
        conferenceDate: selectedConference.date,
        amount: amount
      });

      if (response.data.authorization_url) {
        // Success! Redirect to payment
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error('Payment initialization failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || error.message || 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              2026 Conferences
            </h1>
            <p className="text-xl text-blue-100">
              Plan ahead and register for our upcoming professional development events
            </p>
          </div>
        </div>
      </section>

      {/* Conferences Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {conferences2026.map((conference, index) => (
              <Card key={conference.id} className="border-2 hover:border-blue-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                        Conference {index + 1}
                      </div>
                      <CardTitle className="text-2xl md:text-3xl mb-2">{conference.title}</CardTitle>
                      <CardDescription className="text-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5" />
                          <span>{conference.date}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                      <div className="text-3xl font-bold text-blue-600">{conference.fee}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-700">{conference.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>For Whom</span>
                      </h4>
                      <p className="text-gray-700">{conference.forWhom}</p>
                    </div>

                    <div className="pt-4">
                      <Dialog open={showDialog && selectedConference?.id === conference.id} onOpenChange={(open) => {
                        setShowDialog(open);
                        if (!open) {
                          setFormData({
                            fullName: '',
                            email: '',
                            phone: '',
                            organization: '',
                            profession: '',
                            additionalInfo: ''
                          });
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleOpenDialog(conference)}>
                            Register Now
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Register for {conference.title}</DialogTitle>
                            <DialogDescription>
                              Fill in your details to register and proceed to payment
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                              <Label htmlFor="phone">Phone Number *</Label>
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
                              <Label htmlFor="organization">Organization *</Label>
                              <Input
                                id="organization"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                required
                                placeholder="Your company/organization"
                              />
                            </div>
                            <div>
                              <Label htmlFor="profession">Profession *</Label>
                              <Input
                                id="profession"
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                                required
                                placeholder="Your profession"
                              />
                            </div>
                            <div>
                              <Label htmlFor="additionalInfo">Additional Information</Label>
                              <Textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                placeholder="Any special requirements or questions?"
                                rows={3}
                              />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="text-left">
                                <p className="text-sm text-gray-600">Conference Fee</p>
                                <p className="text-2xl font-bold text-blue-600">{conference.fee}</p>
                              </div>
                              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                                {loading ? 'Processing...' : 'Proceed to Payment'}
                                <ArrowRight className="ml-2 w-4 h-4" />
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need More Information?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us for group discounts, custom training programs, or any questions about our conferences
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Conferences2026Page;