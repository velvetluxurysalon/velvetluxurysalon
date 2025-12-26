import { Card } from "./ui/card";
import { User, ArrowRight } from "lucide-react";
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-600">Loading blog posts...</p>
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">No blog posts available yet. Check back soon!</p>
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

                <button 
                  onClick={() => handleReadMore(post)}
                  className="flex items-center gap-2 text-purple-600 hover:gap-3 transition-all hover:text-purple-700 font-medium"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllArticles}
            className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors font-semibold cursor-pointer"
          >
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
}
