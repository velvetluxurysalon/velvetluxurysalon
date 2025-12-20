import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import { getTeamMembers } from "../services/contentService";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  experience: string;
  bio: string;
  image: string;
}

export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await getTeamMembers();
      setTeam(data);
    } catch (error) {
      console.error("Error loading team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultTeam = [
    {
      id: '1',
      name: "Sarah Johnson",
      role: "Master Stylist",
      specialties: ["Hair Coloring", "Balayage", "Extensions"],
      experience: "12 years",
      bio: "Award-winning stylist specializing in creative color transformations",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    },
    {
      id: '2',
      name: "Michael Chen",
      role: "Senior Barber",
      specialties: ["Men's Cuts", "Beard Styling", "Hot Shaves"],
      experience: "10 years",
      bio: "Expert in classic and modern men's grooming techniques",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      id: '3',
      name: "Emma Williams",
      role: "Spa Therapist",
      specialties: ["Facial Treatments", "Body Massage", "Aromatherapy"],
      experience: "8 years",
      bio: "Certified therapist focused on holistic wellness and relaxation",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      id: '4',
      name: "Jessica Lee",
      role: "Nail Artist",
      specialties: ["Nail Art", "Gel Extensions", "Spa Manicure"],
      experience: "7 years",
      bio: "Creative nail artist known for intricate designs and attention to detail",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    }
  ];

  const displayTeam = team.length > 0 ? team : defaultTeam;

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading team members...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Meet Our Expert Team</h2>
          <p className="text-xl text-gray-600">Passionate professionals dedicated to your beauty</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTeam.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="text-xl">{member.name}</h3>
                  <p className="text-sm text-gray-200">{member.role}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-purple-600 mb-2">{member.experience} experience</p>
                  <p className="text-sm text-gray-600 mb-3">{member.bio}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {(member.specialties || []).map((specialty, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Facebook className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Instagram className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Twitter className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <Button className="w-full">Book with {member.name.split(' ')[0]}</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
