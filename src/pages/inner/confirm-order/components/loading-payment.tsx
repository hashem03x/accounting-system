import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LoadingSection from "@/components/ui/sections/loading";

export default function LoadingPayment() {
  const { language, translate } = useLanguage();

  const [message, setMessage] = useState("");

  useEffect(() => {
    const messages = [
      translate("Preparing your payment", "جارٍ إعداد دفعتك"),
      translate("Almost ready to proceed", "قريبًا جاهز للمتابعة"),
      translate("You will be redirected to the payment gateway", "سيتم تحويلك إلى بوابة الدفع"),
      translate("Please wait for a moment", "يرجى الانتظار لحظة"),
    ];

    let currentMessage = 0;

    // Initial message state
    setMessage(translate("Please wait...", "يرجى الانتظار..."));

    const messageInterval = setInterval(() => {
      setMessage(messages[currentMessage]);
      currentMessage += 1;
      currentMessage >= messages.length && clearInterval(messageInterval);
    }, 5000); // Changes message every 5 seconds

    return () => clearInterval(messageInterval);
  }, [language]);

  return <LoadingSection message={message} className="max-h-32 p-6" />;
}
