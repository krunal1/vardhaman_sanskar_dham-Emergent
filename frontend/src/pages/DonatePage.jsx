import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Smartphone, Globe, DollarSign, Receipt, Phone } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DonatePage = () => {
  const [donationDetails, setDonationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonationDetails();
  }, []);

  const fetchDonationDetails = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/donation`);
      setDonationDetails(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donation details:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6b] via-[#2a4a7b] to-[#1a3a6b]">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="VSD Logo" className="h-12" onError={(e) => e.target.style.display = 'none'} />
              <div>
                <p className="text-xs text-amber-400">Inspired By : P.P.P. Chandrashekharvijaiyji M.S.</p>
                <h1 className="text-xl font-bold text-red-600">VARDHMAN SANSKARDHAM</h1>
              </div>
            </a>
            <Button onClick={() => window.location.href = '/'} variant="outline" className="text-white border-white/30 hover:bg-white/10">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Support Our Mission</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your generous contribution helps us continue our work in serving humanity and spreading compassion
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Domestic Donations */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-8 h-8 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">Domestic Donations</h2>
              </div>

              {donationDetails && (
                <div className="space-y-6">
                  {/* Bank Details */}
                  <div className="bg-white/5 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4">Bank Transfer Details</h3>
                    <div className="grid gap-3 text-white">
                      <div>
                        <p className="text-sm text-gray-400">Bank Name</p>
                        <p className="font-medium">{donationDetails.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Account Name</p>
                        <p className="font-medium">{donationDetails.accountName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Account Number</p>
                          <p className="font-medium">{donationDetails.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">IFSC Code</p>
                          <p className="font-medium">{donationDetails.ifscCode}</p>
                        </div>
                      </div>
                      {donationDetails.branch && (
                        <div>
                          <p className="text-sm text-gray-400">Branch</p>
                          <p className="font-medium">{donationDetails.branch}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* UPI & QR Code */}
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4">UPI Payment</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400">UPI ID</p>
                        <p className="font-medium text-white text-lg">{donationDetails.upiId}</p>
                      </div>
                      {donationDetails.qrCodeImage && (
                        <div className="flex justify-center">
                          <img 
                            src={donationDetails.qrCodeImage} 
                            alt="UPI QR Code" 
                            className="w-64 h-64 object-contain rounded-lg border-4 border-amber-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile App */}
                  {donationDetails.playStoreLink && (
                    <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 p-6 rounded-lg border border-amber-400/30">
                      <div className="flex items-center gap-3 mb-4">
                        <Smartphone className="w-6 h-6 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">Donate via Mobile App</h3>
                      </div>
                      <a 
                        href={donationDetails.playStoreLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                          <Smartphone className="w-5 h-5 mr-2" />
                          Download Android App
                        </Button>
                      </a>
                    </div>
                  )}

                  {/* Receipt Contact */}
                  {donationDetails.receiptContact && (
                    <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-400/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Receipt className="w-6 h-6 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Receipt Information</h3>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        For donation receipts, please contact us via {donationDetails.receiptContactType || 'WhatsApp'}
                      </p>
                      <a 
                        href={`https://wa.me/${donationDetails.receiptContact.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
                      >
                        <Phone className="w-4 h-4" />
                        {donationDetails.receiptContact}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Foreign Donations */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-8 h-8 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">Foreign Donations</h2>
              </div>

              {donationDetails?.foreignDonation ? (
                <div className="space-y-6">
                  {/* FCRA Account Details */}
                  <div className="bg-white/5 p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4">FCRA Account Details</h3>
                    <div className="grid gap-3 text-white">
                      <div>
                        <p className="text-sm text-gray-400">Bank Name</p>
                        <p className="font-medium">{donationDetails.foreignDonation.bankName || 'To be updated'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Account Name</p>
                        <p className="font-medium">{donationDetails.foreignDonation.accountName || 'To be updated'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Account Number</p>
                        <p className="font-medium">{donationDetails.foreignDonation.accountNumber || 'To be updated'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">SWIFT Code</p>
                        <p className="font-medium">{donationDetails.foreignDonation.swiftCode || 'To be updated'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">IFSC Code</p>
                        <p className="font-medium">{donationDetails.foreignDonation.ifscCode || 'To be updated'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-amber-500/10 p-6 rounded-lg border border-amber-400/30">
                    <h3 className="text-lg font-semibold text-amber-400 mb-3">Important Information</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Foreign donations are accepted under FCRA regulations</li>
                      <li>• Tax exemption certificates available for eligible donations</li>
                      <li>• Please contact us for any queries regarding international transfers</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 p-8 rounded-lg text-center">
                  <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Foreign donation details will be updated soon</p>
                  <p className="text-sm text-gray-500">Please contact us directly for international donations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tax Benefits Section */}
        <Card className="mt-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Tax Benefits & Transparency</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/5 p-6 rounded-lg">
                <Receipt className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">80G Certified</h3>
                <p className="text-gray-300 text-sm">Donations are eligible for tax deduction under Section 80G</p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <DollarSign className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">100% Utilized</h3>
                <p className="text-gray-300 text-sm">Every rupee goes directly towards our humanitarian activities</p>
              </div>
              <div className="bg-white/5 p-6 rounded-lg">
                <Globe className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Transparent</h3>
                <p className="text-gray-300 text-sm">Regular updates on how your donations are making an impact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonatePage;
