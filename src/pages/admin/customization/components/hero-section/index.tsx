import { useState } from "react";
import { useHero } from "@/context/HeroContext";
import { useLanguage } from "@/context/LanguageContext";
import useHasPermission from "@/hooks/useHasPermission";
import resources from "@/utils/constants/resources";
import actions from "@/utils/constants/actions";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import LoadingSection from "@/components/ui/sections/loading";
import ErrorSection from "@/components/ui/sections/error";
import SlideForm from "./_components/slide-form";
import Slide from "./_components/slide";

export default function HeroSection() {
  const { translate } = useLanguage();

  const { loading, error, data: currentSlides, reFetch } = useHero();

  const [opened, setOpened] = useState(false);

  const toggle = () => setOpened((prev) => !prev);

  const canIUpdateCustomization = useHasPermission(resources.customization, actions.update);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h3>{translate("Hero Section", "قسم العرض الرئيسي")}</h3>
        <p className="flex flex-wrap gap-1">
          <span>{translate("The hero section appears in", "يظهر قسم العرض الرئيسي فى")}</span>
          <Link to="/" target="_blank" className="flex items-center gap-1 text-blue-500">
            <span>{translate("Home Page", "الصفحة الرئيسية")}</span>
            <solidIcons.ExternalLink className="w-3" />
          </Link>
          <span>
            {translate(
              "and it is the first thing your customer sees when visiting your store.",
              "وهو اول شىء يراه العميل عند زيارة متجرك.",
            )}
          </span>
        </p>
      </header>

      {/* Add New Slide */}
      {canIUpdateCustomization && (
        <>
          <div>
            <Button onClick={toggle} color="blue" variant="light" leftSection={<solidIcons.Plus />}>
              {translate("Add New Slide", "إضافة شريحة جديدة")}
            </Button>
          </div>
          {opened && <SlideForm close={toggle} />}
        </>
      )}

      {/* Slides */}
      <h4>{translate("Slides", "الشرائح")}</h4>
      {loading ? (
        <LoadingSection message={translate("Loading slides...", "جارى تحميل الشرائح...")} className="py-20" />
      ) : error ? (
        <ErrorSection
          errorTitle={translate("Failed to load slides.", "خطأ فى تحميل الشرائح.")}
          errorMessage={error}
          button={{ text: translate("Try Again", "حاول مرة أخرى"), onClick: reFetch }}
          className="py-20"
        />
      ) : currentSlides.length === 0 ? (
        <p>{translate("There are no slides yet.", "لا توجد شرائح بعد.")}</p>
      ) : (
        <div className="flex animate-fade-in flex-col gap-4">
          {currentSlides.map((slide) => (
            <Slide key={slide._id} slide={slide} canIUpdateCustomization={canIUpdateCustomization} />
          ))}
        </div>
      )}
    </div>
  );
}
