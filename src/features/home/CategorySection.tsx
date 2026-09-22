import { CategoryCard } from "@/components/category/CategoryCard";
import { CATEGORIES } from "@/constants/categories";

const counts = ["128 ENSEMBLES", "94 SILKS", "110 WEAVES", "72 OUTFITS", "46 EDITIONS"];

export const CategorySection = () => {
  return (
    <section className="bg-white py-10 md:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Couture Reference Design */}
        <div className="mb-8 md:mb-10 text-left">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-1.5">
            Couture Silhouettes
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              image={category.image}
              video={category.video}
              // count={category.count}
              href={`/products?category=${category.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
