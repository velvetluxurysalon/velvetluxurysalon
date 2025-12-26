import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading team members...</p>
        </div>
      </section>
    );
  }

  if (displayTeam.length === 0) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-lg">No team members available at the moment.</p>
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

                <Button className="w-full" onClick={() => onBookStylist && onBookStylist(member.id)}>
                  Book with {member.name.split(' ')[0]}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
