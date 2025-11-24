import React, { useState } from 'react';
import { Heart, CheckCircle, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const challenges = [
  'More Stress?',
  'More Depression?',
  'More heart ache?',
  'More loneliness?',
  'More disappointments?',
  'Low self esteem?',
  'Low self confidence?',
  'Inferiority complex?',
  'Fear?',
  'Anxiety?',
  'Low productivity?',
  'Poor Creativity?'
];

const MoreLifePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    age: '',
    education: '',
    specificChallenge: '',
    likelyCause: '',
    durationOfChallenge: '',
    triggeringIncident: '',
    onDrugs: '',
    commencementMonth: '',
    sessionType: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/morelife/assessment`, formData);
      const assessmentId = response.data.assessmentId;

      // Initialize payment
      const paymentResponse = await axios.post(`${API}/morelife/assessment/${assessmentId}/payment`);
      
      if (paymentResponse.data.status) {
        window.location.href = paymentResponse.data.authorization_url;
      }
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error.response?.data?.detail || 'Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-20 h-20 mx-auto mb-6 text-pink-200" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              MORELIFE TRAINING SESSIONS
            </h1>
            <p className="text-2xl mb-8 text-pink-100">
              BUT need MORELIFE? SEEK MORELIFE TODAY
            </p>
            <p className="text-xl mb-8">
              Academic solutions to life's challenges through professional sessions
            </p>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Are You Experiencing?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {challenges.map((challenge, idx) => (
              <Card key={idx} className="border-2 hover:border-pink-500 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-pink-600" />
                    </div>
                    <p className="font-medium text-gray-800">{challenge}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Session Options */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Session Options</h2>
            <p className="text-xl text-gray-600">Choose the session type that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-4 border-pink-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                <CardTitle className="text-2xl">2 WEEKS PRIVATE SESSION</CardTitle>
                <CardDescription className="text-pink-100 text-lg">Comprehensive intensive program</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-pink-600 mb-4">₦85,000</div>
                  <ul className="space-y-3 text-left mb-6">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Personalized one-on-one sessions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>14 days of dedicated support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Academic approach to challenges</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Progress tracking</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-purple-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                <CardTitle className="text-2xl">ONE WEEK PRIVATE SESSION</CardTitle>
                <CardDescription className="text-purple-100 text-lg">Focused intensive program</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600 mb-4">₦45,000</div>
                  <ul className="space-y-3 text-left mb-6">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Personalized one-on-one sessions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>7 days of dedicated support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Academic approach to challenges</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Actionable strategies</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-lg text-gray-700 font-semibold bg-yellow-100 border-2 border-yellow-400 inline-block px-6 py-3 rounded-lg">
              ✨ JOINT SESSIONS ALSO AVAILABLE
            </p>
          </div>
        </div>
      </section>

      {/* Assessment Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4">MORELIFE SESSIONS FORM</h2>
              <p className="text-xl text-gray-600">Step {step} of 2 - Complete your assessment</p>
            </div>

            <Card className="border-2">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="name">NAME *</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="location">LOCATION *</Label>
                        <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="email">EMAIL *</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="age">AGE *</Label>
                        <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="education">EDUCATION *</Label>
                        <Input id="education" name="education" value={formData.education} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="specificChallenge">SPECIFIC AREA OF CHALLENGE *</Label>
                        <Textarea id="specificChallenge" name="specificChallenge" value={formData.specificChallenge} onChange={handleChange} required rows={4} />
                      </div>
                      <Button type="button" onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg py-6">
                        Continue to Step 2
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="likelyCause">WHAT DO YOU THINK IS THE LIKELY CAUSE? *</Label>
                        <Textarea id="likelyCause" name="likelyCause" value={formData.likelyCause} onChange={handleChange} required rows={4} />
                      </div>
                      <div>
                        <Label htmlFor="durationOfChallenge">HOW LONG HAVE YOU BEEN EXPERIENCING THIS? *</Label>
                        <Input id="durationOfChallenge" name="durationOfChallenge" value={formData.durationOfChallenge} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="triggeringIncident">WHICH INCIDENT TRIGGERED THIS CHALLENGE? *</Label>
                        <Textarea id="triggeringIncident" name="triggeringIncident" value={formData.triggeringIncident} onChange={handleChange} required rows={3} />
                      </div>
                      <div>
                        <Label htmlFor="onDrugs">ARE YOU ON ANY DRUGS FOR THIS CHALLENGE? *</Label>
                        <Select onValueChange={(value) => handleSelectChange('onDrugs', value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="commencementMonth">WHEN WOULD YOU LIKE TO COMMENCE? *</Label>
                        <Input id="commencementMonth" name="commencementMonth" type="month" value={formData.commencementMonth} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="sessionType">SESSION TYPE *</Label>
                        <Select onValueChange={(value) => handleSelectChange('sessionType', value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select session type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private_2weeks">2 Weeks Private Session - ₦85,000</SelectItem>
                            <SelectItem value="private_1week">1 Week Private Session - ₦45,000</SelectItem>
                            <SelectItem value="joint">Joint Session</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <p className="text-sm text-gray-700">
                          <strong>NOTE:</strong> Morelife sessions are purely academic solutions to your challenges. We are an educational consulting house and not a hospital.
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1">
                          Back
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg py-6">
                          {loading ? 'Processing...' : 'Submit & Proceed to Payment'}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MoreLifePage;