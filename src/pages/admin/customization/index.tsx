import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { LocalizedEntity } from "@/types/global";
import HeroSection from "./components/hero-section";
import AboutSection from "./components/about-section";
import SubcategoriesSection from "./components/subcategories-section";

export type CustomizationTab = "hero" | "subcategories" | "about";

const TABS: LocalizedEntity<CustomizationTab> = {
  hero: {
    value: "hero",
    label: {
      en: "Hero Section",
      ar: "قسم العرض الرئيسي",
    },
  },
  subcategories: {
    value: "subcategories",
    label: {
      en: "Subcategories Banners",
      ar: "بنرات الفئات الفرعية",
    },
  },
  about: {
    value: "about",
    label: {
      en: "General",
      ar: "عام",
    },
  },
};

export default function Customization() {
  const { translate, translations } = useLanguage();

  useDocumentTitle(`${translations.pages.customization} | ${translations.adminPanel}`);

  const [activeTab, setActiveTab] = useState<CustomizationTab>(TABS.hero.value);

  return (
    <div className="root-flex-1 flex min-h-full flex-col gap-4">
      <nav className="grid grid-cols-1 overflow-hidden rounded-lg bg-white shadow-md md:grid-cols-3">
        {Object.values(TABS).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex w-full items-center justify-center gap-2 text-nowrap p-4 text-xs transition-colors sm:text-sm ${
              activeTab === tab.value ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            {translate(tab.label.en, tab.label.ar)}
          </button>
        ))}
      </nav>

      <div className="flex flex-1 flex-col gap-4 rounded-xl bg-white p-4 shadow-md sm:p-5">
        {activeTab === TABS.hero.value && <HeroSection />}
        {activeTab === TABS.subcategories.value && <SubcategoriesSection />}
        {activeTab === TABS.about.value && <AboutSection />}
      </div>
    </div>
  );
}
