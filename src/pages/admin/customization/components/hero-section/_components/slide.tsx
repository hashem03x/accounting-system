import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Slide as SlideType } from "@/types/slide";
import { solidIcons } from "@/components/icons";
import SlideForm from "./slide-form";

export default function Slide({ slide, canIUpdateCustomization }: { slide: SlideType; canIUpdateCustomization: boolean }) {
  const { translate } = useLanguage();

  const [opened, setOpened] = useState(false);

  const toggle = () => setOpened((prev) => !prev);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={toggle}
        disabled={!canIUpdateCustomization}
        className={`flex items-center gap-2 rounded-lg p-4 font-bold ${canIUpdateCustomization ? "cursor-pointer bg-blue-100 text-sky-600" : "cursor-not-allowed bg-gray-200 text-gray-500"}`}
        title={
          !canIUpdateCustomization
            ? translate("You don't have permission to update slides.", "ليس لديك صلاحية تحديث الشرائح.")
            : ""
        }
      >
        {opened ? <solidIcons.AngleUp /> : <solidIcons.AngleDown />}
        {translate(slide.title.en, slide.title.ar)}
        {!slide.published && <span className="text-sm font-normal">{translate("(Draft)", "(مسودة)")}</span>}
      </button>

      {opened && canIUpdateCustomization && <SlideForm updating={slide} close={toggle} />}
    </div>
  );
}
