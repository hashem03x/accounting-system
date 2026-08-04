import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useHero } from "@/context/HeroContext";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import paths from "@/utils/constants/paths";
import ratios from "@/utils/constants/ratios";
import Img from "@/components/ui/img";

export default function HeroSection() {
  const { translate, translations } = useLanguage();

  const { data } = useHero();

  const slides = data.filter((slide) => slide.published);

  const desktopAutoplay = useRef(Autoplay({ delay: 7500 }));
  const mobileAutoplay = useRef(Autoplay({ delay: 7500 }));

  const navigate = useNavigate();

  if (!slides.length) return null;

  return (
    <section>
      {/* Desktop Carousel - Aspect Ratio: 2 / 1 */}
      <div className="hidden sm:block" dir="ltr">
        <Carousel
          slideSize="100%"
          slideGap="sm"
          plugins={[desktopAutoplay.current]}
          onMouseEnter={desktopAutoplay.current.stop}
          onMouseLeave={desktopAutoplay.current.reset}
          loop
        >
          {slides.map((slide) => (
            <Carousel.Slide key={slide._id}>
              <div className="relative" dir={translations.dir}>
                <Img
                  width="100%"
                  src={slide.desktopImg}
                  alt={translate(slide.title.en, slide.title.ar)}
                  aspectRatio={ratios.slide.desktop}
                />
                <div className="absolute left-[7.5%] top-1/2 -translate-y-1/2">
                  <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold tracking-tight lg:text-5xl" style={{ color: slide.titleColor }}>
                      {translate(slide.title.en, slide.title.ar)}
                    </h1>
                    <p className={`max-w-[250px] md:max-w-[385px]`} style={{ color: slide.descriptionColor }}>
                      {translate(slide.description.en, slide.description.ar)}
                    </p>
                    {slide.shopNowButton.show && (
                      <button
                        onClick={() => navigate(`/${paths.products}`)}
                        className="w-fit px-5 py-3 text-white hover:opacity-90"
                        style={{ backgroundColor: slide.shopNowButton.color, fontWeight: 500 }}
                      >
                        {translate("Shop Now", "تسوق الآن")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {/* Mobile Carousel - Aspect Ratio: 2 / 3 */}
      <div className="block sm:hidden" dir="ltr">
        <Carousel slideSize="100%" slideGap="xs" loop plugins={[mobileAutoplay.current]}>
          {slides.map((slide) => (
            <Carousel.Slide key={slide._id}>
              <div className="relative" dir={translations.dir}>
                <Img
                  width="100%"
                  src={slide.mobileImg}
                  alt={translate(slide.title.en, slide.title.ar)}
                  aspectRatio={ratios.slide.mobile}
                />
                <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
                  <div className="flex flex-col items-center gap-4 p-4">
                    <h1 className="text-center text-3xl font-bold tracking-tight" style={{ color: slide.titleColor }}>
                      {translate(slide.title.en, slide.title.ar)}
                    </h1>
                    <p className={`max-w-xs text-center text-sm`} style={{ color: slide.descriptionColor }}>
                      {translate(slide.description.en, slide.description.ar)}
                    </p>
                    {slide.shopNowButton.show && (
                      <button
                        onClick={() => navigate(`/${paths.products}`)}
                        className="w-fit px-4 py-2 text-white hover:opacity-90"
                        style={{ backgroundColor: slide.shopNowButton.color, fontWeight: 500 }}
                      >
                        {translate("Shop Now", "تسوق الآن")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
