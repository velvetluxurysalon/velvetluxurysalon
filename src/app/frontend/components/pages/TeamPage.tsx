import { useEffect, useState } from "react";
import { Mail, Phone, Linkedin, Award, Sparkles, Heart } from "lucide-react";
import { getTeamMembers, TeamMember } from "../../services/contentService";
import TeamSection from "../TeamSection";

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const members = await getTeamMembers();
        setTeam(members);
      } catch (error) {
        console.error("Error loading team:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, []);

  return (
    <>
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100 bg-gradient-to-br from-white via-rose-50/20 to-white">
        <div className="max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            The Experts
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            Meet Our <span className="text-rose-600">Team</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Passionate professionals dedicated to making you look and feel your
            best.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6 sm:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-slate-100 rounded-sm animate-pulse"
                />
              ))}
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500">No team members found yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="group bg-white rounded-sm border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-32 sm:h-36 bg-gradient-to-br from-violet-400 to-fuchsia-400 relative">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute -bottom-8 left-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-4 ring-white flex items-center justify-center shadow-lg">
                        <span className="text-white font-extrabold text-lg">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-12 px-5 pb-5">
                    <h3 className="text-[16px] font-bold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-[12px] font-semibold text-violet-600 mb-2">
                      {member.role}
                    </p>
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {member.specialties?.slice(0, 3).map((sp, si) => (
                        <span
                          key={si}
                          className="px-2.5 py-1 bg-violet-50 text-violet-700 text-[11px] font-semibold rounded-lg"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button className="flex-1 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors flex items-center justify-center">
                        <Mail size={16} />
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors flex items-center justify-center">
                        <Phone size={16} />
                      </button>
                      <button className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center">
                        <Linkedin size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-14 md:py-20 px-6 sm:px-10 lg:px-16 bg-gradient-to-br from-violet-50/60 to-fuchsia-50/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Award,
                title: "Certified Experts",
                desc: "Internationally trained and industry-certified professionals.",
              },
              {
                icon: Sparkles,
                title: "Latest Techniques",
                desc: "Continuously updated with global beauty trends and methods.",
              },
              {
                icon: Heart,
                title: "Genuine Care",
                desc: "Every client receives personalized attention and care.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-violet-600" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section with Slider */}
      <TeamSection />
    </>
  );
}
