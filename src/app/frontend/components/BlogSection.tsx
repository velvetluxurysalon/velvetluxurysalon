import { User, ArrowRight, BookOpen, Sparkles, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getBlogPosts } from "../services/contentService";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  published: boolean;
}

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      const publishedPosts = data.filter(post => post.published).slice(0, 4);
      setBlogPosts(publishedPosts);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    // In a real app, you might navigate to a blog detail page
    // For now, we could open a modal or scroll to the post
  };

  const handleViewAllArticles = () => {
    // Navigate to full blog page or show all posts
    window.location.href = "#blog";
  };

  const defaultBlogPosts: BlogPost[] = [];

  const displayPosts = blogPosts.length > 0 ? blogPosts : defaultBlogPosts;

  if (loading) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,0,255,0.1),transparent_70%)]" />
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-purple-400 animate-pulse">Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-gray-400 text-lg">No blog posts available yet. Check back soon!</p>
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
        {[...Array(15)].map((_, i) => (
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
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Beauty Journal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Beauty Tips & Insights
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Expert advice and inspiration from our professional team
          </p>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
              
              <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium rounded-full shadow-lg">
                      {post.category}
                    </span>
                  </div>
                  
                  {/* Read time */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full">
                    <Clock className="w-3 h-3 text-white" />
                    <span className="text-xs text-white">5 min</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-300">{post.author}</span>
                  </div>

                  {/* CTA */}
                  <button 
                    onClick={() => handleReadMore(post)}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all group/btn font-medium"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12 sm:mt-16">
          <button 
            onClick={handleViewAllArticles}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            View All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
