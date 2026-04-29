import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry"];

const DonatePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [step, setStep] = useState(1); // 1=categories, 2=donor form, 3=success
  const [donor, setDonor] = useState({ name: '', phone: '', email: '', pan: '', address1: '', address2: '', country: 'India', state: 'Maharashtra', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/donation-categories`)
      .then(res => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const grandTotal = Object.values(amounts).reduce((sum, v) => sum + (parseInt(v) || 0), 0);

  const handleProceed = () => {
    if (grandTotal <= 0) { alert('Please enter at least one donation amount.'); return; }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const loadRazorpay = () => new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!donor.name || !donor.phone || !donor.email) { alert('Please fill all required fields.'); return; }
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { alert('Failed to load payment gateway. Please try again.'); setLoading(false); return; }

      const donationsMap = {};
      categories.forEach(cat => {
        if (amounts[cat._id] && parseInt(amounts[cat._id]) > 0) {
          donationsMap[cat.nameHindi || cat.name] = parseInt(amounts[cat._id]);
        }
      });

      const { data: order } = await axios.post(`${BACKEND_URL}/api/razorpay/create-order`, {
        amount: grandTotal * 100,
        currency: 'INR',
        donations: donationsMap,
        donor
      });

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Vardhaman Sanskar Dham',
        description: 'Donation',
        image: 'https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png',
        order_id: order.order_id,
        prefill: { name: donor.name, email: donor.email, contact: donor.phone },
        notes: { address: donor.address1 },
        theme: { color: '#1a3a6b' },
        handler: async (response) => {
          try {
            await axios.post(`${BACKEND_URL}/api/razorpay/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            setPaymentSuccess(response.razorpay_payment_id);
            setStep(3);
            window.scrollTo(0, 0);
          } catch {
            alert('Payment verification failed. Please contact us with your payment ID: ' + response.razorpay_payment_id);
          }
        },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Error creating order: ' + (err.response?.data?.detail || err.message));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <img src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png" alt="VSD" className="h-14 w-auto" />
           {/* <span className="font-bold text-[#1a3a6b] text-lg hidden sm:block">Vardhman Sanskar Dham</span> */}
          </button>
          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-[#1a3a6b] font-medium text-sm px-4 py-2">HOME</button>
            {/*<button className="bg-[#1a3a6b] text-white font-bold text-sm px-5 py-2 rounded">DONATION</button>*/}
          </div>
        </div>
      </header>

      {/* Step 3 — Success */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🙏</div>
          <h2 className="text-3xl font-bold text-green-600 mb-3">Thank You, {donor.name}!</h2>
          <p className="text-gray-600 mb-2">Your donation of <strong>₹{grandTotal.toLocaleString()}</strong> has been received.</p>
          <p className="text-sm text-gray-500 mb-6">Payment ID: <code className="bg-gray-100 px-2 py-1 rounded">{paymentSuccess}</code></p>
          <p className="text-gray-600 mb-8">A receipt will be sent to <strong>{donor.email}</strong>. For 80G certificate, contact us at <strong>vsddomb@gmail.com</strong></p>
          <button onClick={() => navigate('/')} className="bg-[#1a3a6b] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0f2244] transition-colors">Back to Home</button>
        </div>
      )}

      {/* Step 1 — Category amounts */}
      {step === 1 && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#1a3a6b]">Donation To <span className="text-[#d97706] underline decoration-[#d97706]">V.S. Dham</span></h1>
            <p className="text-gray-500 mt-3 italic">Inspired by <strong>P. Pu. P Shree Chandrashekhar VijayJi</strong></p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Other Donation <span className="text-[#d97706]">Categories</span></h2>
            <hr className="border-[#1a3a6b] border-2 w-16 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat._id}>
                  <label className="block text-gray-700 font-medium mb-2">{cat.nameHindi || cat.name}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={amounts[cat._id] || ''}
                      onChange={e => setAmounts({ ...amounts, [cat._id]: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total box */}
          <div className="flex justify-end">
            <div className="bg-white rounded-xl shadow-sm p-6 w-full sm:w-80">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Total Donate <span className="text-[#d97706]">Amount</span></h3>
              <div className="flex justify-between items-center py-3 border-t border-b my-3">
                <span className="font-bold text-gray-700">Grand Total</span>
                <span className="font-bold text-gray-900 text-lg">₹{grandTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handleProceed}
                disabled={grandTotal <= 0}
                className="w-full bg-[#1a3a6b] hover:bg-[#0f2244] disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Donor details + payment */}
      {step === 2 && (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <button onClick={() => setStep(1)} className="text-[#1a3a6b] hover:underline text-sm mb-6 flex items-center gap-1">← Back to Donation</button>

          <form onSubmit={handlePayment}>
            {/* Donor Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Donation Details</h2>
              <hr className="border-[#1a3a6b] border-2 w-16 mb-6" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name (First - Middle - Last)', required: true, full: true },
                  { key: 'phone', label: 'Phone', required: true, type: 'tel' },
                  { key: 'email', label: 'Email', required: true, type: 'email' },
                  { key: 'pan', label: 'PAN No (for 80G receipt)' },
                  { key: 'address1', label: 'House number and street name', full: true },
                  { key: 'address2', label: 'Apartment, suite, unit, etc.', full: true },
                  { key: 'city', label: 'Town / City' },
                  { key: 'pincode', label: 'Postcode / ZIP' },
                ].map(field => (
                  <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                    <input
                      type={field.type || 'text'}
                      placeholder={field.label}
                      required={field.required}
                      value={donor[field.key]}
                      onChange={e => setDonor({ ...donor, [field.key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-700 placeholder-gray-400"
                    />
                  </div>
                ))}

                <div>
                  <select value={donor.country} onChange={e => setDonor({ ...donor, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-700">
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <select value={donor.state} onChange={e => setDonor({ ...donor, state: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1a3a6b] text-gray-700">
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Donation Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Donation Amount</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-bold text-gray-700">Donation</th>
                    <th className="text-right py-2 font-bold text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.filter(cat => parseInt(amounts[cat._id]) > 0).map(cat => (
                    <tr key={cat._id} className="border-b">
                      <td className="py-2 font-medium text-gray-700">{cat.nameHindi || cat.name}</td>
                      <td className="py-2 text-right text-gray-700">Rs. {parseInt(amounts[cat._id]).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-3 font-bold text-gray-900">Grand Total</td>
                    <td className="py-3 text-right font-bold text-gray-900">Rs. {grandTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <input type="radio" checked readOnly className="w-4 h-4 text-[#1a3a6b]" />
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1a3a6b]">Credit Card/Debit Card/NetBanking</span>
                  <img src="https://razorpay.com/favicon.ico" alt="Razorpay" className="w-5 h-5" />
                  <span className="text-sm text-gray-500">Pay by Razorpay — Cards, Netbanking, Wallet & UPI</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Pay securely by Credit or Debit card or Internet Banking through Razorpay.</p>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#d97706] hover:bg-[#b45309] disabled:bg-gray-300 text-white font-bold px-8 py-3 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : 'Donate Us'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
         {/* <img src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png" alt="VSD" className="h-14 mx-auto mb-3" /> */}
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DonatePage;
