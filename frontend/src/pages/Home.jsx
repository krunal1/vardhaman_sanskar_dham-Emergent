import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, HandHeart, Sparkles, GraduationCap, Calendar, MapPin, Clock, Mail, Phone, MapPinned, ChevronDown, ArrowRight, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import MediaModal from '../components/MediaModal';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const iconMap = {
  Heart: Heart,
  HandHeart: HandHeart,
  Sparkles: Sparkles,
  GraduationCap: GraduationCap
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activities, setActivities] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [contactData, setContactData] = useState(null);
  const [donationInfo, setDonationInfo] = useState(null);
  const [heroData, setHeroData] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);
  const [modalType, setModalType] = useState('image');
  
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
      const [activitiesRes, aboutRes, eventsRes, updatesRes, galleryRes, contactRes, donationRes, heroRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/activities`),
        axios.get(`${BACKEND_URL}/api/about`),
        axios.get(`${BACKEND_URL}/api/events`),
        axios.get(`${BACKEND_URL}/api/updates`),
        axios.get(`${BACKEND_URL}/api/gallery`),
        axios.get(`${BACKEND_URL}/api/contact`),
        axios.get(`${BACKEND_URL}/api/donation`),
        axios.get(`${BACKEND_URL}/api/hero`)
      ]);

      setActivities(activitiesRes.data || []);
      setAboutData(aboutRes.data);
      setEvents(eventsRes.data || []);
      setUpdates(updatesRes.data || []);
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
      <MediaModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        media={modalMedia} 
        type={modalType} 
      />
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
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#home" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Home</a>
              <a href="#activities" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Activities</a>
              <a href="#about" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">About</a>
              <a href="#events" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Events</a>
              <a href="#gallery" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Gallery</a>
              
              {/* More dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium flex items-center gap-1">
                  More
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <a href="/tapovan" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b] transition-colors">
                      Tapovan Vidyalay
                    </a>
                    <a href="/tapovan" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b] transition-colors">
                      Tapovan Sanskardham
                    </a>
                    <a href="/gurudev" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b] transition-colors">
                      Gurudev
                    </a>
                    <a href="/media" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b] transition-colors">
                      Media & Videos
                    </a>
                  </div>
                </div>
              </div>
              
              <a href="#contact" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium">Contact</a>
            </nav>
            <Button 
              className="hidden md:block bg-[#d97706] hover:bg-[#b45309] text-white font-semibold"
              onClick={() => navigate('/donate')}
            >
              Donate Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {heroData && (
        <section id="home" className="relative flex items-end overflow-hidden" style={{ height: heroData.height || '500px' }}>
          <div className="absolute inset-0 z-0">
            <img 
              src={heroData.backgroundImage} 
              alt="Hero Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/90 via-[#1a3a6b]/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <Badge className="mb-4 bg-[#d97706] text-white px-6 py-2 text-sm font-semibold border-0">
                {heroData.badge}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {heroData.title} <span className="text-[#fbbf24]">{heroData.highlightedWord}</span>
              </h2>
              <p className="text-lg md:text-xl text-white mb-6 max-w-2xl drop-shadow-md">
                {heroData.subtitle}
              </p>
              <div>
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
          </div>

          <div className="absolute bottom-8 right-8 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white" />
          </div>
        </section>
      )}

      {/* Updates Section - Horizontal Scroll */}
      <section className="py-12 px-4 bg-gradient-to-r from-amber-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Badge className="mb-3 bg-amber-500 text-white text-sm px-4 py-1">Latest Updates</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Recent Updates</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {updates.map((update) => (
              <Card 
                key={update.id} 
                className="min-w-[320px] hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/updates/${update.id}`)}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{update.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{update.description}</p>
                  <p className="text-xs text-gray-500 font-semibold">{update.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activities.map((activity) => {
              const IconComponent = iconMap[activity.icon];
              return (
                <Card 
                  key={activity._id} 
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/activities/${activity.slug || activity.id}`)}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/80 to-transparent"></div>
                    <div className="absolute bottom-2 left-2">
                      <div className="w-8 h-8 bg-[#d97706] rounded-full flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{activity.title}</h3>
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

      {/* Events Section - Recent & Upcoming */}
      <section id="events" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 px-4 py-1 border-0">Events</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent & Upcoming Events</h2>
            <p className="text-lg text-gray-600">
              Stay updated with our latest activities and upcoming programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card 
                key={event._id} 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {event.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={event.status === 'upcoming' ? 'bg-green-500' : 'bg-blue-500'}>
                        {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{event.description}</p>
                  
                  {event.status === 'upcoming' && (event.googleFormLink || event.whatsappGroupLink) && (
                    <div className="flex gap-2 pt-2 border-t">
                      {event.googleFormLink && (
                        <a 
                          href={event.googleFormLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <span className="text-sm font-semibold">Register</span>
                        </a>
                      )}
                      {event.whatsappGroupLink && (
                        <a 
                          href={event.whatsappGroupLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm font-semibold">WhatsApp</span>
                        </a>
                      )}
                    </div>
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
              <div 
                key={image._id} 
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 aspect-[4/3] cursor-pointer"
                onClick={() => {
                  setModalMedia(image.url);
                  setModalType(image.type || 'image');
                  setModalOpen(true);
                }}
              >
                {image.type === 'video' ? (
                  <div className="relative w-full h-full bg-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-14 h-14 bg-[#d97706]/90 rounded-full flex items-center justify-center shadow-xl">
                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                      </div>
                    </div>
                    {image.url.includes('youtube') || image.url.includes('youtu.be') ? (
                      <img
                        src={`https://img.youtube.com/vi/${image.url.split('v=')[1]?.split('&')[0] || image.url.split('/').pop()}/hqdefault.jpg`}
                        alt={image.title}
                        className="w-full h-full object-cover opacity-70"
                      />
                    ) : (
                      <video
                        src={image.url}
                        className="w-full h-full object-cover opacity-70"
                        preload="metadata"
                        muted
                        playsInline
                      />
                    )}
                  </div>
                ) : (
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image'; }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white font-semibold text-base p-3">{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donation" className="py-16 px-4 bg-gradient-to-r from-[#0f2244] to-[#1a3a6b] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Support Our Mission</h2>
            <p className="text-lg text-blue-100">
              Your generous contribution helps us continue our work
            </p>
          </div>
          
          {donationInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Bank Details */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <span className="bg-[#d97706] text-white px-3 py-1 rounded text-base font-bold">Online Payment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-sm text-[#fbbf24] mb-3 font-bold">NEFT / RTGS DETAILS</p>
                    <p className="text-xs text-blue-200 mb-1">Before Making Payment Please check Name as</p>
                    
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-200">Bank Name:</span>
                        <span className="font-semibold">{donationInfo.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-200">Account Name:</span>
                        <span className="font-semibold">{donationInfo.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-200">A/C:</span>
                        <span className="font-semibold">{donationInfo.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-200">IFSC Code:</span>
                        <span className="font-semibold">{donationInfo.ifscCode}</span>
                      </div>
                      {donationInfo.branch && (
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-200">Branch:</span>
                          <span className="font-semibold">{donationInfo.branch}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {donationInfo.receiptContact && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                      <p className="text-sm text-[#fbbf24] mb-2 font-bold">For Receipt Contact</p>
                      <p className="text-xs text-blue-200 mb-2">Contact our Karyakarta on {donationInfo.receiptContactType}</p>
                      <p className="text-2xl font-bold text-center text-white">{donationInfo.receiptContact}</p>
                    </div>
                  )}

                  <div className="text-center mt-4">
                    <p className="text-xs text-blue-200 mb-2">DOWNLOAD OUR APP VSDHAM</p>
                    <div className="flex justify-center">
                      <a 
                        href="https://play.google.com/store/apps/details?id=com.micm.vsdham" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <div className="bg-black px-4 py-2 rounded hover:bg-gray-800 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">▶️</span>
                            <div className="text-left">
                              <div className="text-[10px] text-gray-400">GET IT ON</div>
                              <div className="font-bold text-white">Google Play</div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Side - QR Code */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white flex flex-col items-center justify-center p-8">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold mb-2">SCAN QR CODE</p>
                  <Button className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-6 text-xl border-0">
                    DONATE NOW
                  </Button>
                </div>
                
                {donationInfo.qrCodeImage && (
                  <div className="bg-white p-4 rounded-lg mb-6">
                    <img 
                      src={donationInfo.qrCodeImage} 
                      alt="QR Code for Donation" 
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-xl font-bold mb-2">UPI ID to Donate:</p>
                  <p className="text-3xl font-bold text-[#fbbf24] mb-2">{donationInfo.upiId}</p>
                </div>
              </Card>
            </div>
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
      {/* ============ WHATSAPP FLOATING BUTTON ============ */}
      <a
        href="https://wa.me/918080102012?text=Namaste%2C%20I%20would%20like%20to%20know%20more%20about%20Vardhaman%20Sanskar%20Dham"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105 group"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Chat with us
        </span>
      </a>

    </div>
  );
};

export default Home;
