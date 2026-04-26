import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Heart, Play, Download, FileText, Globe, MapPin, X } from 'lucide-react';

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

const TapovanPage = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [viewingMedia, setViewingMedia] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${BACKEND_URL}/api/pages/tapovan`).catch(() => ({ data: {} })),
      axios.get(`${BACKEND_URL}/api/tapovan-schools`).catch(() => ({ data: [] }))
    ]).then(([pageRes, schoolsRes]) => {
      setPageData(pageRes.data || {});
      setSchools(schoolsRes.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a6b] via-[#2a4a7b] to-[#1a3a6b]">
      <MediaViewer media={viewingMedia} onClose={() => setViewingMedia(null)} />

      {/* School modal */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedSchool(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {selectedSchool.image && (
              <div className="relative h-56 overflow-hidden">
                <img src={selectedSchool.image} alt={selectedSchool.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b] to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-2xl font-bold text-white">{selectedSchool.name}</h2>
                  {selectedSchool.location && <p className="text-amber-300 flex items-center gap-1 text-sm mt-1"><MapPin className="w-3 h-3" />{selectedSchool.location}</p>}
                </div>
                <button onClick={() => setSelectedSchool(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"><X className="w-4 h-4" /></button>
              </div>
            )}
            <div className="p-6">
              {!selectedSchool.image && (
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedSchool.name}</h2>
                    {selectedSchool.location && <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{selectedSchool.location}</p>}
                  </div>
                  <button onClick={() => setSelectedSchool(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
                </div>
              )}
              {selectedSchool.description && <p className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">{selectedSchool.description}</p>}
              {selectedSchool.websiteLink && (
                <a href={selectedSchool.websiteLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#0f2244] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
                  <Globe className="w-4 h-4" /> Click to visit website
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
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
        <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-400/30 border">Education Initiative</Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{pageData?.title || 'Tapovan Vidyalay'}</h1>
        {pageData?.subtitle && <p className="text-lg text-amber-400 font-medium">{pageData.subtitle}</p>}
        {pageData?.description && <p className="text-gray-300 mt-3 max-w-2xl mx-auto leading-relaxed">{pageData.description}</p>}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-white border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        ) : (
          <>
            {pageData?.image && (
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-2xl">
                <img src={pageData.image} alt="Tapovan" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b]/50 to-transparent"></div>
              </div>
            )}

            {schools.length > 0 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Our Schools Across India</h2>
                  <p className="text-gray-300">Click on any school to know more</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {schools.map((school) => (
                    <div key={school._id} className="group cursor-pointer text-center" onClick={() => setSelectedSchool(school)}>
                      <div className="relative h-36 rounded-xl overflow-hidden mb-3 shadow-lg group-hover:shadow-2xl transition-all group-hover:-translate-y-1">
                        {school.image
                          ? <img src={school.image} alt={school.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => e.target.style.display='none'} />
                          : <div className="w-full h-full bg-white/10 flex items-center justify-center text-5xl">🏫</div>
                        }
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <p className="text-white font-bold text-sm uppercase tracking-wide">{school.name}</p>
                      {school.location && <p className="text-gray-400 text-xs mt-0.5">{school.location}</p>}
                      <Button size="sm" className="mt-2 bg-[#8b1a1a] hover:bg-[#6b1414] text-white text-xs px-4 py-1 h-auto rounded-full">Read More</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pageData?.images && pageData.images.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {pageData.images.map((item, i) => (
                      <GalleryItem key={i} item={item} onClick={() => setViewingMedia(item)} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {pageData?.pdfs && pageData.pdfs.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><FileText className="w-6 h-6 text-amber-400" /> Documents</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {pageData.pdfs.map((pdf, i) => (
                      <a key={i} href={pdf.url} target="_blank" rel="noopener noreferrer"
                        className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-colors flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">PDF</div>
                        <p className="text-white font-semibold text-sm group-hover:text-amber-400 flex-1 truncate">{pdf.title || `Document ${i+1}`}</p>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-amber-400" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-r from-[#d97706]/20 to-amber-500/10 border-[#d97706]/40 text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3">Support Our Education Initiative</h3>
                <p className="text-gray-300 mb-6">Help us provide quality education to more students.</p>
                <Button className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-3" onClick={() => navigate('/donate')}>
                  <Heart className="w-4 h-4 mr-2" /> Donate Now
                </Button>
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

export default TapovanPage;
