import React, { useState, useEffect } from 'react';
import { User, Users, MessageSquare, DollarSign } from 'lucide-react';
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
