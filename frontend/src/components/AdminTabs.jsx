import React, { useState, useEffect } from 'react';
import { User, Users, MessageSquare, DollarSign, Sparkles, Calendar, Upload, Edit, Save, FileText, Download, Play, GraduationCap, Star, Heart, ArrowLeft, Separator } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const ProfileTab = ({ user, api }) => {
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [editingProfile, setEditingProfile] = useState(false);

  const saveProfile = async () => {
    try {
      await api.put('/api/auth/profile', profile);
      toast.success('Profile updated successfully');
      setEditingProfile(false);
      window.location.reload(); // Reload to update user context
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await api.post('/api/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a3a6b]">Profile Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editingProfile ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveProfile} className="bg-green-600">Save</Button>
                <Button onClick={() => setEditingProfile(false)} variant="outline">Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{user?.email}</p>
              </div>
              <Button onClick={() => setEditingProfile(true)} className="bg-[#1a3a6b]">Edit Profile</Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="bg-[#1a3a6b]">Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const UsersTab = ({ api }) => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'admin' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/api/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users', newUser);
      toast.success('User created successfully');
      setNewUser({ name: '', email: '', password: '', role: 'admin' });
      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a3a6b]">User Management</h2>
        <Button onClick={() => setShowAddUser(!showAddUser)} className="bg-[#d97706]">
          {showAddUser ? 'Cancel' : '+ Add New User'}
        </Button>
      </div>

      {showAddUser && (
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="bg-green-600">Create User</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {users.map((u) => (
          <Card key={u._id}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{u.name}</h3>
                <p className="text-gray-600">{u.email}</p>
                <p className="text-sm text-gray-500">Role: {u.role}</p>
              </div>
              {u.email === 'vsddomb@gmail.com' ? (
                <Button variant="outline" size="sm" disabled className="text-gray-400 border-gray-200">Primary Admin</Button>
              ) : (
                <Button variant="destructive" size="sm" onClick={() => deleteUser(u._id)}>Delete</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const MessagesTab = ({ api }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/api/contact/messages');
      setMessages(data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/contact/messages/${id}/read`);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/api/contact/messages/${id}`);
      toast.success('Message deleted');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a3a6b]">Contact Messages ({messages.length})</h2>
      
      <div className="grid gap-4">
        {messages.map((msg) => (
          <Card key={msg._id} className={msg.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{msg.name}</h3>
                  <p className="text-sm text-gray-600">{msg.email} | {msg.phone}</p>
                  <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  {msg.status === 'unread' && (
                    <Button size="sm" onClick={() => markAsRead(msg._id)} className="bg-blue-600">Mark Read</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => deleteMessage(msg._id)}>Delete</Button>
                </div>
              </div>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{msg.message}</p>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              No messages yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export const DonationsTab = ({ api }) => {
  const [donations, setDonations] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newDonation, setNewDonation] = useState({
    donorName: '', donorEmail: '', donorPhone: '', amount: '', transactionId: '', date: '', status: 'pending'
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data } = await api.get('/api/donations/records');
      setDonations(data);
    } catch (error) {
      toast.error('Failed to fetch donations');
    }
  };

  const addDonation = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/donations/records', newDonation);
      toast.success('Donation recorded');
      setNewDonation({ donorName: '', donorEmail: '', donorPhone: '', amount: '', transactionId: '', date: '', status: 'pending' });
      setShowAdd(false);
      fetchDonations();
    } catch (error) {
      toast.error('Failed to record donation');
    }
  };

  const sendThankYou = async (id) => {
    try {
      const { data } = await api.post(`/api/donations/records/${id}/send-thankyou`);
      toast.success(`Thank you sent to ${data.donor}`);
      fetchDonations();
    } catch (error) {
      toast.error('Failed to send thank you');
    }
  };

  const deleteDonation = async (id) => {
    if (!window.confirm('Delete this donation record?')) return;
    try {
      await api.delete(`/api/donations/records/${id}`);
      toast.success('Donation deleted');
      fetchDonations();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const totalAmount = donations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1a3a6b]">Donation Records</h2>
          <p className="text-lg text-gray-600">Total: ₹{totalAmount.toLocaleString()}</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="bg-[#d97706]">
          {showAdd ? 'Cancel' : '+ Record Donation'}
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardHeader><CardTitle>Record New Donation</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={addDonation} className="grid grid-cols-2 gap-4">
              <input className="px-4 py-2 border rounded-lg" placeholder="Donor Name" value={newDonation.donorName} onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })} required />
              <input type="email" className="px-4 py-2 border rounded-lg" placeholder="Email" value={newDonation.donorEmail} onChange={(e) => setNewDonation({ ...newDonation, donorEmail: e.target.value })} required />
              <input className="px-4 py-2 border rounded-lg" placeholder="Phone" value={newDonation.donorPhone} onChange={(e) => setNewDonation({ ...newDonation, donorPhone: e.target.value })} required />
              <input type="number" className="px-4 py-2 border rounded-lg" placeholder="Amount (₹)" value={newDonation.amount} onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })} required />
              <input className="px-4 py-2 border rounded-lg" placeholder="Transaction ID" value={newDonation.transactionId} onChange={(e) => setNewDonation({ ...newDonation, transactionId: e.target.value })} required />
              <input type="date" className="px-4 py-2 border rounded-lg" value={newDonation.date} onChange={(e) => setNewDonation({ ...newDonation, date: e.target.value })} required />
              <Button type="submit" className="col-span-2 bg-green-600">Record Donation</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {donations.map((d) => (
          <Card key={d._id} className={d.status === 'confirmed' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-yellow-500'}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{d.donorName}</h3>
                  <p className="text-sm text-gray-600">{d.donorEmail} | {d.donorPhone}</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">₹{parseFloat(d.amount).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Transaction: {d.transactionId} | {d.date}</p>
                  <Badge className={d.status === 'confirmed' ? 'bg-green-500 mt-2' : 'bg-yellow-500 mt-2'}>{d.status}</Badge>
                </div>
                <div className="flex gap-2">
                  {d.status === 'pending' && (
                    <Button size="sm" onClick={() => sendThankYou(d._id)} className="bg-blue-600">Send Thank You</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => deleteDonation(d._id)}>Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {donations.length === 0 && (
          <Card><CardContent className="p-12 text-center text-gray-500">No donations recorded yet</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export const HeroTab = ({ api, handleImageUpload, uploadingImage }) => {
  const [hero, setHero] = useState({
    badge: '',
    title: '',
    highlightedWord: '',
    subtitle: '',
    backgroundImage: '',
    button1Text: 'Join Our Mission',
    button2Text: 'Learn More',
    height: '550px'
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data } = await api.get('/api/hero');
      if (data) setHero(prev => ({ ...prev, ...data }));
    } catch (error) {
      toast.error('Failed to fetch hero section');
    }
  };

  const saveHero = async () => {
    try {
      await api.put('/api/hero', hero);
      toast.success('Hero section updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update hero section');
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a3a6b]">Hero Section Management</h2>
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="bg-[#1a3a6b]">Edit Hero Section</Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={saveHero} className="bg-green-600">Save Changes</Button>
            <Button onClick={() => { setEditing(false); fetchHero(); }} variant="outline">Cancel</Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section Content</CardTitle>
          <CardDescription>This is the first thing visitors see on your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Badge Text (e.g., "Serving Since 2004")</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg"
                  value={hero.badge}
                  onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Main Title</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Building a Compassionate"
                  value={hero.title}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Highlighted Word (shown in golden color)</label>
                <input
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Society"
                  value={hero.highlightedWord}
                  onChange={(e) => setHero({ ...hero, highlightedWord: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle/Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  value={hero.subtitle}
                  onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Background Image</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="Image URL or upload new"
                    value={hero.backgroundImage}
                    onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
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
                            setHero({ ...hero, backgroundImage: url });
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
                {hero.backgroundImage && (
                  <img src={hero.backgroundImage} alt="Hero Background" className="mt-2 h-32 object-cover rounded-lg w-full" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button 1 Text</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg"
                    value={hero.button1Text}
                    onChange={(e) => setHero({ ...hero, button1Text: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Button 2 Text</label>
                  <input
                    className="w-full px-4 py-2 border rounded-lg"
                    value={hero.button2Text}
                    onChange={(e) => setHero({ ...hero, button2Text: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Section Height</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={hero.height}
                  onChange={(e) => setHero({ ...hero, height: e.target.value })}
                >
                  <option value="400px">Compact (400px)</option>
                  <option value="500px">Medium (500px)</option>
                  <option value="600px">Large (600px)</option>
                </select>
              </div>

              {/* SLIDES MANAGER */}
              <div className="border-t pt-4">
                <p className="text-sm font-bold text-[#1a3a6b] mb-1">🖼 Hero Slideshow Images / Videos</p>
                <p className="text-xs text-gray-500 mb-3">Add multiple images or YouTube URLs. They auto-rotate every 4 seconds. If empty, the background image above is used.</p>
                <div className="space-y-3">
                  {(hero.slides || []).map((slide, i) => (
                    <div key={i} className="flex gap-2 items-center border rounded-lg p-2 bg-gray-50">
                      {slide.type !== 'video' && slide.url && (
                        <img src={slide.url} alt="" className="w-16 h-12 object-cover rounded flex-shrink-0" onError={(e) => e.target.style.display='none'} />
                      )}
                      {slide.type === 'video' && (
                        <div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 text-white text-xs">▶ Video</div>
                      )}
                      <input
                        className="flex-1 px-3 py-1.5 border rounded text-sm"
                        placeholder="Image URL or YouTube URL"
                        value={slide.url || ''}
                        onChange={(e) => {
                          const slides = [...(hero.slides || [])];
                          const isYT = e.target.value.includes('youtube') || e.target.value.includes('youtu.be');
                          slides[i] = { url: e.target.value, type: isYT ? 'video' : 'image' };
                          setHero({ ...hero, slides });
                        }}
                      />
                      <Button size="sm" variant="destructive" onClick={() => {
                        const slides = [...(hero.slides || [])];
                        slides.splice(i, 1);
                        setHero({ ...hero, slides });
                      }}>✕</Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-300"
                      onClick={() => setHero({ ...hero, slides: [...(hero.slides || []), { url: '', type: 'image' }] })}>
                      + Add Image URL
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300"
                      onClick={() => setHero({ ...hero, slides: [...(hero.slides || []), { url: '', type: 'video' }] })}>
                      + Add YouTube URL
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-300" disabled={uploadingImage}
                      onClick={async () => {
                        const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
                        inp.onchange = async (e) => {
                          const url = await handleImageUpload(e.target.files[0]);
                          if (url) setHero({ ...hero, slides: [...(hero.slides || []), { url, type: 'image' }] });
                        }; inp.click();
                      }}>
                      {uploadingImage ? 'Uploading...' : '📁 Upload'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Badge</p>
                <p className="font-semibold">{hero.badge}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Title</p>
                <p className="font-semibold text-lg">{hero.title} <span className="text-[#d97706]">{hero.highlightedWord}</span></p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Subtitle</p>
                <p>{hero.subtitle}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Background Image</p>
                <img src={hero.backgroundImage} alt="Hero Background" className="h-32 object-cover rounded-lg w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Button 1</p>
                  <p className="font-semibold">{hero.button1Text}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Button 2</p>
                  <p className="font-semibold">{hero.button2Text}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Height</p>
                <p className="font-semibold">{hero.height}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


export const UpdatesTab = ({ api }) => {
  const [updates, setUpdates] = useState([]);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    image: '',
    video: '',
    category: 'news'
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data } = await api.get('/api/updates');
      setUpdates(data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.url;
    } catch (error) {
      toast.error('File upload failed');
      throw error;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        setFormData({ ...formData, image: url });
        toast.success('Image uploaded');
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        setFormData({ ...formData, video: url });
        toast.success('Video uploaded');
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const saveUpdate = async () => {
    try {
      if (editingUpdate) {
        await api.put(`/api/updates/${editingUpdate._id}`, formData);
        toast.success('Update updated successfully');
      } else {
        await api.post('/api/updates', formData);
        toast.success('Update created successfully');
      }
      setFormData({ title: '', description: '', date: '', image: '', video: '', category: 'news' });
      setEditingUpdate(null);
      fetchUpdates();
    } catch (error) {
      toast.error('Failed to save update');
      console.error('Save error:', error);
    }
  };

  const deleteUpdate = async (id) => {
    if (window.confirm('Delete this update?')) {
      try {
        await api.delete(`/api/updates/${id}`);
        toast.success('Update deleted');
        fetchUpdates();
      } catch (error) {
        toast.error('Failed to delete update');
      }
    }
  };

  const startEdit = (update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      description: update.description,
      date: update.date,
      image: update.image || '',
      video: update.video || '',
      category: update.category || 'news'
    });
  };

  const cancelEdit = () => {
    setEditingUpdate(null);
    setFormData({ title: '', description: '', date: '', image: '', video: '', category: 'news' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a3a6b]">Manage Updates</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingUpdate ? 'Edit Update' : 'Create New Update'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <textarea
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Description"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div>
            <label className="block text-sm font-semibold mb-2">Image</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Video (or YouTube URL)</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg mb-2"
              placeholder="YouTube URL"
              value={formData.video}
              onChange={(e) => setFormData({ ...formData, video: e.target.value })}
            />
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveUpdate} className="bg-green-600 hover:bg-green-700">
              {editingUpdate ? 'Update' : 'Create'}
            </Button>
            {editingUpdate && (
              <Button onClick={cancelEdit} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {updates.map((update) => (
          <Card key={update._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{update.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{update.date}</p>
                  <p className="text-gray-700">{update.description}</p>
                  {update.image && (
                    <img src={update.image} alt={update.title} className="mt-3 w-32 h-32 object-cover rounded" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => startEdit(update)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteUpdate(update._id)}>Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const EventsTab = ({ api }) => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    status: 'upcoming',
    image: '',
    googleFormLink: '',
    whatsappGroupLink: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/api/events');
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const { data } = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.url;
    } catch (error) {
      toast.error('File upload failed');
      throw error;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        setFormData({ ...formData, image: url });
        toast.success('Image uploaded');
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const saveEvent = async () => {
    try {
      if (editingEvent) {
        await api.put(`/api/events/${editingEvent.id}`, formData);
        toast.success('Event updated successfully');
      } else {
        await api.post('/api/events', formData);
        toast.success('Event created successfully');
      }
      setFormData({
        title: '', date: '', time: '', location: '', description: '',
        status: 'upcoming', image: '', googleFormLink: '', whatsappGroupLink: ''
      });
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      toast.error('Failed to save event');
      console.error('Save error:', error);
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await api.delete(`/api/events/${id}`);
        toast.success('Event deleted');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      status: event.status || 'upcoming',
      image: event.image || '',
      googleFormLink: event.googleFormLink || '',
      whatsappGroupLink: event.whatsappGroupLink || ''
    });
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setFormData({
      title: '', date: '', time: '', location: '', description: '',
      status: 'upcoming', image: '', googleFormLink: '', whatsappGroupLink: ''
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a3a6b]">Manage Events</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <input
              type="time"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <textarea
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Description"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
          <div>
            <label className="block text-sm font-semibold mb-2">Event Image</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
              )}
            </div>
          </div>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Google Form Link (for registration)"
            value={formData.googleFormLink}
            onChange={(e) => setFormData({ ...formData, googleFormLink: e.target.value })}
          />
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="WhatsApp Group Link"
            value={formData.whatsappGroupLink}
            onChange={(e) => setFormData({ ...formData, whatsappGroupLink: e.target.value })}
          />
          <div className="flex gap-2">
            <Button onClick={saveEvent} className="bg-green-600 hover:bg-green-700">
              {editingEvent ? 'Update' : 'Create'}
            </Button>
            {editingEvent && (
              <Button onClick={cancelEdit} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{event.date} | {event.time}</p>
                  <p className="text-gray-600 mb-2">{event.location}</p>
                  <p className="text-sm text-gray-700">{event.description}</p>
                  {event.image && (
                    <img src={event.image} alt={event.title} className="mt-3 w-32 h-32 object-cover rounded" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => startEdit(event)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.id)}>Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
// ============ REUSABLE MEDIA MANAGER ============
const MediaManager = ({ title, items, setItems, handleImageUpload, uploadingImage, showVideoField = true }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between flex-wrap gap-2">
      <p className="text-sm font-bold text-[#1a3a6b]">{title}</p>
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" className="text-blue-600 border-blue-300"
          onClick={() => setItems([...items, { type: 'image', url: '', title: '' }])}>+ Image URL</Button>
        {showVideoField && (
          <Button size="sm" variant="outline" className="text-red-600 border-red-300"
            onClick={() => setItems([...items, { type: 'video', url: '', title: '' }])}>+ YouTube URL</Button>
        )}
        <Button size="sm" variant="outline" className="text-green-600 border-green-300" disabled={uploadingImage}
          onClick={async () => {
            const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
            inp.onchange = async (e) => {
              const url = await handleImageUpload(e.target.files[0]);
              if (url) setItems([...items, { type: 'image', url, title: '' }]);
            }; inp.click();
          }}>{uploadingImage ? '...' : '📁 Image'}</Button>
        {showVideoField && (
          <Button size="sm" variant="outline" className="text-purple-600 border-purple-300" disabled={uploadingImage}
            onClick={async () => {
              const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'video/*';
              inp.onchange = async (e) => {
                const url = await handleImageUpload(e.target.files[0]);
                if (url) setItems([...items, { type: 'video', url, title: '' }]);
              }; inp.click();
            }}>{uploadingImage ? '...' : '🎥 Video'}</Button>
        )}
      </div>
    </div>
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div key={i} className="border rounded-lg p-3 bg-gray-50 space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${item.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {item.type === 'video' ? '▶ Video' : '🖼 Image'}
            </span>
            <Button size="sm" variant="destructive" className="h-6 w-6 p-0"
              onClick={() => { const n = [...items]; n.splice(i, 1); setItems(n); }}>✕</Button>
          </div>
          <input className="w-full px-2 py-1.5 border rounded text-sm" placeholder="Title"
            value={item.title || ''} onChange={(e) => { const n = [...items]; n[i].title = e.target.value; setItems(n); }} />
          <input className="w-full px-2 py-1.5 border rounded text-sm" placeholder={item.type === 'video' ? 'YouTube URL' : 'Image URL'}
            value={item.url || ''} onChange={(e) => { const n = [...items]; n[i].url = e.target.value; setItems(n); }} />
          {item.type === 'image' && item.url && (
            <img src={item.url} alt="" className="w-full h-24 object-cover rounded" onError={(e) => e.target.style.display='none'} />
          )}
        </div>
      ))}
    </div>
    {items.length === 0 && (
      <div className="text-center py-8 border-2 border-dashed rounded-lg text-gray-400 text-sm">
        No items yet. Click the buttons above to add images or videos.
      </div>
    )}
  </div>
);

const PdfManager = ({ pdfs, setPdfs }) => (
  <div className="space-y-3">
    <p className="text-sm font-bold text-[#1a3a6b]">📄 PDF Attachments</p>
    {pdfs.map((pdf, i) => (
      <div key={i} className="flex gap-2 items-center">
        <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="PDF Title"
          value={pdf.title || ''} onChange={(e) => { const p = [...pdfs]; p[i].title = e.target.value; setPdfs(p); }} />
        <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="PDF URL (Google Drive link etc.)"
          value={pdf.url || ''} onChange={(e) => { const p = [...pdfs]; p[i].url = e.target.value; setPdfs(p); }} />
        <Button size="sm" variant="destructive"
          onClick={() => { const p = [...pdfs]; p.splice(i, 1); setPdfs(p); }}>✕</Button>
      </div>
    ))}
    <Button size="sm" variant="outline" className="text-red-600 border-red-300"
      onClick={() => setPdfs([...pdfs, { title: '', url: '' }])}>+ Add PDF</Button>
  </div>
);

// ============ TAPOVAN TAB ============
export const TapovanTab = ({ api, handleImageUpload, uploadingImage }) => {
  const [pageData, setPageData] = useState({ title: 'Tapovan Vidyalay', subtitle: '', description: '', image: '', images: [], videos: [], pdfs: [] });
  const [schools, setSchools] = useState([]);
  const [editingPage, setEditingPage] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null); // null | 'new' | index
  const [schoolForm, setSchoolForm] = useState({ name: '', location: '', image: '', description: '', websiteLink: '', order: 0 });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('schools'); // 'schools' | 'page'

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [pageRes, schoolsRes] = await Promise.all([
        api.get('/api/pages/tapovan').catch(() => ({ data: {} })),
        api.get('/api/tapovan-schools').catch(() => ({ data: [] }))
      ]);
      if (pageRes.data) setPageData(prev => ({ ...prev, ...pageRes.data }));
      setSchools(schoolsRes.data || []);
    } catch (e) { console.error(e); }
  };

  const savePage = async () => {
    setSaving(true);
    try {
      await api.put('/api/pages/tapovan', pageData);
      toast.success('Page content saved!');
      setEditingPage(false);
    } catch (e) { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const saveSchool = async () => {
    setSaving(true);
    try {
      if (editingSchool === 'new') {
        await api.post('/api/tapovan-schools', schoolForm);
        toast.success('School added!');
      } else {
        const school = schools[editingSchool];
        await api.put(`/api/tapovan-schools/${school._id}`, schoolForm);
        toast.success('School updated!');
      }
      setEditingSchool(null);
      fetchAll();
    } catch (e) { toast.error('Failed to save school'); }
    finally { setSaving(false); }
  };

  const deleteSchool = async (id) => {
    if (!window.confirm('Delete this school?')) return;
    try {
      await api.delete(`/api/tapovan-schools/${id}`);
      toast.success('School deleted');
      fetchAll();
    } catch (e) { toast.error('Failed to delete'); }
  };

  const openEditSchool = (index) => {
    const s = schools[index];
    setSchoolForm({ name: s.name||'', location: s.location||'', image: s.image||'', description: s.description||'', websiteLink: s.websiteLink||'', order: s.order||0 });
    setEditingSchool(index);
  };

  const openNewSchool = () => {
    setSchoolForm({ name: '', location: '', image: '', description: '', websiteLink: '', order: schools.length });
    setEditingSchool('new');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a3a6b]">Tapovan Vidyalay</h2>

      {/* Tab switcher */}
      <div className="flex gap-2 border-b pb-2">
        <button onClick={() => setActiveTab('schools')}
          className={`px-4 py-2 rounded-t text-sm font-semibold ${activeTab === 'schools' ? 'bg-[#1a3a6b] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          🏫 Schools ({schools.length})
        </button>
        <button onClick={() => setActiveTab('page')}
          className={`px-4 py-2 rounded-t text-sm font-semibold ${activeTab === 'page' ? 'bg-[#1a3a6b] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          📄 Page Content
        </button>
      </div>

      {/* SCHOOLS TAB */}
      {activeTab === 'schools' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Manage individual Tapovan Vidyalay branches shown on the public page.</p>
            <Button onClick={openNewSchool} className="bg-[#d97706] hover:bg-[#b45309]">+ Add School</Button>
          </div>

          {/* School Form */}
          {editingSchool !== null && (
            <Card className="border-2 border-[#d97706]/40">
              <CardHeader><CardTitle className="text-lg">{editingSchool === 'new' ? 'Add New School' : 'Edit School'}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">School Name *</label>
                    <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Bhiwandi Tapovan"
                      value={schoolForm.name} onChange={e => setSchoolForm({...schoolForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
                    <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Bhiwandi, Maharashtra"
                      value={schoolForm.location} onChange={e => setSchoolForm({...schoolForm, location: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Main Image</label>
                  <div className="flex gap-2">
                    <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="Image URL"
                      value={schoolForm.image} onChange={e => setSchoolForm({...schoolForm, image: e.target.value})} />
                    <Button size="sm" className="bg-blue-500" disabled={uploadingImage}
                      onClick={async () => {
                        const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
                        inp.onchange = async (e) => {
                          const url = await handleImageUpload(e.target.files[0]);
                          if (url) setSchoolForm(f => ({...f, image: url}));
                        }; inp.click();
                      }}>{uploadingImage ? '...' : '📁'}</Button>
                  </div>
                  {schoolForm.image && <img src={schoolForm.image} alt="" className="mt-2 h-28 object-cover rounded" />}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                  <textarea rows="4" className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="About this school branch..."
                    value={schoolForm.description} onChange={e => setSchoolForm({...schoolForm, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Website Link</label>
                    <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..."
                      value={schoolForm.websiteLink} onChange={e => setSchoolForm({...schoolForm, websiteLink: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Display Order</label>
                    <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm"
                      value={schoolForm.order} onChange={e => setSchoolForm({...schoolForm, order: parseInt(e.target.value)||0})} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button onClick={saveSchool} disabled={saving} className="bg-green-600">
                    <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save School'}
                  </Button>
                  <Button onClick={() => setEditingSchool(null)} variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schools Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school, i) => (
              <Card key={school._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-36 bg-gray-100">
                  {school.image
                    ? <img src={school.image} alt={school.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                    : <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🏫</div>
                  }
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900">{school.name}</h3>
                  {school.location && <p className="text-xs text-gray-500 mb-2">📍 {school.location}</p>}
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{school.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => openEditSchool(i)}>
                      <Edit className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" className="text-xs" onClick={() => deleteSchool(school._id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {schools.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed rounded-lg text-gray-400">
              No schools added yet. Click "+ Add School" to get started.
            </div>
          )}
        </div>
      )}

      {/* PAGE CONTENT TAB */}
      {activeTab === 'page' && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Edit the main Tapovan page heading, intro text, and media.</p>
            {!editingPage
              ? <Button onClick={() => setEditingPage(true)} className="bg-[#1a3a6b]"><Edit className="w-4 h-4 mr-2" />Edit</Button>
              : <div className="flex gap-2">
                  <Button onClick={savePage} disabled={saving} className="bg-green-600"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save'}</Button>
                  <Button onClick={() => { setEditingPage(false); fetchAll(); }} variant="outline">Cancel</Button>
                </div>
            }
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              {editingPage ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Page Title</label>
                      <input className="w-full px-3 py-2 border rounded-lg text-sm" value={pageData.title}
                        onChange={e => setPageData({...pageData, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
                      <input className="w-full px-3 py-2 border rounded-lg text-sm" value={pageData.subtitle||''}
                        onChange={e => setPageData({...pageData, subtitle: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Introduction Text</label>
                    <textarea rows="4" className="w-full px-3 py-2 border rounded-lg text-sm" value={pageData.description||''}
                      onChange={e => setPageData({...pageData, description: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Main Image</label>
                    <div className="flex gap-2">
                      <input className="flex-1 px-3 py-2 border rounded-lg text-sm" value={pageData.image||''}
                        onChange={e => setPageData({...pageData, image: e.target.value})} />
                      <Button size="sm" className="bg-blue-500" disabled={uploadingImage}
                        onClick={async () => { const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange=async(e)=>{ const url=await handleImageUpload(e.target.files[0]); if(url) setPageData(d=>({...d,image:url})); }; inp.click(); }}>
                        {uploadingImage ? '...' : '📁'}
                      </Button>
                    </div>
                    {pageData.image && <img src={pageData.image} alt="" className="mt-2 h-24 object-cover rounded" />}
                  </div>
                  <div className="border-t pt-4">
                    <MediaManager title="Extra Gallery" items={pageData.images||[]} setItems={imgs=>setPageData({...pageData,images:imgs})} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} />
                  </div>
                  <div className="border-t pt-4">
                    <PdfManager pdfs={pageData.pdfs||[]} setPdfs={pdfs=>setPageData({...pageData,pdfs})} />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{pageData.title}</h3>
                  <p className="text-gray-600 text-sm">{pageData.subtitle}</p>
                  <p className="text-gray-700 text-sm">{pageData.description || 'No intro text yet.'}</p>
                  {pageData.image && <img src={pageData.image} alt="" className="h-24 object-cover rounded" />}
                  <div className="flex gap-4 text-sm text-gray-500 pt-2">
                    <span>📷 {(pageData.images||[]).length} gallery items</span>
                    <span>📄 {(pageData.pdfs||[]).length} PDFs</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// ============ GURUDEV TAB ============
export const GurudevTab = ({ api, handleImageUpload, uploadingImage }) => {
  const [data, setData] = useState({ title: 'About Gurudev', subtitle: 'P.P.P. Chandrashekharvijaiyji M.S.', description: '', image: '', images: [], videos: [], pdfs: [] });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/pages/gurudev');
      if (res.data) setData(prev => ({ ...prev, ...res.data }));
    } catch (e) { console.log('No gurudev data yet'); }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/api/pages/gurudev', data);
      toast.success('Gurudev page saved!');
      setEditing(false);
    } catch (e) { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a3a6b]">Gurudev Page</h2>
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="bg-[#1a3a6b]"><Edit className="w-4 h-4 mr-2" />Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving} className="bg-green-600"><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save'}</Button>
            <Button onClick={() => { setEditing(false); fetchData(); }} variant="outline">Cancel</Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          {editing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Page Title</label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle / Name</label>
                  <input className="w-full px-3 py-2 border rounded-lg text-sm" value={data.subtitle || ''} onChange={e => setData({...data, subtitle: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Biography / Description</label>
                <textarea rows="6" className="w-full px-3 py-2 border rounded-lg text-sm" value={data.description || ''} onChange={e => setData({...data, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Main Photo</label>
                <div className="flex gap-2">
                  <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="https://..." value={data.image || ''} onChange={e => setData({...data, image: e.target.value})} />
                  <Button size="sm" className="bg-blue-500" disabled={uploadingImage}
                    onClick={async () => { const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange=async(e)=>{ const url=await handleImageUpload(e.target.files[0]); if(url) setData({...data,image:url}); }; inp.click(); }}>
                    {uploadingImage ? '...' : '📁'}
                  </Button>
                </div>
                {data.image && <img src={data.image} alt="" className="mt-2 h-32 object-cover rounded" />}
              </div>
              <div className="border-t pt-4">
                <MediaManager title="📷 Photo Gallery" items={data.images||[]} setItems={imgs => setData({...data, images: imgs})} handleImageUpload={handleImageUpload} uploadingImage={uploadingImage} />
              </div>
              <div className="border-t pt-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">Pravachan / Discourse Videos (YouTube)</label>
                {(data.videos||[]).map((v, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="YouTube URL" value={v}
                      onChange={e => { const vs=[...(data.videos||[])]; vs[i]=e.target.value; setData({...data,videos:vs}); }} />
                    <Button size="sm" variant="destructive" onClick={() => { const vs=[...(data.videos||[])]; vs.splice(i,1); setData({...data,videos:vs}); }}>✕</Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="text-purple-600 border-purple-300"
                  onClick={() => setData({...data, videos: [...(data.videos||[]), '']})}>+ Add Video</Button>
              </div>
              <div className="border-t pt-4">
                <PdfManager pdfs={data.pdfs||[]} setPdfs={pdfs => setData({...data, pdfs})} />
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xl font-bold">{data.title}</h3>
              <p className="text-amber-600 font-medium text-sm">{data.subtitle}</p>
              <p className="text-gray-700 text-sm">{data.description || 'No content yet. Click Edit to add.'}</p>
              {data.image && <img src={data.image} alt="" className="h-32 object-cover rounded" />}
              <div className="flex gap-4 text-sm text-gray-500">
                <span>📷 {(data.images||[]).length} photos</span>
                <span>🎥 {(data.videos||[]).length} videos</span>
                <span>📄 {(data.pdfs||[]).length} PDFs</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============ MEDIA PAGE TAB ============
export const MediaPageTab = ({ api, handleImageUpload, uploadingImage }) => {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/api/gallery');
      setItems(data || []);
    } catch (e) { console.error(e); }
  };

  const addItem = (type) => {
    setItems([...items, { type, url: '', title: '', category: 'general' }]);
  };

  const deleteItem = async (id, index) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      if (id) await api.delete(`/api/gallery/${id}`);
      const n = [...items]; n.splice(index, 1); setItems(n);
      toast.success('Deleted');
    } catch (e) { toast.error('Failed to delete'); }
  };

  const saveItem = async (item, index) => {
    setSaving(true);
    try {
      if (item._id) {
        await api.put(`/api/gallery/${item._id}`, item);
      } else {
        const { data } = await api.post('/api/gallery', item);
        const n = [...items]; n[index] = data; setItems(n);
      }
      toast.success('Saved!');
      fetchItems();
    } catch (e) { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-[#1a3a6b]">Media & Gallery Page</h2>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" className="bg-blue-500" onClick={() => addItem('image')}>+ Image URL</Button>
          <Button size="sm" className="bg-red-500" onClick={() => addItem('video')}>+ YouTube URL</Button>
          <Button size="sm" className="bg-green-600" disabled={uploadingImage}
            onClick={async () => {
              const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
              inp.onchange = async (e) => {
                const url = await handleImageUpload(e.target.files[0]);
                if (url) setItems([...items, { type: 'image', url, title: '', category: 'general' }]);
              }; inp.click();
            }}>{uploadingImage ? 'Uploading...' : '📁 Upload Image'}</Button>
          <Button size="sm" className="bg-purple-600" disabled={uploadingImage}
            onClick={async () => {
              const inp = document.createElement('input'); inp.type='file'; inp.accept='video/*';
              inp.onchange = async (e) => {
                const url = await handleImageUpload(e.target.files[0]);
                if (url) setItems([...items, { type: 'video', url, title: '', category: 'general' }]);
              }; inp.click();
            }}>{uploadingImage ? 'Uploading...' : '🎥 Upload Video'}</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <Card key={item._id || i} className="overflow-hidden">
            <div className="relative h-36 bg-gray-100">
              {item.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-sm">▶ Video</div>
              ) : item.url ? (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
              )}
              <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded font-bold text-white ${item.type === 'video' ? 'bg-red-500' : 'bg-blue-500'}`}>
                {item.type === 'video' ? 'Video' : 'Photo'}
              </span>
            </div>
            <CardContent className="p-3 space-y-2">
              <input className="w-full px-2 py-1.5 border rounded text-sm" placeholder="Title"
                value={item.title || ''} onChange={e => { const n=[...items]; n[i].title=e.target.value; setItems(n); }} />
              <input className="w-full px-2 py-1.5 border rounded text-sm" placeholder={item.type==='video'?'YouTube URL':'Image URL'}
                value={item.url || ''} onChange={e => { const n=[...items]; n[i].url=e.target.value; setItems(n); }} />
              <select className="w-full px-2 py-1.5 border rounded text-sm"
                value={item.category || 'general'} onChange={e => { const n=[...items]; n[i].category=e.target.value; setItems(n); }}>
                <option value="general">General</option>
                <option value="bhakti">Bhakti</option>
                <option value="service">Service</option>
                <option value="education">Education</option>
                <option value="events">Events</option>
              </select>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-green-600 text-xs" disabled={saving} onClick={() => saveItem(item, i)}>
                  {item._id ? 'Update' : 'Save'}
                </Button>
                <Button size="sm" variant="destructive" className="text-xs" onClick={() => deleteItem(item._id, i)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg text-gray-400">
          No media items yet. Add images or YouTube videos above.
        </div>
      )}
    </div>
  );
};

// ============ DONATION CATEGORIES TAB ============
export const DonationCategoriesTab = ({ api }) => {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', nameHindi: '', description: '', order: 0, active: true });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchCats(); }, []); // eslint-disable-line

  const fetchCats = async () => {
    try {
      const { data } = await api.get('/api/donation-categories');
      setCats(data || []);
    } catch (e) { toast.error('Failed to load categories'); }
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/donation-categories/${editingId}`, form);
        toast.success('Category updated!');
      } else {
        await api.post('/api/donation-categories', form);
        toast.success('Category added!');
      }
      setForm({ name: '', nameHindi: '', description: '', order: cats.length, active: true });
      setShowForm(false);
      setEditingId(null);
      fetchCats();
    } catch (e) { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const deleteCat = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/api/donation-categories/${id}`);
      toast.success('Deleted');
      fetchCats();
    } catch (e) { toast.error('Failed to delete'); }
  };

  const editCat = (cat) => {
    setForm({ name: cat.name, nameHindi: cat.nameHindi || '', description: cat.description || '', order: cat.order || 0, active: cat.active !== false });
    setEditingId(cat._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1a3a6b]">Donation Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the categories shown on the Donate page. Donors can enter amounts per category.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', nameHindi: '', description: '', order: cats.length, active: true }); }}
          className="bg-[#d97706] hover:bg-[#b45309]">
          {showForm ? 'Cancel' : '+ Add Category'}
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-[#d97706]/30">
          <CardHeader><CardTitle>{editingId ? 'Edit Category' : 'New Category'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">English Name *</label>
                <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Jeevdaya"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Hindi/Gujarati Name *</label>
                <input className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. जीवदया"
                  value={form.nameHindi} onChange={e => setForm({ ...form, nameHindi: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Display Order</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Active (visible to donors)</span>
                </label>
              </div>
            </div>
            <Button onClick={save} disabled={saving || !form.name} className="bg-green-600 hover:bg-green-700 w-full">
              <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : editingId ? 'Update Category' : 'Add Category'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map((cat, i) => (
          <Card key={cat._id} className={`hover:shadow-lg transition-shadow ${!cat.active ? 'opacity-50' : ''}`}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-lg font-bold text-gray-900">{cat.nameHindi || cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.active ? 'Active' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">Order: {cat.order}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => editCat(cat)}>
                  <Edit className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteCat(cat._id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cats.length === 0 && !showForm && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg text-gray-400">
          No categories yet. Click "+ Add Category" to create donation categories.
        </div>
      )}
    </div>
  );
};
