import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoSection from "@/components/PromoSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LocationSection from "@/components/LocationSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoSection />
      <TestimonialsSection />
      <LocationSection />
    </>
  );
}
