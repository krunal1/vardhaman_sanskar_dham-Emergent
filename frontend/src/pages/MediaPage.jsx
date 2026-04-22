import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Play, Film } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MediaPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/gallery`);
      const videoItems = data.filter(item => item.type === 'video');
      setVideos(videoItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6b] via-[#2a4a7b] to-[#1a3a6b]">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div>
                <p className="text-xs text-amber-400">Inspired By : P.P.P. Chandrashekharvijaiyji M.S.</p>
                <h1 className="text-xl font-bold text-red-600">VARDHMAN SANSKARDHAM</h1>
              </div>
            </a>
            <Button onClick={() => window.location.href = '/'} variant="outline" className="text-white border-white/30 hover:bg-white/10">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30 mb-4">Media Gallery</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Videos & Media</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Watch our activities, events, and impact stories
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-white">Loading videos...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => {
              const isYouTube = video.url.includes('youtube.com') || video.url.includes('youtu.be');
              const embedUrl = isYouTube
                ? video.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                : null;

              return (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden group">
                  <div className="relative h-64">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        src={video.url}
                        controls
                        className="w-full h-full object-cover"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{video.title}</h3>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30 text-xs">
                      {video.category}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No videos available yet</p>
              <p className="text-sm text-gray-500">Check back soon for updates!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
