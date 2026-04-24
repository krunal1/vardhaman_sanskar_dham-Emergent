import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Play, Film, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  let videoId = null;
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1]?.split('&')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0];
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('youtu.be/')) {
    return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`;
  }
  if (url.includes('watch?v=')) {
    return `https://www.youtube.com/embed/${url.split('watch?v=')[1]?.split('&')[0]}`;
  }
  return null;
};

const MediaPage = () => {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/gallery`);
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const videos = galleryItems.filter(item => item.type === 'video');
  const images = galleryItems.filter(item => item.type !== 'video');

  const filtered = activeTab === 'all'
    ? galleryItems
    : activeTab === 'videos'
    ? videos
    : images;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6b] via-[#2a4a7b] to-[#1a3a6b]">
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
              onClick={() => navigate('/')}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-400/30 border">Our Stories</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Media & Gallery</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Photos and videos from our activities, events, and community programs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {[
            { key: 'all', label: `All (${galleryItems.length})` },
            { key: 'videos', label: `Videos (${videos.length})`, icon: Film },
            { key: 'images', label: `Photos (${images.length})`, icon: ImageIcon },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-[#d97706] text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-white border-t-[#d97706] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-300">Loading media...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No media available yet.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for photos and videos!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const isVideo = item.type === 'video';
              const isYouTube = isVideo && (item.url?.includes('youtube') || item.url?.includes('youtu.be'));
              const thumbnail = isYouTube ? getYouTubeThumbnail(item.url) : null;
              const embedUrl = isYouTube ? getYouTubeEmbedUrl(item.url) : null;

              return (
                <Card key={item._id} className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="relative aspect-video bg-black/50">
                    {playingVideo === item._id && isVideo ? (
                      embedUrl ? (
                        <iframe
                          src={`${embedUrl}?autoplay=1`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={item.url} controls autoPlay className="w-full h-full object-cover">
                          Your browser does not support video.
                        </video>
                      )
                    ) : (
                      <>
                        {isVideo ? (
                          thumbnail ? (
                            <img src={thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <Film className="w-12 h-12 text-gray-600" />
                            </div>
                          )
                        ) : (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x225?text=Image'; }}
                          />
                        )}

                        {isVideo && (
                          <button
                            onClick={() => setPlayingVideo(item._id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors"
                          >
                            <div className="w-14 h-14 bg-[#d97706] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                              <Play className="w-7 h-7 text-white fill-white ml-1" />
                            </div>
                          </button>
                        )}
                      </>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={`text-xs border-0 ${isVideo ? 'bg-red-500' : 'bg-[#1a3a6b]'} text-white`}>
                        {isVideo ? 'Video' : item.category || 'Photo'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-semibold line-clamp-1">{item.title}</h3>
                    {item.category && (
                      <p className="text-gray-400 text-xs mt-1 capitalize">{item.category}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-6 text-center text-blue-300 text-sm mt-12">
        <p>&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MediaPage;
