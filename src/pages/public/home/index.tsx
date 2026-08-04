import useDocumentTitle from "@/hooks/useDocumentTitle";
import useCheckTransaction from "@/hooks/useCheckTransaction";
import { useLanguage } from "@/context/LanguageContext";
import { useHero } from "@/context/HeroContext";
import { useAbout } from "@/context/AboutContext";
import MiniDivider from "@/components/ui/mini-divider";
import SubCategoriesBar from "./components/subcategories-bar";
import HeroSection from "./components/hero-section";
import SubCategoriesSections from "./components/subcategories-section";
import ProductsSection from "./components/products-section";
import GuaranteeLabels from "@/components/global/guarantee-labels";
// import AboutUsSection from "./components/about-us-section";

function Home() {
  const { translate } = useLanguage();

  useCheckTransaction();

  const { data: hero } = useHero();
  const { data: about } = useAbout();

  useDocumentTitle(
    translate(
      "Leopard | Elevate Your Wardrobe with Trendsetting Fashion for Him & Her",
      "ليوبارد | ارتقِ بأناقتك مع أحدث صيحات الموضة للرجال والنساء.",
    ),
  );

  return (
    <div className="min-h-screen">
      {hero.length > 0 && (
        <>
          <HeroSection />
          {/* <MiniDivider className="mx-auto my-10" /> */}
        </>
      )}

      <div className="my-4">
        <SubCategoriesBar />
      </div>

      {!(!about?.homeSubcategories || about.homeSubcategories.length === 0) && (
        <>
          <SubCategoriesSections />
          <MiniDivider className="mx-auto my-10 lg:opacity-0" />
        </>
      )}

      <div className="mb-10">
        <ProductsSection />
      </div>

      <div className="container mb-10 px-2 py-2 sm:px-4">
        <GuaranteeLabels />
      </div>

      {/* 
        <MiniDivider className="mx-auto my-10" />
        {about && about.title && about.content && (
          <>
            <AboutUsSection />
            <MiniDivider className="mx-auto my-10" />
          </>
        )}
      */}
    </div>
  );
}

export default Home;
