import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { GraduationCap, BookOpen, Users, Award, ArrowLeft, Heart } from 'lucide-react';

const TapovanPage = () => {
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

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-400/30 border">Education Initiative</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Tapovan Vidyalay</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Education with Values — Shaping Future Leaders with Knowledge, Character, and Spiritual Growth
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: GraduationCap, value: '500+', label: 'Students' },
            { icon: Users, value: '30+', label: 'Teachers' },
            { icon: BookOpen, value: '15+', label: 'Years of Service' },
            { icon: Award, value: '10+', label: 'Awards Won' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-amber-500/10 border-amber-400/30 text-center">
              <CardContent className="p-5 sm:p-6">
                <stat.icon className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardContent className="p-6 sm:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">About Tapovan Vidyalay</h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Tapovan Vidyalay is our educational initiative dedicated to providing quality education
                  rooted in traditional values and modern pedagogy. Established under the inspiration of
                  P.P.P. Chandrashekharvijaiyji M.S., it combines ancient wisdom with contemporary learning methods.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  We believe in nurturing not just academic excellence but also the moral and spiritual development
                  of every student — preparing them to be compassionate, responsible citizens.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Values-Based Learning', desc: 'Academic excellence with Jain principles and ethical values integrated throughout the curriculum.' },
                  { title: 'Holistic Development', desc: 'Sports, arts, meditation, and cultural activities complement academic learning.' },
                  { title: 'Community Focus', desc: 'Students actively participate in NGO activities, learning the spirit of service from an early age.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-amber-400 font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'Our Curriculum',
              desc: 'A balanced blend of CBSE/SSC standards with traditional values. Subjects include Jain studies, Sanskrit, and values education alongside core academics.',
            },
            {
              title: 'Facilities',
              desc: 'Well-equipped classrooms, library with 5000+ books, computer lab, sports ground, and a dedicated meditation and prayer hall.',
            },
            {
              title: 'Admissions',
              desc: 'Admissions are open for the new academic year. Merit-based scholarships available for deserving students. Contact us for more information.',
            },
          ].map((item) => (
            <Card key={item.title} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-amber-400 mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#d97706]/20 to-amber-500/10 border-[#d97706]/40 text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-3">Support Our Education Initiative</h3>
            <p className="text-gray-300 mb-6">Help us provide quality education to more students by supporting Tapovan Vidyalay.</p>
            <Button
              className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold px-8 py-3"
              onClick={() => navigate('/donate')}
            >
              <Heart className="w-4 h-4 mr-2" /> Donate Now
            </Button>
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

export default TapovanPage;
