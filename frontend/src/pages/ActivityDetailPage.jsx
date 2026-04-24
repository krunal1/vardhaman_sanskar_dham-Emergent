import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Heart, Play, Download, FileText } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ActivityDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchActivityDetail();
  }, [slug]);

  const fetchActivityDetail = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/activities/${slug}`);
      setActivity(data);
    } catch (error) {
      console.error('Error fetching activity detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtu.be/')) {
      return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
    }
    if (url.includes('watch?v=')) {
      return `https://www.youtube.com/embed/${url.split('watch?v=')[1].split('&')[0]}`;
    }
    return null;
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

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a3a6b] to-[#0f2244] text-white gap-4">
        <h2 className="text-2xl font-bold">Activity Not Found</h2>
        <Button onClick={() => navigate('/activities')} className="bg-[#d97706] hover:bg-[#b45309]">
          View All Activities
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6b] via-[#2a4a7b] to-[#1a3a6b]">
      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-3">
              <img
                src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png"
                alt="VSD Logo"
                className="h-12 w-auto object-contain"
              />
            </button>
            <Button
              onClick={() => navigate('/activities')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> All Activities
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Image */}
        {activity.image && (
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b] via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <Badge className="bg-[#d97706] text-white border-0 mb-3">
                {activity.category || 'Our Work'}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{activity.title}</h1>
              {activity.subtitle && (
                <p className="text-amber-300 mt-2">{activity.subtitle}</p>
              )}
            </div>
          </div>
        )}

        {!activity.image && (
          <div className="mb-8">
            <Badge className="bg-[#d97706] text-white border-0 mb-3">{activity.category || 'Our Work'}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{activity.title}</h1>
            {activity.subtitle && <p className="text-amber-300">{activity.subtitle}</p>}
          </div>
        )}

        {/* Stats */}
        {activity.stats && activity.stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {activity.stats.map((stat, index) => (
              <Card key={index} className="bg-amber-500/10 border-amber-400/30">
                <CardContent className="p-4 sm:p-6 text-center">
                  <p className="text-lg sm:text-2xl font-bold text-amber-400">{stat}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Description */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-amber-400" /> About This Activity
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
              {activity.description}
            </p>
          </CardContent>
        </Card>

        {/* Custom Fields */}
        {activity.customFields && Object.keys(activity.customFields).length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Additional Information</h2>
              <div className="space-y-5">
                {Object.entries(activity.customFields).map(([key, value]) => (
                  <div key={key} className="border-b border-white/10 pb-4 last:border-0">
                    <h3 className="text-base font-semibold text-amber-400 mb-2 capitalize">
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
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activity.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative h-40 sm:h-48 rounded-lg overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`${activity.title} - ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">View</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Videos */}
        {activity.videos && activity.videos.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Play className="w-6 h-6 text-amber-400" /> Videos
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {activity.videos.map((video, index) => {
                  const embedUrl = getYouTubeEmbedUrl(video);
                  return (
                    <div key={index} className="relative rounded-xl overflow-hidden bg-black/50 shadow-lg">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={`${activity.title} - Video ${index + 1}`}
                          className="w-full h-56 sm:h-64"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={video} controls className="w-full h-56 sm:h-64 object-cover">
                          Your browser does not support video.
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
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-400" /> Documents & Resources
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {activity.pdfs.map((pdf, index) => (
                  <a
                    key={index}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-colors flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate group-hover:text-amber-400 transition-colors">
                        {pdf.title || `Document ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Click to download</p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#d97706]/20 to-amber-500/10 border-[#d97706]/40 mb-8">
          <CardContent className="p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Support This Cause</h2>
            <p className="text-gray-300 mb-6">
              Your contribution directly helps us continue this important work and serve more people in need.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-3"
                onClick={() => navigate('/donate')}
              >
                Donate Now
              </Button>
              <Button
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10"
                onClick={() => navigate('/activities')}
              >
                View All Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-6 text-center text-blue-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
