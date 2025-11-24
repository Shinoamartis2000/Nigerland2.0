import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Users, ShoppingCart, Download, Star, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const booksData = [
  {
    id: 'book1',
    title: "Nigeria's Hero Vol 1",
    author: "Kelechi Ngwaba",
    description: "Inspiring stories of Nigerian heroes and their contributions to nation building.",
    price: 2500,
    image: "/assets/books/building courage.jpg",
    pdfUrl: "/assets/books/Nigeria's hero Vol 1.pdf",
    isPaid: true,
    category: "History",
    rating: 4.8
  },
  {
    id: 'book2',
    title: "Nigeria's Hero Vol 2",
    author: "Kelechi Ngwaba",
    description: "Continuation of inspiring Nigerian hero stories.",
    price: 2500,
    image: "/assets/books/salute to .jpg",
    pdfUrl: "/assets/books/Nigeria's hero Vol 2 .pdf",
    isPaid: true,
    category: "History",
    rating: 4.9
  },
  {
    id: 'book3',
    title: "The Good Nigerian",
    author: "Kelechi Ngwaba",
    description: "A compelling narrative about values and character development.",
    price: 3000,
    image: "/assets/books/the good nigerian.jpg",
    pdfUrl: "/assets/books/the good nigerian.pdf",
    isPaid: true,
    category: "Character Development",
    rating: 5.0
  },
  {
    id: 'book4',
    title: "Yomi and the Three Thieves",
    author: "Kelechi Ngwaba",
    description: "An engaging children's story teaching important life lessons.",
    price: 2000,
    image: "/assets/books/yomi.jpg",
    pdfUrl: "/assets/books/yomi n d three thieves (4).pdf",
    isPaid: true,
    category: "Children's Literature",
    rating: 4.7
  },
  {
    id: 'book5',
    title: "Building Courage",
    author: "Kelechi Ngwaba",
    description: "Developing courage and confidence in young minds.",
    price: 2200,
    image: "/assets/books/building courage.jpg",
    isPaid: true,
    category: "Character Development",
    rating: 4.6
  },
  {
    id: 'book6',
    title: "Never Again",
    author: "Kelechi Ngwaba",
    description: "Learning from history to build a better future.",
    price: 2500,
    image: "/assets/books/never again.jpg",
    isPaid: true,
    category: "History",
    rating: 4.5
  },
  {
    id: 'book7',
    title: "The Generations",
    author: "Kelechi Ngwaba",
    description: "Understanding generational wisdom and values.",
    price: 2800,
    image: "/assets/books/the generations.jpg",
    isPaid: true,
    category: "Family & Society",
    rating: 4.8
  },
  {
    id: 'book8',
    title: "The Quest",
    author: "Kelechi Ngwaba",
    description: "An adventure of self-discovery and purpose.",
    price: 2300,
    image: "/assets/books/the quest.jpg",
    isPaid: true,
    category: "Adventure",
    rating: 4.7
  },
  {
    id: 'book9',
    title: "The Tiger and Lion",
    author: "Kelechi Ngwaba",
    description: "Fables teaching courage, wisdom and strength.",
    price: 2000,
    image: "/assets/books/the tiger and lion.jpg",
    isPaid: true,
    category: "Children's Literature",
    rating: 4.9
  },
  {
    id: 'book10',
    title: "Three Feet Tall",
    author: "Kelechi Ngwaba",
    description: "Stories of children making a big difference.",
    price: 2100,
    image: "/assets/books/three feet tall.jpg",
    isPaid: true,
    category: "Children's Literature",
    rating: 4.8
  }
];

const BooksPageEnhanced = () => {
  const { toast } = useToast();
  const [selectedBook, setSelectedBook] = useState(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [purchaseForm, setPurchaseForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API}/books`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        // Fallback to mock data if API fails
        setBooks(booksData);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, []);

  const categories = ['All', ...new Set(books.map(book => book.category))];

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(book => book.category === selectedCategory);

  const handlePurchase = async (book) => {
    setSelectedBook(book);
    setPurchaseDialogOpen(true);
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create purchase
      const purchaseResponse = await axios.post(`${API}/books/purchase`, {
        bookId: selectedBook.id,
        ...purchaseForm
      });

      const purchaseId = purchaseResponse.data.purchaseId;

      // Initialize payment
      const paymentResponse = await axios.post(
        `${API}/books/purchase/${purchaseId}/payment`
      );

      if (paymentResponse.data.status) {
        // Redirect to Paystack payment page
        window.location.href = paymentResponse.data.authorization_url;
      }
    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: error.response?.data?.detail || 'Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold">Nigerland Books Foundation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Inspiring Minds Through Literature
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover our collection of transformative books that build character, inspire courage, and celebrate Nigerian heritage
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">{booksData.length}+</div>
                <div className="text-sm text-blue-100">Published Books</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">25</div>
                <div className="text-sm text-blue-100">Years of Impact</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">1000s</div>
                <div className="text-sm text-blue-100">Lives Touched</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Book Collection</h2>
            <p className="text-xl text-gray-600">
              Secure your copy today and embark on a transformative reading journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-500">
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ₦{book.price.toLocaleString()}
                  </div>
                  {book.rating && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{book.rating}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">{book.title}</CardTitle>
                  <CardDescription className="text-sm font-medium text-blue-600">{book.author}</CardDescription>
                  <CardDescription className="text-xs text-gray-500 mt-1">{book.category}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{book.description}</p>
                  <Button 
                    onClick={() => handlePurchase(book)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Purchase & Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Foundation Impact */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Heart className="w-16 h-16 mx-auto mb-6 text-red-400" />
            <h2 className="text-4xl font-bold mb-4">About Our Foundation</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              The Nigerland Books Foundation is dedicated to developing character, building courage, 
              and inspiring the next generation through impactful literature. Our collection focuses 
              on Nigerian heroes, values, and stories that shape young minds.
            </p>
            <p className="text-lg text-blue-100 mt-4">
              As part of Nigerland's 25th anniversary celebration, the humanitarian work of the Books 
              Foundation takes center stage, continuing our mission of developing MEN and Creating Solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Foundation Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { img: "/assets/books/children group.jpg", title: "Community Engagement" },
              { img: "/assets/books/children1.jpg", title: "Reading Programs" },
              { img: "/assets/books/children2.jpg", title: "Youth Development" },
              { img: "/assets/books/present1.jpg", title: "Book Distribution" }
            ].map((item, idx) => (
              <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Purchase Book</DialogTitle>
            <DialogDescription>
              Complete your purchase to get instant access to {selectedBook?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-4">
                  <img 
                    src={selectedBook.image} 
                    alt={selectedBook.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{selectedBook.title}</h3>
                    <p className="text-sm text-gray-600">{selectedBook.author}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      ₦{selectedBook.price.toLocaleString()}
                    </p>
                    {!selectedBook.pdfUrl && (
                      <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-2">
                        <p className="text-xs text-amber-800">
                          📧 This e-book will be sent to your email after payment
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={purchaseForm.fullName}
                    onChange={(e) => setPurchaseForm({...purchaseForm, fullName: e.target.value})}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={purchaseForm.email}
                    onChange={(e) => setPurchaseForm({...purchaseForm, email: e.target.value})}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={purchaseForm.phone}
                    onChange={(e) => setPurchaseForm({...purchaseForm, phone: e.target.value})}
                    required
                    placeholder="+234..."
                  />
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold">What you'll get:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Instant download access</li>
                        <li>High-quality PDF format</li>
                        <li>Download link sent to email</li>
                        <li>Lifetime access</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay ₦${selectedBook.price.toLocaleString()} Now`}
                </Button>
              </form>

              <p className="text-xs text-gray-500 text-center">
                Secure payment powered by Paystack. You will be redirected to complete payment.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksPageEnhanced;