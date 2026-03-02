import BlogSection from "../BlogSection";

export default function BlogPage() {
  return (
    <>
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100 bg-gradient-to-br from-white via-blue-50/20 to-white">
        <div className="max-w-4xl">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Insights & Tips
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            Beauty & Wellness <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Expert tips, trends, and insights to help you look and feel your
            best.
          </p>
        </div>
      </section>

      <div className="py-12 md:py-16 px-6 sm:px-10 lg:px-16">
        <BlogSection />
      </div>
    </>
  );
}
