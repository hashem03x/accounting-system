import posthog from "posthog-js";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function FacebookPixel() {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages
    const isAdminPage = location.pathname.startsWith("/admin");

    if (!isAdminPage) {
      // Facebook Pixel tracking
      if (window.fbq) window.fbq("track", "PageView");

      // Posthog tracking
      posthog.capture("$pageview");
    }
  }, [location.pathname]);

  return null;
}
