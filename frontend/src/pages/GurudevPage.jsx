import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Heart, Book, Users, Globe, ArrowLeft, Star } from 'lucide-react';

const GurudevPage = () => {
  const navigate = useNavigate();

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-400/30 border">Spiritual Guide</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">About Gurudev</h1>
          <p className="text-lg text-amber-400 font-semibold">P.P.P. Chandrashekharvijaiyji M.S.</p>
          <p className="text-gray-300 mt-2">Our Spiritual Guide and Eternal Inspiration</p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardContent className="p-6 sm:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">A Beacon of Compassion</h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  P.P.P. Chandrashekharvijaiyji M.S. has been the guiding light and spiritual inspiration
                  behind Vardhman Sanskar Dham. His teachings emphasize compassion, service to humanity,
                  and the preservation of cultural and spiritual values rooted in Jain philosophy.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Under his divine guidance, the organization has grown from a small initiative to a
                  comprehensive service organization touching thousands of lives across Maharashtra and beyond
                  through various humanitarian and spiritual activities.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  His vision of Ahimsa (non-violence), Karuna (compassion), and Seva (selfless service) continues
                  to inspire the work of Vardhman Sanskar Dham every single day — from saving animals from slaughter
                  to educating children with values.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Teachings */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {[
            {
              icon: Heart,
              title: 'Ahimsa (Non-Violence)',
              desc: 'Complete non-violence towards all living beings — the foundation of every initiative under Gurudev\'s guidance, including the rescue of 2.30 lakh+ animals.'
            },
            {
              icon: Book,
              title: 'Education & Values',
              desc: 'Knowledge should uplift not just the mind but the soul. Gurudev established Tapovan Vidyalay to impart values-based education to future generations.'
            },
            {
              icon: Users,
              title: 'Seva (Service)',
              desc: 'Selfless service as a spiritual path. From Chaturmasik Chovihar schemes to daily tiffin service for the elderly — all inspired by his teachings.'
            },
            {
              icon: Globe,
              title: 'Universal Compassion',
              desc: 'Sending teams across India and abroad for Paryushan Aradhana, ensuring every Jain community has access to spiritual guidance regardless of location.'
            },
          ].map((item) => (
            <Card key={item.title} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-400 mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-amber-900/30 to-amber-800/10 border-amber-500/30 text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-3">Continue His Mission</h3>
            <p className="text-gray-300 mb-6">Support the work inspired by Gurudev's teachings and help us serve more people.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-6 py-3"
                onClick={() => navigate('/donate')}
              >
                <Heart className="w-4 h-4 mr-2" /> Donate Now
              </Button>
              <Button
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10"
                onClick={() => navigate('/activities')}
              >
                View Our Activities
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

export default GurudevPage;
