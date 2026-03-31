import React, { useState } from 'react';
import { Heart, HandHeart, Sparkles, GraduationCap, Calendar, MapPin, Clock, Mail, Phone, MapPinned, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { activities, aboutData, events, galleryImages, contactData, donationInfo } from '../mock';

const iconMap = {
  Heart: Heart,
  HandHeart: HandHeart,
  Sparkles: Sparkles,
  GraduationCap: GraduationCap
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

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
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
              <a href="#activities" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Activities</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#events" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Events</a>
              <a href="#gallery" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Gallery</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </nav>
            <Button className="hidden md:block bg-amber-500 hover:bg-amber-600 text-white font-semibold">
              Donate Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/33610944/pexels-photo-33610944.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" 
            alt="Temple" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <Badge className="mb-6 bg-amber-500 text-white px-6 py-2 text-sm font-semibold">
            Serving Since 2009
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Building a Compassionate <span className="text-amber-400">Society</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us in our mission to spread spiritual values, cultural heritage, and serve humanity through compassion and dedication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-6 text-lg">
              Join Our Mission
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-6 text-lg">
              Learn More
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1">Our Work</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Activities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the various ways we serve our community and promote spiritual growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((activity) => {
              const IconComponent = iconMap[activity.icon];
              return (
                <Card key={activity.id} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold">{activity.title}</h3>
                      </div>
                      <p className="text-blue-100 font-medium">{activity.subtitle}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 leading-relaxed">{activity.description}</p>
                    <Button variant="link" className="mt-4 text-blue-600 p-0 font-semibold">
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1">About Us</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{aboutData.title}</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{aboutData.description}</p>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Our Mission</h3>
                  <p className="text-gray-700">{aboutData.mission}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
                  <h3 className="text-xl font-bold text-amber-700 mb-2">Our Vision</h3>
                  <p className="text-gray-700">{aboutData.vision}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {aboutData.stats.map((stat, index) => (
                <Card key={index} className="text-center p-8 bg-white hover:shadow-xl transition-shadow border-2 hover:border-blue-200">
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800 px-4 py-1">What's Happening</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join us in our upcoming programs and be part of our mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.id} className={`hover:shadow-xl transition-shadow border-2 ${event.status === 'upcoming' ? 'border-blue-200' : 'border-gray-200 opacity-75'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={event.status === 'upcoming' ? 'bg-green-500' : 'bg-gray-400'}>
                      {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 text-blue-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  {event.status === 'upcoming' && (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
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
      <section id="gallery" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-1">Memories</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
            <p className="text-xl text-gray-600 mb-8">Glimpses of our activities and events</p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-blue-600' : ''}
              >
                All
              </Button>
              <Button 
                variant={selectedCategory === 'bhakti' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('bhakti')}
                className={selectedCategory === 'bhakti' ? 'bg-blue-600' : ''}
              >
                Spiritual
              </Button>
              <Button 
                variant={selectedCategory === 'service' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('service')}
                className={selectedCategory === 'service' ? 'bg-blue-600' : ''}
              >
                Service
              </Button>
              <Button 
                variant={selectedCategory === 'education' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('education')}
                className={selectedCategory === 'education' ? 'bg-blue-600' : ''}
              >
                Education
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 aspect-[4/3]">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white font-semibold text-lg p-4">{image.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Support Our Mission</h2>
          <p className="text-xl mb-12 text-blue-100">
            Your generous contribution helps us continue our social and spiritual work in the community
          </p>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Donation Details</CardTitle>
              <CardDescription className="text-blue-100">You can contribute through bank transfer or UPI</CardDescription>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <div>
                <p className="text-sm text-blue-200 mb-1">Bank Name</p>
                <p className="font-semibold text-lg">{donationInfo.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-blue-200 mb-1">Account Name</p>
                <p className="font-semibold text-lg">{donationInfo.accountName}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-6 text-lg mt-6">
                Donate Now
              </Button>
            </CardContent>
          </Card>
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
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="+91 "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <img 
                  src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png" 
                  alt="Vardhaman Sanskar Dham"
                  className="h-12 w-auto object-contain mb-4"
                />
              </div>
              <p className="text-gray-400">
                We are dedicated to work towards the betterment of the society. Serving the community with compassion, spiritual values, and cultural heritage for over two decades.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#activities" className="hover:text-white transition-colors">Activities</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
              <p className="text-gray-400 mb-2">{contactData.phone}</p>
              <p className="text-gray-400 mb-4">{contactData.email}</p>
              <p className="text-gray-400 text-sm">{contactData.address}</p>
            </div>
          </div>
          
          <Separator className="bg-gray-700 mb-8" />
          
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
