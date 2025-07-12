import Header from "@/component/landing-page/Header";
import HeroSection from "@/component/landing-page/HeroSection";
import ScrollingBadge from "@/component/landing-page/ScrollingBadge";
import InfoCards from "@/component/landing-page/InfoCards";
import NewsSection from "@/component/landing-page/NewsSection";
import AgendaSection from "@/component/landing-page/AgendaSection";
import GallerySection from "@/component/landing-page/GallerySection";
import Footer from "@/component/landing-page/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ScrollingBadge />
      <InfoCards />
      <NewsSection />
      <AgendaSection />
      <GallerySection />
      <Footer />
    </div>
  );
}
