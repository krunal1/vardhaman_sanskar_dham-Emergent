import React, { useState, useEffect } from 'react';
import { User, Users, MessageSquare, DollarSign, Sparkles, Calendar, Upload } from 'lucide-react';
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
              <Button variant="destructive" size="sm" onClick={() => deleteUser(u._id)}>Delete</Button>
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
  const [hero, setHero] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data } = await api.get('/api/hero');
      setHero(data);
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

  if (!hero) return <div>Loading...</div>;

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
        await api.put(`/api/updates/${editingUpdate.id}`, formData);
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
          <Card key={update.id}>
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
                  <Button size="sm" variant="destructive" onClick={() => deleteUpdate(update.id)}>Delete</Button>
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
