import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin, Phone } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/events/${id}`);
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Badge className={event.status === 'upcoming' ? 'bg-green-500 text-lg px-4 py-2' : 'bg-blue-500 text-lg px-4 py-2'}>
            {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>

        {event.image ? (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-96 object-cover"
            />
          </div>
        ) : (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center h-96">
            <p className="text-gray-500">No image available</p>
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {event.status === 'upcoming' && (
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Register for This Event</h2>
              {(event.googleFormLink || event.whatsappGroupLink) ? (
                <div className="flex gap-4 flex-wrap">
                  {event.googleFormLink && (
                    <a 
                      href={event.googleFormLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        Register via Google Form
                      </Button>
                    </a>
                  )}
                  {event.whatsappGroupLink && (
                    <a 
                      href={event.whatsappGroupLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-green-500 hover:bg-green-600">
                        <Phone className="w-4 h-4 mr-2" />
                        Join WhatsApp Group
                      </Button>
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-gray-600 bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
                  <p>Registration links will be available soon. Please check back later.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
