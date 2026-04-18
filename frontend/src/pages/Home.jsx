import React, { useState, useEffect } from 'react';
import { Heart, HandHeart, Sparkles, GraduationCap, Calendar, MapPin, Clock, Mail, Phone, MapPinned, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const iconMap = {
  Heart: Heart,
  HandHeart: HandHeart,
  Sparkles: Sparkles,
  GraduationCap: GraduationCap
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activities, setActivities] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [contactData, setContactData] = useState(null);
  const [donationInfo, setDonationInfo] = useState(null);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [activitiesRes, aboutRes, eventsRes, galleryRes, contactRes, donationRes, heroRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/activities`),
        axios.get(`${BACKEND_URL}/api/about`),
        axios.get(`${BACKEND_URL}/api/events`),
        axios.get(`${BACKEND_URL}/api/gallery`),
        axios.get(`${BACKEND_URL}/api/contact`),
        axios.get(`${BACKEND_URL}/api/donation`),
        axios.get(`${BACKEND_URL}/api/hero`)
      ]);

      setActivities(activitiesRes.data || []);
      setAboutData(aboutRes.data);
      setEvents(eventsRes.data || []);
      setGalleryImages(galleryRes.data || []);
      setContactData(contactRes.data);
      setDonationInfo(donationRes.data);
      setHeroData(heroRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');
    
    try {
      await axios.post(`${BACKEND_URL}/api/contact/message`, contactForm);
      setSubmitMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png" 
                alt="Vardhaman Sanskar Dham"
                className="h-16 w-auto object-contain"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Home</a>
              <a href="#activities" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Activities</a>
              <a href="#about" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">About</a>
              <a href="#events" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Events</a>
              <a href="#gallery" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Gallery</a>
              <a href="#contact" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Contact</a>
            </nav>
            <Button className="hidden md:block bg-[#d97706] hover:bg-[#b45309] text-white font-semibold">
              Donate Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {heroData && (
        <section id="home" className="relative flex items-center justify-center overflow-hidden" style={{ height: heroData.height || '500px' }}>
          <div className="absolute inset-0 z-0">
            <img 
              src={heroData.backgroundImage} 
              alt="Hero Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f2244]/60 to-[#1a3a6b]/50"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <Badge className="mb-6 bg-[#d97706] text-white px-6 py-2 text-sm font-semibold border-0">
              {heroData.badge}
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {heroData.title} <span className="text-[#fbbf24]">{heroData.highlightedWord}</span>
            </h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
              {heroData.subtitle}
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[#1a3a6b] font-semibold px-8 py-6 text-lg"
                onClick={() => {
                  document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {heroData.button2Text || 'Learn More'}
              </Button>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white" />
          </div>
        </section>
      )}

      {/* Activities Section */}
      <section id="activities" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1 border-0">Our Work</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Activities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the various ways we serve our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity) => {
              const IconComponent = iconMap[activity.icon];
              return (
                <Card key={activity._id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-10 h-10 bg-[#d97706] rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold">{activity.title}</h3>
                      </div>
                      <p className="text-blue-100 text-sm font-medium">{activity.subtitle}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-gray-600 leading-relaxed text-sm">{activity.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-[#1a3a6b] text-white">
        <div className="max-w-7xl mx-auto">
          {aboutData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <Badge className="mb-4 bg-[#d97706] text-white px-4 py-1 border-0">About Us</Badge>
                <h2 className="text-4xl font-bold mb-4">{aboutData.title}</h2>
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">{aboutData.description}</p>
                
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-[#d97706]">
                    <h3 className="text-lg font-bold text-[#fbbf24] mb-2">Our Mission</h3>
                    <p className="text-blue-100 text-sm">{aboutData.mission}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border-l-4 border-[#fbbf24]">
                    <h3 className="text-lg font-bold text-[#fbbf24] mb-2">Our Vision</h3>
                    <p className="text-blue-100 text-sm">{aboutData.vision}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {aboutData.stats.map((stat, index) => (
                  <Card key={index} className="text-center p-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
                    <CardContent className="p-0">
                      <div className="text-4xl font-bold text-[#fbbf24] mb-2">{stat.value}</div>
                      <div className="text-blue-100 font-medium text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-100 text-amber-800 px-4 py-1 border-0">What's Happening</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us in our upcoming programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event._id} className={`hover:shadow-xl transition-shadow border-2 ${event.status === 'upcoming' ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 opacity-75'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={event.status === 'upcoming' ? 'bg-green-500 border-0' : 'bg-gray-400 border-0'}>
                      {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-[#1a3a6b]" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-[#1a3a6b]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-[#1a3a6b] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  {event.status === 'upcoming' && (
                    <Button className="w-full bg-[#1a3a6b] hover:bg-[#0f2244] text-white font-semibold">
                      Register Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 px-4 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1 border-0">Memories</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
            <p className="text-lg text-gray-600 mb-6">Glimpses of our activities and events</p>
            
            <div className="flex justify-center gap-3 flex-wrap">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-[#1a3a6b]' : ''}
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={selectedCategory === 'bhakti' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('bhakti')}
                className={selectedCategory === 'bhakti' ? 'bg-[#1a3a6b]' : ''}
                size="sm"
              >
                Spiritual
              </Button>
              <Button 
                variant={selectedCategory === 'service' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('service')}
                className={selectedCategory === 'service' ? 'bg-[#1a3a6b]' : ''}
                size="sm"
              >
                Service
              </Button>
              <Button 
                variant={selectedCategory === 'education' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('education')}
                className={selectedCategory === 'education' ? 'bg-[#1a3a6b]' : ''}
                size="sm"
              >
                Education
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredImages.slice(0, 6).map((image) => (
              <div key={image._id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 aspect-[4/3]">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white font-semibold text-base p-3">{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0f2244] to-[#1a3a6b] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Support Our Mission</h2>
          <p className="text-lg mb-10 text-blue-100">
            Your generous contribution helps us continue our work
          </p>
          
          {donationInfo && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Donation Details</CardTitle>
                <CardDescription className="text-blue-100">Contribute via bank transfer or UPI</CardDescription>
              </CardHeader>
              <CardContent className="text-left space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-200 mb-1">Bank</p>
                    <p className="font-semibold">{donationInfo.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200 mb-1">Account Name</p>
                    <p className="font-semibold">{donationInfo.accountName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200 mb-1">Account Number</p>
                    <p className="font-semibold">{donationInfo.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200 mb-1">IFSC Code</p>
                    <p className="font-semibold">{donationInfo.ifscCode}</p>
                  </div>
                </div>
                <Separator className="bg-white/20" />
                <div>
                  <p className="text-sm text-blue-200 mb-1">UPI ID</p>
                  <p className="font-semibold text-lg">{donationInfo.upiId}</p>
                </div>
                <Button className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold py-5 text-lg mt-4 border-0">
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1">Get in Touch</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">{contactData.phone}</p>
                    <p className="text-sm text-gray-500 mt-1">Contact: {contactData.name}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">{contactData.email}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPinned className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">{contactData.address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Visiting Hours</h3>
                    <p className="text-gray-600">{contactData.timing}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form and we'll get back to you shortly</CardDescription>
              </CardHeader>
              <CardContent>
                {submitMessage && (
                  <div className={`mb-4 p-4 rounded-lg ${submitMessage.includes('Thank you') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {submitMessage}
                  </div>
                )}
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      type="text" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="+91 "
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      rows="4"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Your message..."
                      required
                    ></textarea>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
