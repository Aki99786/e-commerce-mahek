import { CategoryCircle } from "@/components/category/CategoryCircle";
import { CATEGORIES } from "@/constants/categories";

const counts = ["128 ENSEMBLES", "94 SILKS", "110 WEAVES", "72 OUTFITS", "46 EDITIONS"];

export const CategorySection = () => {
  return (
    <section className="bg-white py-10 md:py-14 border-t border-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[9px] tracking-[0.25em] font-semibold text-[#6B6B6B] uppercase mb-1.5">
            Couture Silhouettes
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold text-[#111212]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Shop by Category
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {CATEGORIES.map((category, idx) => (
            <div key={category.id} className="flex flex-col items-center gap-3 group cursor-pointer">
              <a href={`/products?category=${category.slug}`} className="block">
                <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#F4F3F3] border-2 border-[#E8E6E1] group-hover:border-[#111212] transition-all duration-300">
                  <CategoryCircle
                    name=""
                    image={category.image}
                    href={`/products?category=${category.slug}`}
                  />
                </div>
              </a>
              <div className="text-center">
                <p className="text-sm font-medium text-[#111212] group-hover:text-[#6B6B6B] transition-colors">
                  {category.name}
                </p>
                <p className="text-[9px] tracking-[0.15em] text-[#9B9B9B] uppercase mt-0.5">
                  {counts[idx] || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
