import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, BookOpen, Target } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Logo from '../components/Logo';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Design */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 transform hover:scale-105 transition-transform duration-300">
              <Logo size="xl" className="drop-shadow-2xl" />
            </div>
            
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🎉 Celebrating 25 Years of Excellence • 2000-2025
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Developing <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MEN</span> and Creating <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Leading management consulting, training, and business development in Nigeria for over two decades
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tax-conference">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Register for Tax Conference 2025
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Conference with Enhanced Design */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg animate-pulse">
              <Calendar className="w-4 h-4" />
              <span>UPCOMING EVENT</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Understanding the New Tax Reforms
              <br />
              <span className="text-yellow-400">and Their Implications</span>
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xl mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>December 9 & 10, 2025</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Online Event</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
              {['Tax Professionals', 'Entrepreneurs', 'Policymakers', 'Business Leaders'].map((audience, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                  <Users className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                  <p className="font-semibold text-sm md:text-base">{audience}</p>
                </div>
              ))}
            </div>

            <Link to="/tax-conference">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-yellow-400 hover:text-gray-900 text-lg px-10 py-7 shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold">
                Register Now - Limited Seats
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <p className="mt-6 text-blue-100 text-sm">
              ✨ Early bird pricing available • Certificate of attendance included
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for businesses, governments, and individuals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group border-2 border-transparent hover:border-blue-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">Conferences & Training</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Professional development programs and conferences on tax, security, governance, and business
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-2 border-transparent hover:border-indigo-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-indigo-50">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">Management Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Expert consulting services led by experienced professionals in accounting and business management
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-2 border-transparent hover:border-purple-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">Books Foundation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Publishing impactful books and supporting literacy through our Nigerland Books Foundation
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group border-2 border-transparent hover:border-pink-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-pink-50">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-pink-600 transition-colors">Business Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Innovative business models including recruitment, creativity assessment, and marketing strategies
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2026 Conferences Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              2026 Conferences
            </h2>
            <p className="text-xl text-gray-600">
              Mark your calendars for these upcoming events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Tax Conference</CardTitle>
                <CardDescription>January 15 & 16, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">₦146,000</p>
                <p className="text-sm text-gray-600 mb-4">Tax planning and compliance strategies</p>
                <Link to="/conferences-2026">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Smart Government Conference</CardTitle>
                <CardDescription>May 22 & 23, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">₦259,000</p>
                <p className="text-sm text-gray-600 mb-4">Digital transformation in governance</p>
                <Link to="/conferences-2026">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Business Development</CardTitle>
                <CardDescription>October 29 & 30, 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">Contact Us</p>
                <p className="text-sm text-gray-600 mb-4">Growth strategies and optimization</p>
                <Link to="/conferences-2026">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/conferences-2026">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View All 2026 Conferences
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Get in touch with us to learn how we can help you achieve your goals
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              Contact Us Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;