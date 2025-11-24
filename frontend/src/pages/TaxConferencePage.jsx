import React, { useState } from 'react';
import { Calendar, Users, Video, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const TaxConferencePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    profession: '',
    additionalInfo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct Paystack initialization with conference details
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${BACKEND_URL}/api/conference/register-and-pay`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization || 'N/A',
        profession: formData.profession || 'N/A',
        additionalInfo: formData.additionalInfo || '',
        conference: 'Tax Conference 2025',
        conferenceDate: 'December 9 & 10, 2025',
        amount: 50000
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
              ONLINE CONFERENCE 2025
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Understanding the New Tax Reforms and Their Implications
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              December 9 & 10, 2025 | Online
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>2 Days</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Video className="w-5 h-5" />
                <span>Online Event</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Users className="w-5 h-5" />
                <span>Limited Seats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Who Should Attend</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tax Professionals</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Entrepreneurs</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policymakers</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Men & Women</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Civil Servants</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accountants</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Owners</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Finance Professionals</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Conference Overview */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Conference Overview</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  This Tax Conference is designed to provide a comprehensive platform for tax professionals, 
                  businesses, and policymakers to understand the implications of the new tax law, compare it 
                  with the old one, and discuss strategies for effective implementation, compliance, and 
                  optimization of tax opportunities.
                </p>
              </CardContent>
            </Card>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Comprehensive analysis of new tax reforms</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Comparison with previous tax legislation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Implementation and compliance strategies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Tax optimization opportunities</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Best practices from industry experts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conference Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Certificate of attendance</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Access to conference materials</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Networking opportunities</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Q&A sessions with experts</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Lifetime access to recordings</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Register Now</h2>
              <p className="text-gray-600">
                Complete the form below to register for the conference. Payment details will be sent to your email.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
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
                    <div className="space-y-2">
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

                    <div className="space-y-2">
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

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      placeholder="Your company or organization"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession/Role *</Label>
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Tax Consultant, Accountant, Business Owner"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      placeholder="Any special requirements or questions?"
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Register & Proceed to Payment'}
                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    * Registration details and payment instructions will be sent to your email
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxConferencePage;