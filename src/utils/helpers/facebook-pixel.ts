export function trackEvent(eventName: "AddToCart" | "InitiateCheckout" | "Purchase", params?: Record<string, unknown>) {
  if (window.fbq) window.fbq("track", eventName, params);
}
