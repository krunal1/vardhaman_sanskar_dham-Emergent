import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Heart, Play } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ActivityDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityDetail();
  }, [slug]);

  const fetchActivityDetail = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/activities/${slug}`);
      setActivity(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity detail:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#1a3a6b] text-white">Loading...</div>;
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a3a6b] text-white">
        <h2 className="text-2xl font-bold mb-4">Activity Not Found</h2>
        <Button onClick={() => navigate('/activities')} className="bg-amber-500 hover:bg-amber-600">
          View All Activities
        </Button>
      </div>
    );
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
            <Button onClick={() => navigate('/activities')} variant="outline" className="text-white border-white/30 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Activities
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image */}
        {activity.image && (
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
            <img 
              src={activity.image} 
              alt={activity.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b] via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-amber-400" />
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30">
                  {activity.category || 'Our Work'}
                </Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">{activity.title}</h1>
            </div>
          </div>
        )}

        {!activity.image && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-amber-400" />
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30">
                {activity.category || 'Our Work'}
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">{activity.title}</h1>
          </div>
        )}

        {/* Stats */}
        {activity.stats && activity.stats.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {activity.stats.map((stat, index) => (
              <Card key={index} className="bg-amber-500/10 border-amber-400/30">
                <CardContent className="p-6 text-center">
                  <p className="text-2xl font-bold text-amber-400">{stat}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Description */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">About This Activity</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {activity.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields */}
        {activity.customFields && Object.keys(activity.customFields).length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Additional Information</h2>
              <div className="space-y-6">
                {Object.entries(activity.customFields).map(([key, value]) => (
                  <div key={key} className="border-b border-white/10 pb-4 last:border-0">
                    <h3 className="text-lg font-semibold text-amber-400 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Gallery */}
        {activity.images && activity.images.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activity.images.map((img, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                    <img 
                      src={img} 
                      alt={`${activity.title} - Image ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Videos */}
        {activity.videos && activity.videos.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {activity.videos.map((video, index) => {
                  // Check if it's a YouTube URL
                  const isYouTube = video.includes('youtube.com') || video.includes('youtu.be');
                  const embedUrl = isYouTube 
                    ? video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                    : null;

                  return (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-black/50">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={`${activity.title} - Video ${index + 1}`}
                          className="w-full h-64"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video 
                          src={video} 
                          controls 
                          className="w-full h-64 object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDFs */}
        {activity.pdfs && activity.pdfs.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Documents & Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {activity.pdfs.map((pdf, index) => (
                  <a
                    key={index}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-colors flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate group-hover:text-amber-400 transition-colors">
                        {pdf.title || `Document ${index + 1}`}
                      </p>
                      <p className="text-gray-400 text-sm">Click to download</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-400/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Support This Cause</h2>
            <p className="text-gray-300 mb-6">
              Your contribution helps us continue this important work and make a lasting impact
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                onClick={() => navigate('/donate')} 
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
              <Button 
                onClick={() => {
                  window.location.href = '/#contact';
                }} 
                variant="outline" 
                className="text-white border-white/30 hover:bg-white/10"
              >
                Get Involved
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
