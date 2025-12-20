import { Card } from "./ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
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

  const defaultBlogPosts = [
    {
      id: '1',
      title: "Top 10 Hair Color Trends for 2026",
      excerpt: "Discover the hottest hair color trends that are taking the beauty world by storm this year...",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
      author: "Sarah Johnson",
      category: "Hair Care",
      published: true
    },
    {
      id: '2',
      title: "The Ultimate Guide to Skincare Routines",
      excerpt: "Learn how to create the perfect skincare routine for your skin type and achieve that healthy glow...",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=400&fit=crop",
      author: "Emma Williams",
      category: "Skincare",
      published: true
    },
    {
      id: '3',
      title: "Bridal Beauty Timeline: When to Book What",
      excerpt: "Planning your wedding? Here's a complete timeline for all your beauty appointments leading up to the big day...",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      author: "Jessica Lee",
      category: "Bridal",
      published: true
    },
    {
      id: '4',
      title: "Men's Grooming: Essential Tips for Every Guy",
      excerpt: "A comprehensive guide to modern men's grooming, from skincare to beard maintenance...",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop",
      author: "Michael Chen",
      category: "Men's Grooming",
      published: true
    }
  ];

  const displayPosts = blogPosts.length > 0 ? blogPosts : defaultBlogPosts;

  if (loading) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading blog posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Beauty Tips & Insights</h2>
          <p className="text-xl text-gray-600">Expert advice from our professional team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-purple-600 hover:gap-3 transition-all">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
}
