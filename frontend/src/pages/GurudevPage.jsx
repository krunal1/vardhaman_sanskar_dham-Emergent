import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Heart, Book, Users, Globe } from 'lucide-react';

const GurudevPage = () => {
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Gurudev</h1>
          <p className="text-lg text-amber-400">
            P.P.P. Chandrashekharvijaiyji M.S.
          </p>
          <p className="text-gray-300 mt-2">
            Our Spiritual Guide and Inspiration
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                P.P.P. Chandrashekharvijaiyji M.S. has been the guiding light and spiritual inspiration 
                behind Vardhman Sanskar Dham. His teachings emphasize compassion, service to humanity,
                and the preservation of cultural and spiritual values.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Under his divine guidance, the organization has grown from a small initiative to a 
                comprehensive service organization touching thousands of lives through various humanitarian
                and spiritual activities.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                His vision of creating a compassionate society where spiritual values blend with social service
                continues to inspire our every endeavor.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <Heart className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Compassion</h3>
              <p className="text-gray-300">
                Teaching love and compassion towards all living beings through action and example.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <Book className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Spiritual Knowledge</h3>
              <p className="text-gray-300">
                Spreading timeless spiritual wisdom and Jain philosophy for inner peace and enlightenment.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <Users className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Community Service</h3>
              <p className="text-gray-300">
                Inspiring thousands to serve society and uplift the underprivileged.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <Globe className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Global Impact</h3>
              <p className="text-gray-300">
                Reaching communities far and wide with messages of peace, harmony, and spiritual growth.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GurudevPage;
