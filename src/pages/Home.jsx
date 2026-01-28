import { Leaf, ShieldCheck, Truck, Sprout, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span className="inline-block mb-4 px-4 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
              100% Natural • Eco-Friendly • Safe
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Natural Pesticides for a <br />
              <span className="text-green-600">Healthier Harvest</span>
            </h1>

            <p className="text-gray-600 mb-8 max-w-xl">
              Discover plant-based, chemical-free pesticides designed to protect
              crops, soil, and ecosystems—without harming farmers or consumers.
            </p>

            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition">
                Shop Products
              </button>
              <button className="px-6 py-3 rounded-xl border border-green-600 text-green-700 font-medium hover:bg-green-50 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-green-100 flex items-center justify-center">
              <Sprout className="w-32 h-32 text-green-600" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            icon={<Leaf />}
            title="Plant-Based Formula"
            description="Made from neem, herbs, and organic extracts."
          />
          <Feature
            icon={<ShieldCheck />}
            title="Safe & Certified"
            description="Non-toxic for humans, animals, and soil."
          />
          <Feature
            icon={<Truck />}
            title="Fast Delivery"
            description="Reliable shipping to farms and homes."
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">
            Shop by Category
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard title="Insect Control" />
            <CategoryCard title="Fungal Protection" />
            <CategoryCard title="Weed Management" />
            <CategoryCard title="Soil Boosters" />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">
            Featured Products
          </h2>
          <button className="flex items-center gap-2 text-green-600 hover:underline">
            View All <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <ProductCard name="Neem Shield" price="₹499" />
          <ProductCard name="Herbal Pest Guard" price="₹699" />
          <ProductCard name="Bio Fungus Control" price="₹599" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Grow Naturally. Protect Sustainably.
          </h2>
          <p className="mb-8 text-green-100">
            Join thousands of farmers switching to eco-friendly pest control.
          </p>
          <button className="px-8 py-3 rounded-xl bg-white text-green-700 font-semibold hover:bg-green-50 transition">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------ COMPONENTS ------------------ */

function Feature({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
      <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function CategoryCard({ title }) {
  return (
    <div className="p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition cursor-pointer">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-500">
        Explore natural solutions →
      </p>
    </div>
  );
}

function ProductCard({ name, price }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-md transition">
      <div className="aspect-square rounded-xl bg-green-100 mb-4" />
      <h3 className="font-semibold mb-1">{name}</h3>
      <p className="text-green-600 font-bold mb-4">{price}</p>
      <button className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
        Add to Cart
      </button>
    </div>
  );
}
