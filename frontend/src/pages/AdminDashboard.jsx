import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import {
  LogOut, Activity, Info, Calendar, Image, Phone, CreditCard,
  Plus, Edit, Trash2, Save, User, Users, MessageSquare, DollarSign, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { ProfileTab, UsersTab, MessagesTab, DonationsTab, HeroTab, UpdatesTab } from '../components/AdminTabs';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('activities');
  
  // State for all content
  const [activities, setActivities] = useState([]);
  const [about, setAbout] = useState(null);
  const [events, setEvents] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contact, setContact] = useState(null);
  const [donation, setDonation] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    } else {
      fetchAllData();
    }
  }, [user, navigate]);

  const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
  });

  const fetchAllData = async () => {
    try {
      const [activitiesRes, aboutRes, eventsRes, galleryRes, contactRes, donationRes] = await Promise.all([
        api.get('/api/activities'),
        api.get('/api/about'),
        api.get('/api/events'),
        api.get('/api/gallery'),
        api.get('/api/contact'),
        api.get('/api/donation')
      ]);
      
      setActivities(activitiesRes.data || []);
      setAbout(aboutRes.data);
      setEvents(eventsRes.data || []);
      setGallery(galleryRes.data || []);
      setContact(contactRes.data);
      setDonation(donationRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    }
  };

  // Image upload handler
  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Image uploaded successfully');
      setUploadingImage(false);
      return data.url;
    } catch (error) {
      toast.error('Failed to upload image');
      setUploadingImage(false);
      return null;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Activities handlers
  const saveActivity = async (activity, index) => {
    try {
      if (activity._id) {
        await api.put(`/api/activities/${activity._id}`, activity);
        toast.success('Activity updated successfully');
      } else {
        const { data } = await api.post('/api/activities', activity);
        const newActivities = [...activities];
        newActivities[index] = { ...activity, _id: data.id };
        setActivities(newActivities);
        toast.success('Activity created successfully');
      }
      setEditMode({ ...editMode, [`activity-${index}`]: false });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to save activity');
    }
  };

  const deleteActivity = async (id, index) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await api.delete(`/api/activities/${id}`);
      setActivities(activities.filter((_, i) => i !== index));
      toast.success('Activity deleted successfully');
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const addActivity = () => {
    setActivities([...activities, {
      title: '',
      subtitle: '',
      description: '',
      icon: 'Heart',
      category: '',
      image: '',
      mainVideo: '',
      images: [],
      videos: [],
      pdfs: []
    }]);
    setEditMode({ ...editMode, [`activity-${activities.length}`]: true });
  };

  // Events handlers
  const saveEvent = async (event, index) => {
    try {
      if (event._id) {
        await api.put(`/api/events/${event._id}`, event);
        toast.success('Event updated successfully');
      } else {
        const { data } = await api.post('/api/events', event);
        const newEvents = [...events];
        newEvents[index] = { ...event, _id: data.id };
        setEvents(newEvents);
        toast.success('Event created successfully');
      }
      setEditMode({ ...editMode, [`event-${index}`]: false });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const deleteEvent = async (id, index) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/api/events/${id}`);
      setEvents(events.filter((_, i) => i !== index));
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const addEvent = () => {
    setEvents([...events, {
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      status: 'upcoming'
    }]);
    setEditMode({ ...editMode, [`event-${events.length}`]: true });
  };

  // Gallery handlers
  const addGalleryImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const title = prompt('Enter image title:');
      const category = prompt('Enter category (bhakti/service/education):');
      
      if (title && category) {
        const url = await handleImageUpload(file);
        if (url) {
          try {
            await api.post('/api/gallery', { url, title, category });
            toast.success('Image added successfully');
            fetchAllData();
          } catch (error) {
            toast.error('Failed to add image');
          }
        }
      }
    };
    input.click();
  };

  const deleteGalleryImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await api.delete(`/api/gallery/${id}`);
      toast.success('Image deleted successfully');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  // About handlers
  const saveAbout = async () => {
    try {
      await api.put('/api/about', about);
      toast.success('About section updated successfully');
      setEditMode({ ...editMode, about: false });
    } catch (error) {
      toast.error('Failed to update about section');
    }
  };

  // Contact handlers
  const saveContact = async () => {
    try {
      await api.put('/api/contact', contact);
      toast.success('Contact information updated successfully');
      setEditMode({ ...editMode, contact: false });
    } catch (error) {
      toast.error('Failed to update contact information');
    }
  };

  // Donation handlers
  const saveDonation = async () => {
    try {
      await api.put('/api/donation', donation);
      toast.success('Donation details updated successfully');
      setEditMode({ ...editMode, donation: false });
    } catch (error) {
      toast.error('Failed to update donation details');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-[#1a3a6b] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-200 text-sm">Welcome, {user.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full overflow-x-auto flex flex-nowrap bg-white p-2 rounded-lg shadow text-xs">
            <TabsTrigger value="hero" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white whitespace-nowrap flex-shrink-0">
              <Activity className="w-4 h-4 mr-1" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-1" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <Info className="w-4 h-4 mr-1" />
              About
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-1" />
              Events
            </TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-1" />
              Updates
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <Image className="w-4 h-4 mr-1" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <Phone className="w-4 h-4 mr-1" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="donation" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white whitespace-nowrap">
              <CreditCard className="w-4 h-4 mr-1" />
              Bank Details
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <User className="w-4 h-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-1" />
              Users
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-1" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="donations" className="data-[state=active]:bg-[#1a3a6b] data-[state=active]:text-white whitespace-nowrap">
              <DollarSign className="w-4 h-4 mr-1" />
              Donation Records
            </TabsTrigger>
          </TabsList>

          {/* Hero Tab */}
          <TabsContent value="hero">
            <HeroTab api={api} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} />
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1a3a6b]">Manage Activities</h2>
              <Button onClick={addActivity} className="bg-[#d97706] hover:bg-[#b45309]">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>

            <div className="grid gap-4">
              {activities.map((activity, index) => (
                <Card key={index} className="border-2 border-blue-100">
                  <CardContent className="p-6">
                    {editMode[`activity-${index}`] ? (
                      <div className="space-y-5">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                            <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Activity title" value={activity.title}
                              onChange={(e) => { const a = [...activities]; a[index].title = e.target.value; setActivities(a); }} />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
                            <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Short tagline" value={activity.subtitle || ''}
                              onChange={(e) => { const a = [...activities]; a[index].subtitle = e.target.value; setActivities(a); }} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                          <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows="4" placeholder="Full description shown on activity page"
                            value={activity.description}
                            onChange={(e) => { const a = [...activities]; a[index].description = e.target.value; setActivities(a); }} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Icon</label>
                            <select className="w-full px-3 py-2 border rounded-lg text-sm" value={activity.icon || 'Heart'}
                              onChange={(e) => { const a = [...activities]; a[index].icon = e.target.value; setActivities(a); }}>
                              <option value="Heart">Heart</option>
                              <option value="HandHeart">HandHeart</option>
                              <option value="Sparkles">Sparkles</option>
                              <option value="GraduationCap">GraduationCap</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                            <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. service, education" value={activity.category || ''}
                              onChange={(e) => { const a = [...activities]; a[index].category = e.target.value; setActivities(a); }} />
                          </div>
                        </div>

                        {/* MAIN IMAGE / VIDEO (hero panel) */}
                        <div className="border-t pt-4">
                          <p className="text-sm font-bold text-[#1a3a6b] mb-3">🖼 Main Panel (Hero Image or Video)</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">Main Image URL</label>
                              <div className="flex gap-2">
                                <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="https://..." value={activity.image || ''}
                                  onChange={(e) => { const a = [...activities]; a[index].image = e.target.value; setActivities(a); }} />
                                <Button type="button" size="sm" className="bg-blue-500 hover:bg-blue-600" disabled={uploadingImage}
                                  onClick={async () => {
                                    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
                                    inp.onchange = async (e) => {
                                      const url = await handleImageUpload(e.target.files[0]);
                                      if (url) { const a = [...activities]; a[index].image = url; setActivities(a); }
                                    }; inp.click();
                                  }}>{uploadingImage ? '...' : '📁'}</Button>
                              </div>
                              {activity.image && <img src={activity.image} alt="Preview" className="mt-2 h-24 w-full object-cover rounded" />}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">OR Main Video URL (YouTube link)</label>
                              <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://youtube.com/watch?v=..." value={activity.mainVideo || ''}
                                onChange={(e) => { const a = [...activities]; a[index].mainVideo = e.target.value; setActivities(a); }} />
                              <p className="text-xs text-gray-400 mt-1">If set, video plays in place of the main image</p>
                            </div>
                          </div>
                        </div>

                        {/* EXTRA IMAGES GALLERY */}
                        <div className="border-t pt-4">
                          <p className="text-sm font-bold text-[#1a3a6b] mb-3">📷 Extra Images (Gallery below main panel)</p>
                          <div className="space-y-2">
                            {(activity.images || []).map((img, imgIdx) => (
                              <div key={imgIdx} className="flex gap-2 items-center">
                                <img src={img} alt="" className="w-12 h-12 object-cover rounded flex-shrink-0" onError={(e) => e.target.style.display='none'} />
                                <input className="flex-1 px-3 py-2 border rounded-lg text-sm" value={img}
                                  onChange={(e) => { const a = [...activities]; a[index].images[imgIdx] = e.target.value; setActivities(a); }} />
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const a = [...activities]; a[index].images.splice(imgIdx, 1); setActivities(a);
                                }}>✕</Button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-blue-600 border-blue-300"
                                onClick={() => { const a = [...activities]; a[index].images = [...(a[index].images || []), '']; setActivities(a); }}>
                                + Add Image URL
                              </Button>
                              <Button size="sm" variant="outline" className="text-green-600 border-green-300" disabled={uploadingImage}
                                onClick={async () => {
                                  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
                                  inp.onchange = async (e) => {
                                    const url = await handleImageUpload(e.target.files[0]);
                                    if (url) { const a = [...activities]; a[index].images = [...(a[index].images || []), url]; setActivities(a); }
                                  }; inp.click();
                                }}>
                                {uploadingImage ? 'Uploading...' : '📁 Upload Image'}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* EXTRA VIDEOS */}
                        <div className="border-t pt-4">
                          <p className="text-sm font-bold text-[#1a3a6b] mb-3">🎥 Extra Videos (shown below gallery)</p>
                          <div className="space-y-2">
                            {(activity.videos || []).map((vid, vidIdx) => (
                              <div key={vidIdx} className="flex gap-2 items-center">
                                <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="YouTube URL" value={vid}
                                  onChange={(e) => { const a = [...activities]; a[index].videos[vidIdx] = e.target.value; setActivities(a); }} />
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const a = [...activities]; a[index].videos.splice(vidIdx, 1); setActivities(a);
                                }}>✕</Button>
                              </div>
                            ))}
                            <Button size="sm" variant="outline" className="text-purple-600 border-purple-300"
                              onClick={() => { const a = [...activities]; a[index].videos = [...(a[index].videos || []), '']; setActivities(a); }}>
                              + Add Video URL
                            </Button>
                          </div>
                        </div>

                        {/* PDF ATTACHMENTS */}
                        <div className="border-t pt-4">
                          <p className="text-sm font-bold text-[#1a3a6b] mb-3">📄 PDF Attachments</p>
                          <div className="space-y-2">
                            {(activity.pdfs || []).map((pdf, pdfIdx) => (
                              <div key={pdfIdx} className="flex gap-2 items-center">
                                <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="PDF Title" value={pdf.title || ''}
                                  onChange={(e) => { const a = [...activities]; a[index].pdfs[pdfIdx].title = e.target.value; setActivities(a); }} />
                                <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="PDF URL" value={pdf.url || ''}
                                  onChange={(e) => { const a = [...activities]; a[index].pdfs[pdfIdx].url = e.target.value; setActivities(a); }} />
                                <Button size="sm" variant="destructive" onClick={() => {
                                  const a = [...activities]; a[index].pdfs.splice(pdfIdx, 1); setActivities(a);
                                }}>✕</Button>
                              </div>
                            ))}
                            <Button size="sm" variant="outline" className="text-red-600 border-red-300"
                              onClick={() => { const a = [...activities]; a[index].pdfs = [...(a[index].pdfs || []), { title: '', url: '' }]; setActivities(a); }}>
                              + Add PDF
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <Button onClick={() => saveActivity(activity, index)} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" /> Save Activity
                          </Button>
                          <Button onClick={() => setEditMode({ ...editMode, [`activity-${index}`]: false })} variant="outline">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">{activity.title}</h3>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setEditMode({ ...editMode, [`activity-${index}`]: true })}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {activity._id && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteActivity(activity._id, index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{activity.subtitle}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        {activity.image && (
                          <img src={activity.image} alt={activity.title} className="mt-4 h-32 object-cover rounded-lg" />
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1a3a6b]">Manage About Section</h2>
              {!editMode.about ? (
                <Button onClick={() => setEditMode({ ...editMode, about: true })} className="bg-[#1a3a6b]">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={saveAbout} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setEditMode({ ...editMode, about: false })} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {about && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  {editMode.about ? (
                    <>
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Title"
                        value={about.title}
                        onChange={(e) => setAbout({ ...about, title: e.target.value })}
                      />
                      <textarea
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Description"
                        rows="4"
                        value={about.description}
                        onChange={(e) => setAbout({ ...about, description: e.target.value })}
                      />
                      <textarea
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Mission"
                        rows="3"
                        value={about.mission}
                        onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                      />
                      <textarea
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Vision"
                        rows="3"
                        value={about.vision}
                        onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">{about.title}</h3>
                      <p className="text-gray-700">{about.description}</p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-[#1a3a6b] mb-2">Mission</h4>
                          <p className="text-sm">{about.mission}</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg">
                          <h4 className="font-semibold text-[#d97706] mb-2">Vision</h4>
                          <p className="text-sm">{about.vision}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1a3a6b]">Manage Events</h2>
              <Button onClick={addEvent} className="bg-[#d97706] hover:bg-[#b45309]">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>

            <div className="grid gap-4">
              {events.map((event, index) => (
                <Card key={index} className="border-2 border-blue-100">
                  <CardContent className="p-6">
                    {editMode[`event-${index}`] ? (
                      <div className="space-y-4">
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Event Title"
                          value={event.title}
                          onChange={(e) => {
                            const newEvents = [...events];
                            newEvents[index].title = e.target.value;
                            setEvents(newEvents);
                          }}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="date"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={event.date}
                            onChange={(e) => {
                              const newEvents = [...events];
                              newEvents[index].date = e.target.value;
                              setEvents(newEvents);
                            }}
                          />
                          <input
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Time"
                            value={event.time}
                            onChange={(e) => {
                              const newEvents = [...events];
                              newEvents[index].time = e.target.value;
                              setEvents(newEvents);
                            }}
                          />
                        </div>
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Location"
                          value={event.location}
                          onChange={(e) => {
                            const newEvents = [...events];
                            newEvents[index].location = e.target.value;
                            setEvents(newEvents);
                          }}
                        />
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Event Image URL"
                          value={event.image || ''}
                          onChange={(e) => {
                            const newEvents = [...events];
                            newEvents[index].image = e.target.value;
                            setEvents(newEvents);
                          }}
                        />
                        <textarea
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Description"
                          rows="3"
                          value={event.description}
                          onChange={(e) => {
                            const newEvents = [...events];
                            newEvents[index].description = e.target.value;
                            setEvents(newEvents);
                          }}
                        />
                        <select
                          className="w-full px-4 py-2 border rounded-lg"
                          value={event.status}
                          onChange={(e) => {
                            const newEvents = [...events];
                            newEvents[index].status = e.target.value;
                            setEvents(newEvents);
                          }}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="completed">Completed</option>
                        </select>
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Google Form Link (for registration)"
                          value={event.googleFormLink || ''}
                          onChange={(e) => {
                            const newEvents = [...events];
                            newEvents[index].googleFormLink = e.target.value;
                            setEvents(newEvents);
                          }}
                        />
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="WhatsApp Group Link"
                          value={event.whatsappGroupLink || ''}
                          onChange={(e) => {
                            const newEvents = [...events];
                            newEvents[index].whatsappGroupLink = e.target.value;
                            setEvents(newEvents);
                          }}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => saveEvent(event, index)} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditMode({ ...editMode, [`event-${index}`]: false })}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <p className="text-sm text-gray-500">{event.date} | {event.time}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setEditMode({ ...editMode, [`event-${index}`]: true })}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {event._id && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteEvent(event._id, index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{event.location}</p>
                        <p className="text-sm text-gray-500">{event.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates">
            <UpdatesTab api={api} />
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1a3a6b]">Manage Gallery</h2>
              <Button onClick={addGalleryImage} className="bg-[#d97706] hover:bg-[#b45309]">
                <Plus className="w-4 h-4 mr-2" />
                Add Image/Video
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <Card key={index} className="group relative overflow-hidden">
                  {image.type === 'video' ? (
                    <div className="relative w-full h-48 bg-black">
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">VIDEO</span>
                      </div>
                      {image.url.includes('youtube') || image.url.includes('youtu.be') ? (
                        <img
                          src={`https://img.youtube.com/vi/${image.url.split('v=')[1]?.split('&')[0] || image.url.split('/').pop()}/maxresdefault.jpg`}
                          alt={image.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <video src={image.url} className="w-full h-48 object-cover" />
                      )}
                    </div>
                  ) : (
                    <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteGalleryImage(image._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm">{image.title}</p>
                    <p className="text-xs text-gray-500">{image.category}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1a3a6b]">Manage Contact Information</h2>
              {!editMode.contact ? (
                <Button onClick={() => setEditMode({ ...editMode, contact: true })} className="bg-[#1a3a6b]">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={saveContact} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setEditMode({ ...editMode, contact: false })} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {contact && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  {editMode.contact ? (
                    <>
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Contact Person Name"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      />
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Phone"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      />
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      />
                      <textarea
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Address"
                        rows="3"
                        value={contact.address}
                        onChange={(e) => setContact({ ...contact, address: e.target.value })}
                      />
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Timing"
                        value={contact.timing}
                        onChange={(e) => setContact({ ...contact, timing: e.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-semibold text-gray-700">Contact Person</label>
                          <p>{contact.name}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Phone</label>
                          <p>{contact.phone}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Email</label>
                          <p>{contact.email}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Timing</label>
                          <p>{contact.timing}</p>
                        </div>
                        <div className="col-span-2">
                          <label className="font-semibold text-gray-700">Address</label>
                          <p>{contact.address}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Donation Tab */}
          <TabsContent value="donation" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1a3a6b]">Update Bank Details</h2>
              {!editMode.donation ? (
                <Button onClick={() => setEditMode({ ...editMode, donation: true })} className="bg-[#1a3a6b]">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={saveDonation} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setEditMode({ ...editMode, donation: false })} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {donation && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  {editMode.donation ? (
                    <>
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Bank Name"
                        value={donation.bankName}
                        onChange={(e) => setDonation({ ...donation, bankName: e.target.value })}
                      />
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Account Name"
                        value={donation.accountName}
                        onChange={(e) => setDonation({ ...donation, accountName: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Account Number"
                          value={donation.accountNumber}
                          onChange={(e) => setDonation({ ...donation, accountNumber: e.target.value })}
                        />
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="IFSC Code"
                          value={donation.ifscCode}
                          onChange={(e) => setDonation({ ...donation, ifscCode: e.target.value })}
                        />
                      </div>
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Branch (e.g., Opera House, Mumbai)"
                        value={donation.branch || ''}
                        onChange={(e) => setDonation({ ...donation, branch: e.target.value })}
                      />
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="UPI ID"
                        value={donation.upiId}
                        onChange={(e) => setDonation({ ...donation, upiId: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2">QR Code Image</label>
                        <div className="flex gap-2">
                          <input
                            className="flex-1 px-4 py-2 border rounded-lg"
                            placeholder="QR Code Image URL or upload"
                            value={donation.qrCodeImage || ''}
                            onChange={(e) => setDonation({ ...donation, qrCodeImage: e.target.value })}
                          />
                          <Button
                            type="button"
                            onClick={async () => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const url = await handleImageUpload(file);
                                  if (url) {
                                    setDonation({ ...donation, qrCodeImage: url });
                                  }
                                }
                              };
                              input.click();
                            }}
                            className="bg-blue-500"
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? 'Uploading...' : 'Upload'}
                          </Button>
                        </div>
                        {donation.qrCodeImage && (
                          <img src={donation.qrCodeImage} alt="QR Code Preview" className="mt-2 h-32 object-contain rounded-lg border" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Receipt Contact Number"
                          value={donation.receiptContact || ''}
                          onChange={(e) => setDonation({ ...donation, receiptContact: e.target.value })}
                        />
                        <select
                          className="w-full px-4 py-2 border rounded-lg"
                          value={donation.receiptContactType || 'WhatsApp'}
                          onChange={(e) => setDonation({ ...donation, receiptContactType: e.target.value })}
                        >
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Phone">Phone</option>
                          <option value="SMS">SMS</option>
                        </select>
                      </div>
                      <input
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Play Store Link (Android App)"
                        value={donation.playStoreLink || ''}
                        onChange={(e) => setDonation({ ...donation, playStoreLink: e.target.value })}
                      />
                      
                      <Separator className="my-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Foreign Donation Details (FCRA)</h3>
                      <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Foreign Bank Name"
                          value={donation.foreignDonation?.bankName || ''}
                          onChange={(e) => setDonation({ 
                            ...donation, 
                            foreignDonation: { ...donation.foreignDonation, bankName: e.target.value }
                          })}
                        />
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Foreign Account Name"
                          value={donation.foreignDonation?.accountName || ''}
                          onChange={(e) => setDonation({ 
                            ...donation, 
                            foreignDonation: { ...donation.foreignDonation, accountName: e.target.value }
                          })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="Account Number"
                            value={donation.foreignDonation?.accountNumber || ''}
                            onChange={(e) => setDonation({ 
                              ...donation, 
                              foreignDonation: { ...donation.foreignDonation, accountNumber: e.target.value }
                            })}
                          />
                          <input
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="SWIFT Code"
                            value={donation.foreignDonation?.swiftCode || ''}
                            onChange={(e) => setDonation({ 
                              ...donation, 
                              foreignDonation: { ...donation.foreignDonation, swiftCode: e.target.value }
                            })}
                          />
                        </div>
                        <input
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="IFSC Code"
                          value={donation.foreignDonation?.ifscCode || ''}
                          onChange={(e) => setDonation({ 
                            ...donation, 
                            foreignDonation: { ...donation.foreignDonation, ifscCode: e.target.value }
                          })}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-semibold text-gray-700">Bank Name</label>
                          <p>{donation.bankName}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Account Name</label>
                          <p>{donation.accountName}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Account Number</label>
                          <p>{donation.accountNumber}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">IFSC Code</label>
                          <p>{donation.ifscCode}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Branch</label>
                          <p>{donation.branch || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">UPI ID</label>
                          <p>{donation.upiId}</p>
                        </div>
                        <div className="col-span-2">
                          <label className="font-semibold text-gray-700">QR Code Image</label>
                          {donation.qrCodeImage ? (
                            <img src={donation.qrCodeImage} alt="QR Code" className="mt-2 h-32 object-contain border rounded" />
                          ) : (
                            <p className="text-gray-500 italic">No QR code uploaded</p>
                          )}
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Receipt Contact</label>
                          <p>{donation.receiptContact || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="font-semibold text-gray-700">Contact Type</label>
                          <p>{donation.receiptContactType || 'WhatsApp'}</p>
                        </div>
                        {donation.playStoreLink && (
                          <div className="col-span-2">
                            <label className="font-semibold text-gray-700">Play Store Link</label>
                            <a href={donation.playStoreLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block truncate">
                              {donation.playStoreLink}
                            </a>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileTab user={user} api={api} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UsersTab api={api} />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <MessagesTab api={api} />
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations">
            <DonationsTab api={api} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
