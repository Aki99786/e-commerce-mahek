import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { CategoryEnum } from "@/constants/categories";

export const GallerySection = () => {
  return (
    <section className="bg-white py-10 md:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-[10px] md:text-xs font-poppins font-semibold uppercase tracking-widest text-rose-600 mb-2">Collections</p>
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900">Discover Our World</h2>
        </div>
        <div className="grid gap-4 md:gap-5 grid-cols-1 md:grid-cols-3">
        <Link
          href={`/products?category=${CategoryEnum.BANARASI_SAREES}`}
          className="group relative h-[500px] overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
          <Image
            src="/images/gallery-section/cate1.png"
            alt="Banarasi Saree"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>

          <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
            <h3 className="font-playfair text-2xl text-white">Banarasi Saree</h3>
            <span className="text-xs text-white underline underline-offset-4 font-poppins">
              Shop Now
            </span>
          </div>
        </Link>

        <div className="flex flex-col gap-5">
          <Link
            href={`/products?category=${CategoryEnum.SAREES}`}
            className="group relative h-[200px] overflow-hidden rounded-xl md:h-[320px]"
          >
            <Image
              src="/images/gallery-section/cate2.png"
              alt="Sarees"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>

            <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
              <h3 className="font-playfair text-2xl text-white">Sarees</h3>
              <span className="text-xs text-white underline underline-offset-4 font-poppins">
                Shop Now
              </span>
            </div>
          </Link>

          <Link
            href={`/products?category=${CategoryEnum.RAJPUTI_POSHAK}`}
            className="group relative h-[200px] overflow-hidden rounded-xl md:h-[280px]"
          >
            <Image
              src="/images/gallery-section/cate3.png"
              alt="Rajputi Poshak"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>

            <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
              <h3 className="font-playfair text-2xl text-white">Rajputi Poshak</h3>
              <span className="text-xs text-white underline underline-offset-4 font-poppins">
                Shop Now
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          <Link
            href={`/products?category=${CategoryEnum.LEHENGA}`}
            className="group relative h-[200px] overflow-hidden rounded-xl md:h-[280px]"
          >
            <Image
              src="/images/gallery-section/cate4.png"
              alt="Lehenga"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>

            <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
              <h3 className="font-playfair text-2xl text-white">Lehenga</h3>
              <span className="text-xs text-white underline underline-offset-4 font-poppins">
                Shop Now
              </span>
            </div>
          </Link>

          <Link
            href={`/products?category=${CategoryEnum.BRIDAL_LEHENGA}`}
            className="group relative h-[200px] overflow-hidden rounded-xl md:h-[280px]"
          >
            <Image
              src="/images/gallery-section/cate5.png"
              alt="Bridal Lehanga"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors duration-300"></div>

            <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3">
              <h3 className="font-playfair text-2xl text-white">Bridal Lehanga</h3>
              <span className="text-xs text-white underline underline-offset-4 font-poppins">
                Shop Now
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href={ROUTES.SHOP} className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 font-poppins transition-colors">
          View All Products
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      </div>
    </section>
  );
};
