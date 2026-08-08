import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { useLanguage } from "@/context/LanguageContext";
import { solidIcons } from "@/components/icons";

// Independent from the "new site" modal's own key - dismissing one doesn't affect the other
const SESSION_STORAGE_KEY = "leopard_new_website_notification_dismissed";
const NEW_SITE_URL = "https://leopardegy.net/";

export default function NewSiteStickyBar() {
  const { translate } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
      // Mount off-screen first, then flip a frame later so the entrance transition actually plays
      requestAnimationFrame(() => setEntered(true));
    }
  }, []);

  function handleClose() {
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={translate("New website announcement", "إعلان الموقع الجديد")}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out motion-reduce:transition-none ${
        entered ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container relative flex flex-col items-center justify-center gap-2 py-3 pe-10 text-center sm:flex-row sm:gap-4 sm:py-2.5">
        <p className="text-xs font-medium text-gray-800 sm:text-sm">
          {translate(
            "Our new website is ready 🚀 — Enjoy a better shopping experience",
            "موقعنا الجديد جاهز 🚀 — جرّب تجربة التسوق الجديدة",
          )}
        </p>

        <Button
          component="a"
          href={NEW_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          color="dark"
          size="xs"
          radius="xl"
          className="shrink-0"
          rightSection={<solidIcons.ExternalLink size={13} />}
        >
          {translate("Visit the new website", "زيارة الموقع الجديد")}
        </Button>
      </div>

      <button
        type="button"
        onClick={handleClose}
        aria-label={translate("Close", "إغلاق")}
        className="flex-center absolute end-2 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full text-xl leading-none text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
      >
        ×
      </button>
    </div>
  );
}
