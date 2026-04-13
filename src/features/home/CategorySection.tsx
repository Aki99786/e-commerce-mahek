import { CategoryCircle } from "@/components/category/CategoryCircle";
import { CATEGORIES } from "@/constants/categories";

export const CategorySection = () => {
  return (
    <section className="bg-white py-8 md:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {CATEGORIES.map((category) => (
            <CategoryCircle
              key={category.id}
              name={category.name}
              image={category.image}
              href={`/products?category=${category.slug}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
