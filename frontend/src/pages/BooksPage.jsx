import React from 'react';
import { BookOpen, Heart, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { books } from '../mock';
import { Button } from '../components/ui/button';

const BooksPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <BookOpen className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Nigerland Books Foundation</h1>
            </div>
            <p className="text-xl text-blue-100">
              Inspiring minds and building character through literature
            </p>
          </div>
        </div>
      </section>

      {/* About Foundation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Heart className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About Our Foundation</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      The Nigerland Books Foundation is dedicated to developing character, building courage, 
                      and inspiring the next generation through impactful literature. Our collection focuses 
                      on Nigerian heroes, values, and stories that shape young minds.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      As part of Nigerland's 25th anniversary celebration, the humanitarian work of the Books 
                      Foundation takes center stage, continuing our mission of developing MEN and Creating Solutions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Books Collection */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Book Collection</h2>
              <p className="text-xl text-gray-600">
                Stories that inspire, educate, and transform
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <Card key={book.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                    <img 
                      src={book.image} 
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  </CardHeader>
                  {book.pdf && (
                    <CardContent>
                      <a href={book.pdf} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full">
                          View PDF
                        </Button>
                      </a>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center border-2 hover:border-blue-600 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-blue-600">10+</CardTitle>
                  <CardDescription className="text-lg">Published Books</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center border-2 hover:border-blue-600 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-blue-600">1000s</CardTitle>
                  <CardDescription className="text-lg">Lives Impacted</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center border-2 hover:border-blue-600 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-blue-600">25</CardTitle>
                  <CardDescription className="text-lg">Years of Service</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery of Children Images */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Foundation Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src="/assets/books/children group.jpg" 
                  alt="Children Group"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src="/assets/books/children1.jpg" 
                  alt="Children Reading"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src="/assets/books/children2.jpg" 
                  alt="Children Learning"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src="/assets/books/present1.jpg" 
                  alt="Book Presentation"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BooksPage;