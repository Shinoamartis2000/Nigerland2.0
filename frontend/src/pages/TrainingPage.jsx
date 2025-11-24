import React, { useState } from 'react';
import { GraduationCap, BookOpen, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';

const trainingCategories = [
  { id: 'management', title: 'MANAGEMENT', icon: Briefcase, color: 'blue', programs: ['Strategic Management', 'Project Management', 'Human Resource Management', 'Operations Management', 'Change Management'] },
  { id: 'marketing', title: 'MARKETING', icon: GraduationCap, color: 'green', programs: ['Digital Marketing', 'Brand Management', 'Sales Management', 'Marketing Strategy', 'Customer Relationship Management'] },
  { id: 'business-admin', title: 'BUSINESS ADMIN', icon: BookOpen, color: 'purple', programs: ['Business Administration', 'Office Management', 'Business Communication', 'Business Ethics', 'Administrative Skills'] },
  { id: 'computer', title: 'COMPUTER', icon: GraduationCap, color: 'indigo', programs: ['Computer Applications', 'Data Management', 'IT Skills', 'Software Training', 'Digital Literacy'] },
  { id: 'public-health', title: 'PUBLIC HEALTH', icon: BookOpen, color: 'red', programs: ['Health Management', 'Community Health', 'Health Safety', 'Disease Prevention', 'Public Health Administration'] },
  { id: 'social-works', title: 'SOCIAL WORKS', icon: GraduationCap, color: 'pink', programs: ['Community Development', 'Social Welfare', 'Counseling Skills', 'Social Work Ethics', 'Community Engagement'] },
  { id: 'safety', title: 'SAFETY', icon: BookOpen, color: 'yellow', programs: ['Occupational Safety', 'Fire Safety', 'Workplace Safety', 'Safety Management', 'Risk Assessment'] },
  { id: 'security', title: 'SECURITY', icon: GraduationCap, color: 'gray', programs: ['Security Management', 'Corporate Security', 'Security Systems', 'Emergency Response', 'Security Operations'] },
  { id: 'insurgency', title: 'INSURGENCY', icon: BookOpen, color: 'orange', programs: ['Counter Insurgency', 'Security Intelligence', 'Conflict Resolution', 'Peace Building', 'Crisis Management'] },
  { id: 'accountancy', title: 'ACCOUNTANCY', icon: Briefcase, color: 'teal', programs: ['Financial Accounting', 'Management Accounting', 'Auditing', 'Taxation', 'Financial Management'] },
  { id: 'creativity', title: 'CREATIVITY', icon: GraduationCap, color: 'rose', programs: ['Creative Thinking', 'Innovation Management', 'Design Thinking', 'Problem Solving', 'Creative Leadership'] },
  { id: 'communication', title: 'COMMUNICATION SKILLS', icon: BookOpen, color: 'cyan', programs: ['Business Communication', 'Public Speaking', 'Presentation Skills', 'Written Communication', 'Interpersonal Skills'] }
];

const TrainingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600', green: 'from-green-500 to-emerald-600', purple: 'from-purple-500 to-violet-600',
    indigo: 'from-indigo-500 to-blue-600', red: 'from-red-500 to-rose-600', pink: 'from-pink-500 to-rose-600',
    yellow: 'from-yellow-500 to-orange-600', gray: 'from-gray-500 to-slate-600', orange: 'from-orange-500 to-red-600',
    teal: 'from-teal-500 to-cyan-600', rose: 'from-rose-500 to-pink-600', cyan: 'from-cyan-500 to-blue-600'
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <GraduationCap className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">TRAINING PROGRAMMES</h1>
            <p className="text-2xl mb-8 text-blue-100">Professional development programs across multiple disciplines</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Training Categories</h2>
            <p className="text-xl text-gray-600">Select a category to view available programs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trainingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="group cursor-pointer border-2 hover:shadow-2xl" onClick={() => setSelectedCategory(category)}>
                  <CardHeader className={`bg-gradient-to-br ${colorClasses[category.color]} text-white rounded-t-lg`}>
                    <div className="flex items-center space-x-3">
                      <Icon className="w-8 h-8" />
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <CardDescription className="text-base mb-4">{category.programs.length} Programs Available</CardDescription>
                    <Button className="w-full" variant="outline">View Programs<ArrowRight className="ml-2 w-4 h-4" /></Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {selectedCategory && (
        <section className="py-16 bg-white border-t-4 border-blue-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">{selectedCategory.title} PROGRAMS</h2>
              </div>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    {selectedCategory.programs.map((program, idx) => (
                      <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="text-lg font-medium flex-1">{program}</span>
                        <Link to={`/training/enroll/${selectedCategory.id}`}><Button size="sm">Enroll Now</Button></Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="text-center mt-8">
                <Link to={`/training/enroll/${selectedCategory.id}`}>
                  <Button size="lg" className={`bg-gradient-to-r ${colorClasses[selectedCategory.color]} text-lg px-8 py-6`}>
                    Register for {selectedCategory.title} Training
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">CONSULTANCY SERVICES</h2>
            <p className="text-xl mb-8">For Public & Private Sectors</p>
            <Link to="/contact"><Button size="lg" className="bg-white text-gray-900">Request Consultancy Services</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;
