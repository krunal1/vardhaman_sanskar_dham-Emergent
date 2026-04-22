import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UpdateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdateDetail();
  }, [id]);

  const fetchUpdateDetail = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/updates/${id}`);
      setUpdate(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching update:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!update) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Update Not Found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Badge className="mb-4 bg-blue-500">{update.category || 'News'}</Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{update.title}</h1>
        
        <div className="flex items-center gap-2 text-gray-600 mb-8">
          <Calendar className="w-4 h-4" />
          <span>{update.date}</span>
        </div>

        {update.image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={update.image} 
              alt={update.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {update.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateDetailPage;
