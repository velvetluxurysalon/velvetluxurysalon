import ProductShowcase from "../ProductShowcase";

export default function ProductsPage() {
  return (
    <div className="bg-white text-slate-900">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-16 px-6 lg:px-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-6">
            Exclusive Collection
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif font-light tracking-tight text-slate-900 mb-6">
            Our <span className="italic text-[#c9a227]">Premium</span> Products.
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Discover our curated selection of luxury beauty and wellness
            products, handpicked to complement your salon experience.
          </p>
        </div>
      </section>

      {/* --- PRODUCTS SHOWCASE --- */}
      <ProductShowcase />
    </div>
  );
}
