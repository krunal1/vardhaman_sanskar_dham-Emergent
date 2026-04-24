import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Smartphone, DollarSign, Receipt, Phone, Mail, MapPinned, Globe, ArrowLeft, CheckCircle, Shield } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DonatePage = () => {
  const navigate = useNavigate();
  const [donationDetails, setDonationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    fetchDonationDetails();
  }, []);

  const fetchDonationDetails = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/donation`);
      setDonationDetails(data);
    } catch (error) {
      console.error('Error fetching donation details:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a3a6b] to-[#0f2244]">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-[#d97706] rounded-full animate-spin mx-auto mb-3"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6b] via-[#2a4a7b] to-[#1a3a6b]">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png"
                alt="VSD Logo"
                className="h-12 w-auto object-contain"
              />
            </button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#d97706] text-white border-0 px-4 py-1">Support Us</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Support Our Mission</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Your generous contribution helps us continue our work in serving humanity and spreading compassion
          </p>
        </div>

        {/* Tax Benefit Banner */}
        <div className="bg-green-900/30 border border-green-400/30 rounded-xl p-4 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-green-300">
            <Shield className="w-5 h-5" />
            <p className="text-sm font-semibold">All donations are eligible for 80G tax exemption under the Income Tax Act</p>
          </div>
        </div>

        {donationDetails && (
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Domestic Donations */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-7 h-7 text-amber-400" />
                  <CardTitle className="text-xl text-white">Domestic Donations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Bank Transfer */}
                <div className="bg-white/5 p-5 rounded-xl border border-white/15">
                  <p className="text-amber-400 font-bold text-sm mb-4 uppercase tracking-wide">Bank Transfer / NEFT / RTGS</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Bank Name', value: donationDetails.bankName },
                      { label: 'Account Name', value: donationDetails.accountName },
                      { label: 'Account Number', value: donationDetails.accountNumber },
                      { label: 'IFSC Code', value: donationDetails.ifscCode },
                      { label: 'Branch', value: donationDetails.branch },
                    ].filter(item => item.value).map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-sm text-blue-200">{item.label}:</span>
                        <button
                          onClick={() => copyToClipboard(item.value, item.label)}
                          className="font-semibold text-white text-sm hover:text-amber-400 transition-colors flex items-center gap-1"
                          title="Click to copy"
                        >
                          {item.value}
                          {copied === item.label && <CheckCircle className="w-3 h-3 text-green-400" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UPI */}
                {donationDetails.upiId && (
                  <div className="bg-white/5 p-5 rounded-xl border border-white/15 text-center">
                    <p className="text-amber-400 font-bold text-sm mb-3 uppercase tracking-wide">UPI Payment</p>
                    <p className="text-sm text-blue-200 mb-2">UPI ID:</p>
                    <button
                      onClick={() => copyToClipboard(donationDetails.upiId, 'upi')}
                      className="text-2xl font-bold text-white hover:text-amber-400 transition-colors"
                      title="Click to copy UPI ID"
                    >
                      {donationDetails.upiId}
                      {copied === 'upi' && <span className="text-sm text-green-400 ml-2">Copied!</span>}
                    </button>
                    {donationDetails.qrCodeImage && (
                      <div className="mt-4 flex justify-center">
                        <div className="bg-white p-3 rounded-lg">
                          <img
                            src={donationDetails.qrCodeImage}
                            alt="UPI QR Code"
                            className="w-48 h-48 object-contain"
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-blue-300 mt-3">Scan QR code with any UPI app (GPay, PhonePe, Paytm, etc.)</p>
                  </div>
                )}

                {/* Receipt Contact */}
                {donationDetails.receiptContact && (
                  <div className="bg-amber-900/20 p-4 rounded-xl border border-amber-400/30 text-center">
                    <p className="text-amber-400 font-bold text-sm mb-2">For Receipt / Acknowledgement</p>
                    <p className="text-white font-bold text-lg">{donationDetails.receiptContact}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Foreign Donations */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-7 h-7 text-amber-400" />
                  <CardTitle className="text-xl text-white">Foreign Donations (FCRA)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {donationDetails.foreignDonation && Object.keys(donationDetails.foreignDonation).some(k => donationDetails.foreignDonation[k]) ? (
                  <div className="bg-blue-900/30 p-5 rounded-xl border border-blue-400/30">
                    <p className="text-blue-300 font-bold text-sm mb-4 uppercase tracking-wide">Foreign Bank Transfer (SWIFT)</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Bank Name', value: donationDetails.foreignDonation.bankName },
                        { label: 'Account Name', value: donationDetails.foreignDonation.accountName },
                        { label: 'Account Number', value: donationDetails.foreignDonation.accountNumber },
                        { label: 'SWIFT Code', value: donationDetails.foreignDonation.swiftCode },
                        { label: 'IFSC Code', value: donationDetails.foreignDonation.ifscCode },
                      ].filter(item => item.value).map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-sm text-blue-200">{item.label}:</span>
                          <button
                            onClick={() => copyToClipboard(item.value, `foreign-${item.label}`)}
                            className="font-semibold text-white text-sm hover:text-amber-400 transition-colors"
                            title="Click to copy"
                          >
                            {item.value}
                            {copied === `foreign-${item.label}` && <CheckCircle className="w-3 h-3 text-green-400 ml-1 inline" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 p-5 rounded-xl border border-white/15 text-center">
                    <Globe className="w-12 h-12 text-blue-400/40 mx-auto mb-3" />
                    <p className="text-blue-200 text-sm">Foreign donation details will be available soon.</p>
                    <p className="text-blue-300 text-sm mt-2">Please contact us directly for FCRA donations.</p>
                  </div>
                )}

                {/* Mobile App */}
                <div className="bg-white/5 p-5 rounded-xl border border-white/15 text-center">
                  <Smartphone className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                  <p className="text-white font-bold mb-2">Donate via Our Mobile App</p>
                  <p className="text-blue-200 text-xs mb-4">Download VSDHAM app for easy donations, scheme tracking, and updates</p>
                  <a
                    href={donationDetails.playStoreLink || 'https://play.google.com/store/apps/details?id=com.micm.vsdham'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-black hover:bg-gray-900 px-5 py-3 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">▶️</span>
                      <div className="text-left">
                        <div className="text-[10px] text-gray-400">GET IT ON</div>
                        <div className="font-bold text-white">Google Play</div>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Tax Benefits */}
                <div className="bg-green-900/20 p-4 rounded-xl border border-green-400/30">
                  <p className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Tax Benefits
                  </p>
                  <ul className="text-blue-200 text-xs space-y-1">
                    <li>• Donations eligible for 80G tax exemption</li>
                    <li>• Receipt provided for all donations</li>
                    <li>• Registered NGO under Maharashtra Trusts Act</li>
                    <li>• Registration No: E-19790</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transparency Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Our Commitment to Transparency</h3>
          <p className="text-blue-200 text-base max-w-2xl mx-auto mb-6">
            Every rupee donated is used exclusively for our social service activities. We publish annual reports and maintain complete financial transparency.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '20+', label: 'Years of Service' },
              { value: '₹100 Cr+', label: 'Animal Welfare Contribution' },
              { value: '2.30 Lakh+', label: 'Animals Saved' },
              { value: '5000+', label: 'Families Supported' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-[#fbbf24]">{stat.value}</p>
                <p className="text-xs text-blue-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-12 py-6 text-center text-blue-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. Registration No: E-19790</p>
      </div>
    </div>
  );
};

export default DonatePage;
