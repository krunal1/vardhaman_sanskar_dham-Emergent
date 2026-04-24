import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, ArrowLeft, Heart } from 'lucide-react';

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
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a3a6b] to-[#0f2244]">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-[#d97706] rounded-full animate-spin mx-auto mb-3"></div>
          <p>Loading activities...</p>
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
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
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

      {/* Hero */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30 mb-4 border">Our Work</Badge>
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
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No activities found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <Card
                key={activity._id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group overflow-hidden hover:shadow-2xl hover:-translate-y-1"
                onClick={() => navigate(`/activities/${activity.slug || activity._id}`)}
              >
                {activity.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b] to-transparent opacity-60"></div>
                    {activity.category && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#d97706] text-white border-0 text-xs">{activity.category}</Badge>
                      </div>
                    )}
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                      {activity.title}
                    </h3>
                    <Heart className="w-5 h-5 text-amber-400 flex-shrink-0 ml-2 mt-1" />
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {activity.description}
                  </p>
                  {activity.stats && activity.stats.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activity.stats.slice(0, 2).map((stat, index) => (
                        <Badge key={index} className="bg-amber-500/20 text-amber-400 border-amber-400/30 text-xs border">
                          {stat}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full text-amber-400 hover:text-white hover:bg-amber-500/20 group/btn mt-1"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-6 text-center text-blue-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ActivitiesPage;
