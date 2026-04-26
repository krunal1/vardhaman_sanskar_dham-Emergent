import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Heart, Play, Download, FileText, Star, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`;
  if (url.includes('watch?v=')) return `https://www.youtube.com/embed/${url.split('watch?v=')[1]?.split('&')[0]}`;
  return null;
};
const isYouTube = (url) => url && (url.includes('youtube') || url.includes('youtu.be'));

// Reusable video/image lightbox
const MediaViewer = ({ media, onClose }) => {
  if (!media) return null;
  const isVid = media.type === 'video';
  const embedUrl = isVid && isYouTube(media.url) ? getYouTubeEmbedUrl(media.url) : null;
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20" onClick={onClose}><X /></button>
      <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
        {isVid ? (
          embedUrl
            ? <iframe src={`${embedUrl}?autoplay=1`} className="w-full aspect-video rounded-xl" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            : <video src={media.url} controls autoPlay className="w-full max-h-[80vh] rounded-xl bg-black" />
        ) : (
          <img src={media.url} alt="" className="max-w-full max-h-[85vh] object-contain rounded-xl mx-auto block" />
        )}
      </div>
    </div>
  );
};

const GalleryItem = ({ item, onClick }) => {
  const isVid = item.type === 'video';
  const thumb = isVid && isYouTube(item.url)
    ? `https://img.youtube.com/vi/${item.url.split('v=')[1]?.split('&')[0] || item.url.split('/').pop()}/hqdefault.jpg`
    : null;

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer" onClick={onClick}>
      {isVid ? (
        <div className="w-full h-full bg-gray-900 relative">
          {thumb
            ? <img src={thumb} alt={item.title||''} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300" />
            : <video src={item.url} className="w-full h-full object-cover opacity-80" preload="metadata" muted playsInline />
          }
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#d97706]/90 rounded-full flex items-center justify-center shadow-xl">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
      ) : (
        <img src={item.url} alt={item.title||''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onError={e => e.target.style.display='none'} />
      )}
      {item.title && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 opacity-0 group-hover:opacity-100 transition-opacity truncate">{item.title}</div>
      )}
    </div>
  );
};

const GurudevPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewingMedia, setViewingMedia] = useState(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/pages/gurudev`)
      .then(res => setData(res.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);
  // Combine images + videos into one gallery
  const galleryItems = [
    ...(data?.images || []),
    ...(data?.videos || []).map((url) => ({ type: 'video', url })),
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6b] via-[#2a4a7b] to-[#1a3a6b]">
      <MediaViewer media={viewingMedia} onClose={() => setViewingMedia(null)} />
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl font-bold">X</button>
          <img src={selectedImage} alt="" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <img src="https://customer-assets.emergentagent.com/job_sanskar-dham/artifacts/ed94r76r_VSD_PNG_LOGO.png" alt="VSD Logo" className="h-12 w-auto object-contain" />
          </button>
          <Button onClick={() => navigate('/')} variant="outline" className="text-white border-white/30 hover:bg-white/10 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>

      <div className="py-12 px-4 text-center">
        <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-400/30 border">Spiritual Guide</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{data?.title || 'About Gurudev'}</h1>
        {data?.subtitle && <p className="text-lg text-amber-400 font-semibold">{data.subtitle}</p>}
        {!data?.subtitle && <p className="text-amber-400 font-semibold">P.P.P. Chandrashekharvijaiyji M.S.</p>}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-white border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {data?.image && (
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img src={data.image} alt="Gurudev" className="w-full object-cover" onError={e => e.target.style.display='none'} />
                </div>
              )}
              {data?.description && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Star className="w-6 h-6 text-amber-400" /> Biography
                    </h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{data.description}</p>
                  </CardContent>
                </Card>
              )}
              {!data?.description && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Star className="w-6 h-6 text-amber-400" /> A Beacon of Compassion
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      P.P.P. Chandrashekharvijaiyji M.S. has been the guiding light and spiritual inspiration behind Vardhman Sanskar Dham.
                      His teachings emphasize compassion, service to humanity, and the preservation of cultural and spiritual values rooted in Jain philosophy.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {data?.images && data.images.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Photo Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {data.images.map((item, i) => (
                      <GalleryItem key={i} item={item} onClick={() => setViewingMedia(item)} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {data?.videos && data.videos.filter(Boolean).length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Play className="w-6 h-6 text-amber-400" /> Pravachan & Discourses</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {data.videos.filter(Boolean).map((url, i) => {
                      const embed = getYouTubeEmbedUrl(url);
                      return embed ? <iframe key={i} src={embed} className="w-full h-52 rounded-xl" frameBorder="0" allowFullScreen title={`Video ${i+1}`} /> : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {data?.pdfs && data.pdfs.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><FileText className="w-6 h-6 text-amber-400" /> Documents</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {data.pdfs.map((pdf, i) => (
                      <a key={i} href={pdf.url} target="_blank" rel="noopener noreferrer"
                        className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-colors flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">PDF</span>
                        </div>
                        <p className="text-white font-semibold text-sm group-hover:text-amber-400 flex-1 truncate">{pdf.title || `Document ${i+1}`}</p>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-amber-400" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-r from-amber-900/30 to-amber-800/10 border-amber-500/30 text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">Continue His Mission</h3>
                <p className="text-gray-300 mb-6">Support the work inspired by Gurudev's teachings.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-6 py-3" onClick={() => navigate('/donate')}>
                    <Heart className="w-4 h-4 mr-2" /> Donate Now
                  </Button>
                  <Button variant="outline" className="text-white border-white/40 hover:bg-white/10" onClick={() => navigate('/activities')}>
                    View Our Activities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-blue-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Vardhaman Sanskar Dham. All rights reserved.</p>
      </div>
    </div>
  );
};

export default GurudevPage;
