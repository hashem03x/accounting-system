import { useEffect, useState } from "react";
import { Modal, Button } from "@mantine/core";
import { outlineIcons } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

// Shown at most once per browser tab session - cleared automatically when the session ends
const SESSION_STORAGE_KEY = "hasSeenNewSiteNotice";
const NEW_SITE_URL = "https://leopardegy.net/";

export default function NewSiteNotice() {
  const { translate, translations } = useLanguage();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (!alreadySeen) {
      // Mark as seen immediately so a refresh before the user closes the modal doesn't re-trigger it
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
      setOpened(true);
    }
  }, []);

  function handleVisitNewSite() {
    window.location.href = NEW_SITE_URL;
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      radius={20}
      size="md"
      dir={translations.dir}
      zIndex={1000}
      overlayProps={{ backgroundOpacity: 0.6, blur: 4 }}
      transitionProps={{ transition: "pop", duration: 250 }}
      closeButtonProps={{ "aria-label": translate("Close", "إغلاق"), size: "lg" }}
      title={
        <div className="flex items-center gap-3">
          <span className="flex-center h-10 w-10 shrink-0 rounded-full bg-gray-900 text-white">
            <outlineIcons.Globe size={20} />
          </span>
          <h2>{translate("We’ve launched our new website", "لقد أطلقنا موقعنا الإلكتروني الجديد")}</h2>
        </div>
      }
    >
      <div dir={translations.dir} className="flex flex-col gap-5">
        <p>
          {translate(
            "We’ve launched our new website to provide you with a better and smoother shopping experience.",
            "أطلقنا موقعنا الإلكتروني الجديد لنقدم لك تجربة تسوق أفضل وأسهل.",
          )}
        </p>

        <Button color="dark" size="md" radius={12} fullWidth onClick={handleVisitNewSite}>
          {translate("Visit the new website", "زيارة الموقع الجديد")}
        </Button>
      </div>
    </Modal>
  );
}
