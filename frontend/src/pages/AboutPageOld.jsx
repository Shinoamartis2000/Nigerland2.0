import React from 'react';
import { Award, Target, Lightbulb, TrendingUp, Heart, BookOpen, Users, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Nigerland Consult
            </h1>
            <p className="text-xl text-blue-100">
              Celebrating 25 Years of Excellence (2000-2025)
            </p>
          </div>
        </div>
      </section>

      {/* Nigerland at 25 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <Award className="w-12 h-12 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold">NIGERLAND AT 25</h2>
            </div>
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  From October 2000 to Date, Nigerland has contributed immensely towards developing MEN and 
                  Creating Solutions. Nigerland hit 25 in October 2025 and the diverse family is set to celebrate 
                  her and her ideals.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Prominent feature of this celebration is the humanitarian side which will be anchored by 
                  Nigerland Books Foundation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="border-2 hover:border-blue-600 transition-all duration-300">
                  <CardHeader>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-blue-600">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-2xl">{member.name}</CardTitle>
                      <CardDescription className="text-lg font-semibold text-blue-600">
                        {member.title}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-1">Credentials</h4>
                        <p className="text-gray-700">{member.credentials}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">About</h4>
                        <p className="text-gray-700">{member.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Nigerland Projects</h2>
            <div className="space-y-6">
              {projects.map((project) => (
                <Card key={project.id} className="border-2 hover:border-blue-600 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                        {project.year && (
                          <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {project.year}
                          </div>
                        )}
                        {project.status && (
                          <div className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {project.status}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-gray-700 leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logistics & Marketing */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <TrendingUp className="w-10 h-10 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold">Nigerland Logistics & Marketing</h2>
            </div>
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our Logistics arm is headed by Uduak Nkanga Ngwaba. The arm renders first class services 
                  in travels and tours as well as provision of marketing services to clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Solutions Models */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Lightbulb className="w-10 h-10 text-blue-600" />
                <h2 className="text-3xl md:text-4xl font-bold">Nigerland Business Solutions Models</h2>
              </div>
              <p className="text-xl text-gray-600">
                In our bid to solve Business Place Problems (BPPs), Nigerland has developed innovative Business Solutions Models (BSMs)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {businessModels.map((model) => (
                <Card key={model.id} className="border-2 hover:border-blue-600 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{model.name}</CardTitle>
                    <CardDescription className="font-semibold text-blue-600">
                      {model.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{model.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;