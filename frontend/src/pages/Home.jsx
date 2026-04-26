import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, HandHeart, Sparkles, GraduationCap, Calendar, MapPin, Clock, Mail, Phone, MapPinned, ChevronDown, ArrowRight, Play, Menu, X, Facebook, Youtube, Instagram } from 'lucide-react';
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

const HeroSlideshow = ({ heroData, navigate }) => {
  const slides = heroData.slides && heroData.slides.length > 0
    ? heroData.slides
    : [{ url: heroData.backgroundImage, type: 'image' }];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current] || {};
  const isVideo = slide.type === 'video' || slide.url?.includes('youtube') || slide.url?.includes('youtu.be');

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}?autoplay=1&mute=1&loop=1&controls=0`;
    if (url.includes('watch?v=')) return `https://www.youtube.com/embed/${url.split('watch?v=')[1]?.split('&')[0]}?autoplay=1&mute=1&loop=1&controls=0`;
    return url;
  };

  return (
    <section id="home" className="relative flex items-end overflow-hidden" style={{ height: heroData.height || '580px' }}>
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <iframe src={getEmbedUrl(slide.url)} className="w-full h-full" style={{ objectFit: 'cover' }} frameBorder="0" allow="autoplay" title="Hero Video" />
        ) : (
          <img src={slide.url || heroData.backgroundImage} alt="Hero" className="w-full h-full object-cover transition-opacity duration-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2244]/95 via-[#1a3a6b]/40 to-transparent"></div>
      </div>

      {slides.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50 w-2'}`} />
          ))}
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white text-xl transition-colors">‹</button>
          <button onClick={() => setCurrent(c => (c + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white text-xl transition-colors">›</button>
        </>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-12">
        <div className="max-w-4xl">
          <Badge className="mb-4 bg-[#d97706] text-white px-6 py-2 text-sm font-semibold border-0">{heroData.badge}</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            {heroData.title} <span className="text-[#fbbf24]">{heroData.highlightedWord}</span>
          </h2>
          <p className="text-base md:text-xl text-white/90 mb-6 max-w-2xl drop-shadow-md">{heroData.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[#1a3a6b] font-semibold px-6 py-4 text-base"
              onClick={() => document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Our Work <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" className="bg-[#d97706] hover:bg-[#b45309] text-white font-semibold px-6 py-4 text-base border-0"
              onClick={() => navigate('/donate')}>
              Donate Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState(null);
  const [modalType, setModalType] = useState('image');

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
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
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a3a6b] border-t-[#d97706] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
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

      {/* ============ HEADER ============ */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png"
                alt="Vardhaman Sanskar Dham"
                className="h-14 w-auto object-contain cursor-pointer"
                onClick={() => navigate('/')}
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6 items-center">
              <a href="#home" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium text-sm">Home</a>
              <a href="#activities" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium text-sm">Activities</a>
              <a href="#about" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium text-sm">About</a>
              <a href="#events" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium text-sm">Events</a>
              <a href="#gallery" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium text-sm">Gallery</a>

              {/* More dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium text-sm flex items-center gap-1">
                  More <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <a href="/tapovan" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b]">Tapovan Vidyalay</a>
                    <a href="/gurudev" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b]">Gurudev</a>
                    <a href="/media" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b]">Media & Videos</a>
                  </div>
                </div>
              </div>

              <a href="#contact" className="text-gray-700 hover:text-[#1a3a6b] transition-colors font-medium text-sm">Contact</a>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                className="hidden md:block bg-[#d97706] hover:bg-[#b45309] text-white font-semibold text-sm"
                onClick={() => navigate('/donate')}
              >
                Donate Now
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 mt-3 pt-3 pb-2 space-y-1">
              {[
                { href: '#home', label: 'Home' },
                { href: '#activities', label: 'Activities' },
                { href: '#about', label: 'About' },
                { href: '#events', label: 'Events' },
                { href: '#gallery', label: 'Gallery' },
                { href: '#contact', label: 'Contact' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b] rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
                <a href="/tapovan" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b] rounded-lg">Tapovan Vidyalay</a>
                <a href="/gurudev" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b] rounded-lg">Gurudev</a>
                <a href="/media" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-[#1a3a6b] rounded-lg">Media & Videos</a>
              </div>
              <div className="pt-2">
                <Button
                  className="w-full bg-[#d97706] hover:bg-[#b45309] text-white font-semibold"
                  onClick={() => { navigate('/donate'); setMobileMenuOpen(false); }}
                >
                  Donate Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ============ HERO SECTION — Slideshow ============ */}
      {heroData && <HeroSlideshow heroData={heroData} navigate={navigate} />}

      {/* ============ UPDATES SECTION - Horizontal Scroll ============ */}
      {updates && updates.length > 0 && (
        <section className="py-10 px-4 bg-amber-50 border-y border-amber-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <Badge className="mb-2 bg-amber-500 text-white text-xs px-3 py-1 border-0">Latest Updates</Badge>
                <h2 className="text-2xl font-bold text-gray-900">Recent News</h2>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {updates.map((update) => (
                <div
                  key={update._id}
                  className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md border border-amber-100 p-4 cursor-pointer hover:shadow-lg hover:border-amber-300 transition-all"
                  onClick={() => navigate(`/updates/${update._id}`)}
                >
                  {update.image && (
                    <img src={update.image} alt={update.title} className="w-full h-36 object-cover rounded-lg mb-3" />
                  )}
                  <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{update.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-3">{update.description}</p>
                  <span className="text-xs text-[#d97706] font-semibold mt-2 inline-block">Read More →</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ ACTIVITIES SECTION ============ */}
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
              const IconComponent = iconMap[activity.icon] || Heart;
              return (
                <Card
                  key={activity._id}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/activities/${activity.slug || activity._id}`)}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=VSD'; }}
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

          {activities.length > 0 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="border-[#1a3a6b] text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white"
                onClick={() => navigate('/activities')}
              >
                View All Activities <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ============ ABOUT SECTION ============ */}
      <section id="about" className="py-16 px-4 bg-[#1a3a6b] text-white">
        <div className="max-w-7xl mx-auto">
          {aboutData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <Badge className="mb-4 bg-[#d97706] text-white px-4 py-1 border-0">About Us</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{aboutData.title}</h2>
                <p className="text-blue-100 text-base leading-relaxed mb-6">{aboutData.description}</p>
                <div className="space-y-4">
                  {aboutData.mission && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <h4 className="text-[#fbbf24] font-bold mb-2">Our Mission</h4>
                      <p className="text-blue-100 text-sm">{aboutData.mission}</p>
                    </div>
                  )}
                  {aboutData.vision && (
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <h4 className="text-[#fbbf24] font-bold mb-2">Our Vision</h4>
                      <p className="text-blue-100 text-sm">{aboutData.vision}</p>
                    </div>
                  )}
                </div>
              </div>

              {aboutData.stats && (
                <div className="grid grid-cols-2 gap-4">
                  {aboutData.stats.map((stat, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-colors">
                      <p className="text-3xl md:text-4xl font-bold text-[#fbbf24] mb-2">{stat.value}</p>
                      <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============ EVENTS SECTION ============ */}
      <section id="events" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1 border-0">Upcoming</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Events</h2>
            <p className="text-lg text-gray-600">Join us in our upcoming events and programs</p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming events at this time. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event._id}
                  className="hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  {event.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
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
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
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
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Register
                          </a>
                        )}
                        {event.whatsappGroupLink && (
                          <a
                            href={event.whatsappGroupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-semibold transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="w-3 h-3" /> WhatsApp
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ GALLERY SECTION ============ */}
      <section id="gallery" className="py-16 px-4 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1 border-0">Memories</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
            <p className="text-lg text-gray-600 mb-6">Glimpses of our activities and events</p>

            <div className="flex justify-center gap-3 flex-wrap">
              {['all', 'bhakti', 'service', 'education', 'events'].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? 'bg-[#1a3a6b] text-white border-0' : 'text-gray-700'}
                  size="sm"
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No images in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {filteredImages.slice(0, 9).map((image) => (
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
                    <div className="relative w-full h-full bg-black">
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </div>
                      </div>
                      {image.url.includes('youtube') || image.url.includes('youtu.be') ? (
                        <img
                          src={`https://img.youtube.com/vi/${image.url.split('v=')[1]?.split('&')[0] || image.url.split('/').pop()}/hqdefault.jpg`}
                          alt={image.title}
                          className="w-full h-full object-cover"
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
                    <p className="text-white font-semibold text-sm p-3">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ DONATION SECTION ============ */}
      <section id="donation" className="py-16 px-4 bg-gradient-to-r from-[#0f2244] to-[#1a3a6b] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Support Our Mission</h2>
            <p className="text-lg text-blue-100">Your generous contribution helps us continue our work</p>
          </div>

          {donationInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bank Details */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    <span className="bg-[#d97706] text-white px-3 py-1 rounded text-base font-bold">Online Payment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                    <p className="text-sm text-[#fbbf24] mb-3 font-bold">NEFT / RTGS DETAILS</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Bank Name', value: donationInfo.bankName },
                        { label: 'Account Name', value: donationInfo.accountName },
                        { label: 'A/C', value: donationInfo.accountNumber },
                        { label: 'IFSC Code', value: donationInfo.ifscCode },
                        { label: 'Branch', value: donationInfo.branch },
                      ].filter(item => item.value).map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <span className="text-sm text-blue-200">{item.label}:</span>
                          <span className="font-semibold text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {donationInfo.receiptContact && (
                    <div className="bg-white/5 p-4 rounded-lg border border-white/20 text-center">
                      <p className="text-sm text-[#fbbf24] mb-2 font-bold">For Receipt Contact</p>
                      <p className="text-2xl font-bold">{donationInfo.receiptContact}</p>
                    </div>
                  )}

                  <div className="text-center mt-2">
                    <p className="text-xs text-blue-200 mb-2">DOWNLOAD OUR APP VSDHAM</p>
                    <a
                      href={donationInfo.playStoreLink || 'https://play.google.com/store/apps/details?id=com.micm.vsdham'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-black hover:bg-gray-900 px-4 py-2 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">▶️</span>
                        <div className="text-left">
                          <div className="text-[10px] text-gray-400">GET IT ON</div>
                          <div className="font-bold text-white text-sm">Google Play</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white flex flex-col items-center justify-center p-8">
                <div className="text-center mb-6">
                  <p className="text-2xl font-bold mb-4">SCAN QR CODE</p>
                  <Button
                    className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-4 text-lg border-0"
                    onClick={() => navigate('/donate')}
                  >
                    DONATE NOW
                  </Button>
                </div>

                {donationInfo.qrCodeImage && (
                  <div className="bg-white p-4 rounded-lg mb-6">
                    <img
                      src={donationInfo.qrCodeImage}
                      alt="QR Code for Donation"
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                )}

                {donationInfo.upiId && (
                  <div className="text-center">
                    <p className="text-base font-bold mb-2">UPI ID to Donate:</p>
                    <p className="text-2xl font-bold text-[#fbbf24]">{donationInfo.upiId}</p>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* ============ CONTACT SECTION ============ */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1 border-0">Get in Touch</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {contactData?.phone && (
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">Phone</h3>
                      <a href={`tel:${contactData.phone}`} className="text-blue-600 hover:underline">{contactData.phone}</a>
                      {contactData.name && <p className="text-sm text-gray-500 mt-1">Contact: {contactData.name}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {contactData?.email && (
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">Email</h3>
                      <a href={`mailto:${contactData.email}`} className="text-blue-600 hover:underline">{contactData.email}</a>
                    </div>
                  </CardContent>
                </Card>
              )}

              {contactData?.address && (
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
              )}

              {contactData?.timing && (
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
              )}
            </div>

            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form and we'll get back to you shortly</CardDescription>
              </CardHeader>
              <CardContent>
                {submitMessage && (
                  <div className={`mb-4 p-4 rounded-lg text-sm ${submitMessage.includes('Thank you') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {submitMessage}
                  </div>
                )}
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {[
                    { label: 'Name', type: 'text', key: 'name', placeholder: 'Your full name' },
                    { label: 'Email', type: 'email', key: 'email', placeholder: 'your@email.com' },
                    { label: 'Phone', type: 'tel', key: 'phone', placeholder: '+91 ' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        value={contactForm[field.key]}
                        onChange={(e) => setContactForm({ ...contactForm, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                        placeholder={field.placeholder}
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows="4"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                      placeholder="Your message..."
                      required
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1a3a6b] hover:bg-[#0f2244] text-white font-semibold py-6 text-base"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Org Info */}
            <div>
              <img
                src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png"
                alt="Vardhaman Sanskar Dham"
                className="h-14 w-auto object-contain"
              />
              <p className="text-gray-400 text-sm leading-relaxed">
                Inspired by P.P.P. Chandrashekharvijaiyji M.S., we are dedicated to serving humanity through spiritual, educational, and social initiatives.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { href: '#home', label: 'Home' },
                  { href: '#activities', label: 'Activities' },
                  { href: '#events', label: 'Events' },
                  { href: '#gallery', label: 'Gallery' },
                  { href: '/donate', label: 'Donate' },
                  { href: '/gurudev', label: 'Gurudev' },
                  { href: '/media', label: 'Media' },
                ].map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-gray-400 hover:text-[#d97706] transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Contact</h4>
              {contactData && (
                <div className="space-y-2 text-sm text-gray-400">
                  {contactData.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#d97706]" />
                      {contactData.phone}
                    </p>
                  )}
                  {contactData.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#d97706]" />
                      {contactData.email}
                    </p>
                  )}
                  {contactData.address && (
                    <p className="flex items-start gap-2">
                      <MapPinned className="w-4 h-4 text-[#d97706] mt-0.5 flex-shrink-0" />
                      {contactData.address}
                    </p>
                  )}
                </div>
              )}

              {/* Social links */}
              <div className="flex gap-3 mt-4">
                <a href="https://www.instagram.com/vardhmansanskardham.dombivli/" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#d97706] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com/@vardhamansanskardham/videos" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#d97706] transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700 mb-6" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. All rights reserved.</p>
            <p>Registration No: E-19790 | Mumbai, Maharashtra</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
