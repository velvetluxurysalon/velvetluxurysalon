import { Button } from "./ui/button";
import { Facebook, Instagram, Twitter, Sparkles, Star, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { getStaff } from "../services/firebaseService";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  experience: string;
  bio: string;
  image: string;
}

interface TeamSectionProps {
  onBookStylist?: (stylistId: string) => void;
}

export default function TeamSection({ onBookStylist }: TeamSectionProps) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await getStaff();
      setTeam(data);
    } catch (error) {
      console.error("Error loading team members:", error);
    } finally {
      setLoading(false);
    }
  };


  const displayTeam = team;

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,0,255,0.15),transparent_70%)]" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-purple-400 animate-pulse">Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayTeam.length === 0) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 relative">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-lg">No team members available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,0,255,0.15),transparent_50%)]" />
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Expert Stylists</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Meet Our Expert Team
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Passionate professionals dedicated to bringing out your natural beauty
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayTeam.map((member, index) => (
            <div 
              key={member.id} 
              className="group relative"
              onMouseEnter={() => setHoveredId(member.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card */}
              <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
                {/* Image container */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  
                  {/* Experience badge */}
                  <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-white">{member.experience}</span>
                  </div>
                  
                  {/* Social links on hover */}
                  <div className={`absolute top-4 left-4 flex flex-col gap-2 transition-all duration-500 ${hoveredId === member.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                    <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/10">
                      <Facebook className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/10">
                      <Instagram className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors border border-white/10">
                      <Twitter className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-sm text-purple-300 font-medium">{member.role}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{member.bio}</p>
                  
                  {/* Specialties */}
                  <div className="mb-5">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {(member.specialties || []).slice(0, 3).map((specialty, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs font-medium border border-purple-500/20"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Book button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 group/btn"
                    onClick={() => onBookStylist && onBookStylist(member.id)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book with {member.name.split(' ')[0]}
                  </Button>
                </div>
              </div>
              
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl transition-opacity duration-500 -z-10 ${hoveredId === member.id ? 'opacity-100' : 'opacity-0'}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
