import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';

const TapovanPage = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Tapovan Vidyalay</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Education with Values - Shaping Future Leaders
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About Tapovan Vidyalay</h2>
                <p className="text-gray-300 mb-4">
                  Tapovan Vidyalay is our educational initiative dedicated to providing quality education
                  rooted in traditional values and modern pedagogy.
                </p>
                <p className="text-gray-300">
                  We believe in nurturing not just academic excellence but also moral and spiritual development
                  of every student.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-amber-500/10 border-amber-400/30 text-center p-6">
                  <GraduationCap className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-gray-300">Students</p>
                </Card>
                <Card className="bg-amber-500/10 border-amber-400/30 text-center p-6">
                  <Users className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">30+</p>
                  <p className="text-sm text-gray-300">Teachers</p>
                </Card>
                <Card className="bg-amber-500/10 border-amber-400/30 text-center p-6">
                  <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">15+</p>
                  <p className="text-sm text-gray-300">Years</p>
                </Card>
                <Card className="bg-amber-500/10 border-amber-400/30 text-center p-6">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">10+</p>
                  <p className="text-sm text-gray-300">Awards</p>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">Our Curriculum</h3>
              <p className="text-gray-300">
                A balanced blend of modern education and traditional values, preparing students for both
                academic and spiritual growth.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">Facilities</h3>
              <p className="text-gray-300">
                Well-equipped classrooms, library, computer lab, sports facilities, and meditation hall
                for holistic development.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-3">Admissions</h3>
              <p className="text-gray-300">
                Admissions are open throughout the year. Contact us for more information about enrollment
                and scholarship opportunities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TapovanPage;
