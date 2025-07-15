import { useWeather } from "@/hooks/useWeather";
import { useActiveGalleryImages } from "@/hooks/useGallery";
import WeatherEffects from "@/component/common/WeatherEffects";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [weatherVisible, setWeatherVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);
  const { weather, loading: weatherLoading } = useWeather();
  const { images: galleryImages, loading: galleryLoading } = useActiveGalleryImages(5);

  const fallbackImages = ["/kantor_desa.jpg", "/stasiun_ngebruk.JPG", "/pasar_ngebruk.png", "/kampung_gatot.png", "/koka_caffee.png"];

  const images = galleryImages.length > 0 ? galleryImages.map((img) => img.imageUrl) : fallbackImages;

  useEffect(() => {
    if (!galleryLoading && images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImageIndex(randomIndex);
    }

    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [galleryLoading, images.length]);

  useEffect(() => {
    if (isManualControl || images.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(slideInterval);
  }, [images.length, isManualControl]);

  useEffect(() => {
    if (!isManualControl) return;

    const resetTimer = setTimeout(() => {
      setIsManualControl(false);
    }, 16000);

    return () => clearTimeout(resetTimer);
  }, [isManualControl, currentImageIndex]);

  const handleManualSlide = (index: number) => {
    setCurrentImageIndex(index);
    setIsManualControl(true);
  };

  useEffect(() => {
    if (weather && mounted && !weatherLoading) {
      const weatherTimer = setTimeout(() => {
        setWeatherVisible(true);
      }, 500);
      return () => clearTimeout(weatherTimer);
    }
  }, [weather, mounted, weatherLoading]);

  const getWeatherOverlayClass = (weatherCode: string, description: string): string => {
    if (!weatherCode || !description) return "";

    const codeNum = parseInt(weatherCode);
    const descLower = description.toLowerCase();

    if (codeNum >= 200 && codeNum <= 299) return "weather-overlay-stormy";
    if (descLower.includes("thunderstorm") || descLower.includes("lightning")) return "weather-overlay-stormy";

    if (codeNum >= 500 && codeNum <= 504) return "weather-overlay-heavy-rain";
    if (codeNum >= 300 && codeNum <= 399) return "weather-overlay-drizzle";
    if (codeNum >= 520 && codeNum <= 531) return "weather-overlay-rainy";
    if (descLower.includes("heavy rain") || descLower.includes("torrential")) return "weather-overlay-heavy-rain";
    if (descLower.includes("light rain") || descLower.includes("drizzle")) return "weather-overlay-drizzle";
    if (descLower.includes("moderate rain") || descLower.includes("rain")) return "weather-overlay-rainy";

    if (codeNum >= 600 && codeNum <= 699) return "weather-overlay-snowy";
    if (descLower.includes("snow") || descLower.includes("blizzard")) return "weather-overlay-snowy";

    if (codeNum >= 700 && codeNum <= 799) return "weather-overlay-foggy";
    if (descLower.includes("fog") || descLower.includes("mist") || descLower.includes("haze")) return "weather-overlay-foggy";

    if (codeNum === 800) return "weather-overlay-sunny";
    if (descLower.includes("clear") || descLower.includes("sunny")) return "weather-overlay-sunny";

    if (codeNum === 801) return "weather-overlay-few-clouds";
    if (codeNum === 802) return "weather-overlay-scattered-clouds";
    if (codeNum === 803) return "weather-overlay-broken-clouds";
    if (codeNum === 804) return "weather-overlay-overcast";
    if (descLower.includes("overcast")) return "weather-overlay-overcast";
    if (descLower.includes("cloud")) return "weather-overlay-scattered-clouds";

    return "weather-overlay-few-clouds";
  };

  const weatherOverlayClass = weather ? getWeatherOverlayClass(weather.icon, weather.description) : "";

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: `url('${image}')`,
            }}
            onError={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              target.style.backgroundImage = `url('${fallbackImages[index % fallbackImages.length]}')`;
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/70"></div>

      {weather && <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${weatherOverlayClass} ${weatherVisible ? "opacity-100" : "opacity-0"}`}></div>}

      {weather && weatherVisible && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
          <WeatherEffects weatherCode={weather.icon} description={weather.description} intensity="medium" />
        </div>
      )}

      <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 text-left text-white smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>Selamat Datang di Desa Ngebruk</h1>
          <p className={`text-sm sm:text-base md:text-lg mb-8 text-gray-200 max-w-2xl smooth-transition ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>Kampung Damai & Budaya Luhur, Harmoni Alam dan Kearifan Lokal</p>

          <div className={`w-full h-px bg-white mb-8 smooth-transition ${mounted ? "smooth-reveal stagger-3" : "animate-on-load"}`}></div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-4xl smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
            <div className="space-y-4 hover-lift smooth-transition">
              <div className="text-xl md:text-2xl font-bold text-white">01</div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">Temukan informasi penting</h3>
              <p className="text-white text-sm leading-relaxed">Dapatkan berita terkini, agenda kegiatan, dan pengumuman lengkap dari Desa Ngebruk.</p>
            </div>

            <div className="space-y-4 hover-lift smooth-transition">
              <div className="text-xl md:text-2xl font-bold text-white">02</div>
              <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-4">Nikmati pelayanan lebih mudah</h3>
              <p className="text-sm text-white leading-relaxed">Unduh formulir administrasi, cek persyaratan, dan datang dengan lebih siap.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/70"}`}
              onClick={() => handleManualSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

