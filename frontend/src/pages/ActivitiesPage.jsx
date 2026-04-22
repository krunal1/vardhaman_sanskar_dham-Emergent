import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Heart } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ActivitiesPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/activities`);
      setActivities(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
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
            <div className="flex gap-2">
              <Button onClick={() => window.location.href = '/'} variant="outline" className="text-white border-white/30 hover:bg-white/10">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1a3a6b] to-transparent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30 mb-4">Our Work</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            All Our <span className="text-amber-400">Activities</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover the various ways we serve our community and spread compassion
          </p>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <Card 
              key={activity.id} 
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => navigate(`/activities/${activity.slug || activity.id}`)}
            >
              {activity.image && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={activity.image} 
                    alt={activity.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b] to-transparent opacity-60"></div>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {activity.title}
                  </h3>
                  <Heart className="w-5 h-5 text-amber-400 flex-shrink-0 ml-2" />
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {activity.description}
                </p>
                {activity.stats && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activity.stats.map((stat, index) => (
                      <Badge key={index} className="bg-amber-500/20 text-amber-400 border-amber-400/30 text-xs">
                        {stat}
                      </Badge>
                    ))}
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 group/btn"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;
