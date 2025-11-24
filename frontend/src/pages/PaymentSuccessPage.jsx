import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const reference = searchParams.get('reference');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setVerifying(false);
        return;
      }

      try {
        // Check if it's a book purchase or conference registration
        if (reference.startsWith('BOOK-')) {
          await axios.post(`${API}/books/purchase/verify`, { reference });
        } else {
          await axios.post(`${API}/payments/verify`, { reference });
        }
        setVerified(true);
      } catch (error) {
        console.error('Payment verification failed:', error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [reference]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Verifying your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="border-2 shadow-2xl">
          <CardContent className="pt-12 pb-8 text-center">
            {verified ? (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Payment Successful!
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                  Thank you for your purchase. Your payment has been confirmed.
                </p>

                <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
                  <p className="text-lg text-gray-700 mb-2">
                    <strong>Reference:</strong> {reference}
                  </p>
                  <p className="text-sm text-gray-600">
                    A confirmation email with all details has been sent to your email address.
                  </p>
                </div>

                {reference?.startsWith('BOOK-') && (
                  <div className="bg-green-50 p-6 rounded-lg mb-8 border border-green-200">
                    <Download className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Your Book is Ready!</h3>
                    <p className="text-sm text-gray-600">
                      Check your email for the download link. The book will be available for download immediately.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      <Home className="w-5 h-5 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link to="/books">
                    <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                      Browse More Books
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
                    <span className="text-4xl">❌</span>
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Payment Verification Failed
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                  We couldn't verify your payment. Please contact support if you've been charged.
                </p>

                <Link to="/contact">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Contact Support
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;