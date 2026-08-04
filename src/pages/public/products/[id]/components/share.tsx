import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import { solidIcons, outlineIcons } from "@/components/icons";
import { Button } from "@mantine/core";
import Modal from "@/components/ui/modal";

export default function Share() {
  const { translate } = useLanguage();
  const [opened, { open, close }] = useDisclosure(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href; // The current page URL

  const handleShareOnFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookShareUrl, "_blank");
    close();
  };

  const handleShareOnWhatsapp = () => {
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl)}`;
    window.open(whatsappShareUrl, "_blank");
    close();
  };

  return (
    <>
      <Button
        onClick={open}
        className="text-nowrap text-xs sm:text-sm"
        color="blue"
        variant="light"
        leftSection={<solidIcons.Share size={15} />}
      >
        {translate("Share", "مشاركة")}
      </Button>

      <Modal opened={opened} onClose={close}>
        <h3 className="my-4 text-center">{translate("Share this product", "شارك هذا المنتج")}</h3>
        <div className="flex flex-col gap-4 p-4">
          <button
            className="flex items-center gap-4 rounded-md bg-gray-200 p-5 text-gray-600 transition-colors hover:bg-gray-300"
            onClick={handleShareOnFacebook}
          >
            <solidIcons.Facebook size={20} />
            {translate("Share on Facebook", "مشاركة عبر فيسبوك")}
          </button>
          <button
            className="flex items-center gap-4 rounded-md bg-gray-200 p-5 text-gray-600 transition-colors hover:bg-gray-300"
            onClick={handleShareOnWhatsapp}
          >
            <solidIcons.Whatsapp size={20} />
            {translate("Share on WhatsApp", "مشاركة عبر واتساب")}
          </button>
          <button
            className="flex items-center gap-4 rounded-md bg-gray-200 p-5 text-gray-600 transition-colors hover:bg-gray-300"
            onClick={async () => {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => {
                  close();
                  setTimeout(() => {
                    setCopied(false);
                  }, 100);
                }, 1000);
              } else {
                console.log("Clipboard API not supported in this browser.");
                copyToClipboardFallback(shareUrl, setCopied, close);
              }
            }}
          >
            {copied ? <solidIcons.Check size={20} /> : <outlineIcons.Copy size={20} />}
            {translate("Copy Link", "نسخ الرابط")}
          </button>
        </div>
      </Modal>
    </>
  );
}

const copyToClipboardFallback = (text: string, setCopied: (copied: boolean) => void, close: () => void) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
    setCopied(successful);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
    alert("Copying failed. Please try again.");
  }
  document.body.removeChild(textArea);
  setTimeout(() => {
    close();
    setTimeout(() => {
      setCopied(false);
    }, 100);
  }, 1000);
};
