import { useState } from "react";
import { useAbout } from "@/context/AboutContext";
import { useLanguage } from "@/context/LanguageContext";
import useHasPermission from "@/hooks/useHasPermission";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import resources from "@/utils/constants/resources";
import actions from "@/utils/constants/actions";
import { Button, Checkbox, Textarea, TextInput } from "@mantine/core";
import { notifySuccess } from "@/utils/helpers/notifiers";
import Img from "@/components/ui/img";
import ImgController from "@/components/ui/img-controller";
import ErrorAlert from "@/components/ui/error-alert";

export default function AboutForm() {
  const { translate, language } = useLanguage();

  const canIupdateCustomization = useHasPermission(resources.customization, actions.update);

  const { data, setData } = useAbout();

  const [logo, setLogo] = useState<File | string | null>(data?.logo || null);
  const [titleEn, setTitleEn] = useState(data?.title.en || "");
  const [titleAr, setTitleAr] = useState(data?.title.ar || "");
  const [contentEn, setContentEn] = useState(data?.content.en || "");
  const [contentAr, setContentAr] = useState(data?.content.ar || "");
  const [facebook, setFacebook] = useState(data?.socialLinks.facebook || "");
  const [instagram, setInstagram] = useState(data?.socialLinks.instagram || "");
  const [twitter, setTwitter] = useState(data?.socialLinks.twitter || "");
  const [whatsapp, setWhatsapp] = useState(data?.socialLinks.whatsapp || "");
  const [tiktok, setTiktok] = useState(data?.socialLinks.tiktok || "");
  const [showSubcategory, setShowSubcategory] = useState(data?.barcodeSittings?.subcategory || false);
  const [showColor, setShowColor] = useState(data?.barcodeSittings?.color || false);
  const [showSize, setShowSize] = useState(data?.barcodeSittings?.size || false);

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  // This is good but it's not accurate in case of updating the logo.
  const isDataChanged =
    titleEn !== data?.title.en ||
    titleAr !== data?.title.ar ||
    contentEn !== data?.content.en ||
    contentAr !== data?.content.ar ||
    facebook !== data?.socialLinks.facebook ||
    instagram !== data?.socialLinks.instagram ||
    twitter !== data?.socialLinks.twitter ||
    whatsapp !== data?.socialLinks.whatsapp ||
    tiktok !== data?.socialLinks.tiktok ||
    showSubcategory !== data?.barcodeSittings?.subcategory ||
    showColor !== data?.barcodeSittings?.color ||
    showSize !== data?.barcodeSittings?.size;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!logo) {
      setError(translate("Please upload a logo.", "يرجى تحميل شعار."));
      return;
    }
    if (!titleEn || !titleAr || !contentEn || !contentAr) {
      setError(translate("Please fill in all required fields.", "يرجى ملء جميع الحقول المطلوبة."));
      return;
    }

    const formData = new FormData();
    if (logo instanceof File) formData.append("logo", logo);
    formData.append("title[en]", titleEn);
    formData.append("title[ar]", titleAr);
    formData.append("content[en]", contentEn);
    formData.append("content[ar]", contentAr);
    formData.append("socialLinks[facebook]", facebook);
    formData.append("socialLinks[instagram]", instagram);
    formData.append("socialLinks[twitter]", twitter);
    formData.append("socialLinks[whatsapp]", whatsapp);
    formData.append("socialLinks[tiktok]", tiktok);
    formData.append("barcodeSittings[subcategory]", String(showSubcategory));
    formData.append("barcodeSittings[color]", String(showColor));
    formData.append("barcodeSittings[size]", String(showSize));

    handleRequest(language, setLoading, setError, async () => {
      const res = await privateRequest({
        url: `about-us/${import.meta.env.VITE_ABOUT_ID}`,
        method: "PUT",
        data: formData,
        language,
      });

      setData({
        _id: import.meta.env.VITE_ABOUT_ID,
        logo: res.data.logo,
        title: { en: titleEn, ar: titleAr },
        content: { en: contentEn, ar: contentAr },
        socialLinks: { facebook, instagram, twitter, whatsapp, tiktok },
        homeSubcategories: res.data.homeSubcategories,
        barcodeSittings: { subcategory: showSubcategory, color: showColor, size: showSize },
      });

      notifySuccess({ message: translate("Data has been updated successfully.", "تم تحديث البيانات بنجاح."), language });
    });
  }

  return (
    <form className="flex flex-col gap-4 border-t pt-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h5>{translate("Logo", "شعار")}</h5>
          <span className="font-bold text-red-500">*</span>
        </div>
        <p>{translate("Upload a square image for your logo.", "قم بتحميل صورة مربعة للشعار.")}</p>
        {canIupdateCustomization ? (
          <ImgController image={logo} setImage={setLogo} mini className="aspect-square h-40 w-40" />
        ) : (
          <Img src={logo as string} alt="logo" className="aspect-square h-40 rounded-md" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h5>{translate("Title", "العنوان")}</h5>
          <span className="font-bold text-red-500">*</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <TextInput
            label={translate("Title in English", "العنوان بالإنجليزية")}
            placeholder={translate("Title in English", "العنوان بالإنجليزية")}
            value={titleEn}
            onChange={(e) => setTitleEn(e.currentTarget.value)}
            style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
            disabled={!canIupdateCustomization}
          />
          <TextInput
            label={translate("Title in Arabic", "العنوان بالعربية")}
            placeholder={translate("Title in Arabic", "العنوان بالعربية")}
            value={titleAr}
            onChange={(e) => setTitleAr(e.currentTarget.value)}
            style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
            disabled={!canIupdateCustomization}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <h5>{translate("Content", "المحتوى")}</h5>
          <span className="font-bold text-red-500">*</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <Textarea
            label={translate("Content in English", "المحتوى بالإنجليزية")}
            placeholder={translate("Content in English", "المحتوى بالإنجليزية")}
            value={contentEn}
            onChange={(e) => setContentEn(e.currentTarget.value)}
            style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
            autosize
            minRows={3}
            disabled={!canIupdateCustomization}
          />
          <Textarea
            label={translate("Content in Arabic", "المحتوى بالعربية")}
            placeholder={translate("Content in Arabic", "المحتوى بالعربية")}
            value={contentAr}
            onChange={(e) => setContentAr(e.currentTarget.value)}
            style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
            autosize
            minRows={3}
            disabled={!canIupdateCustomization}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h5>{translate("Social Media Links", "روابط وسائل التواصل الاجتماعي")}</h5>
        <p>
          {translate(
            "Leave the field empty if you don't have an account on a specific platform.",
            "اترك الحقل فارغًا إذا لم تمتلك حسابًا على منصة معينة.",
          )}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            label={translate("Facebook", "فيسبوك")}
            placeholder={translate("Facebook", "فيسبوك")}
            value={facebook}
            onChange={(e) => setFacebook(e.currentTarget.value)}
            disabled={!canIupdateCustomization}
          />
          <TextInput
            label={translate("Instagram", "إنستغرام")}
            placeholder={translate("Instagram", "إنستغرام")}
            value={instagram}
            onChange={(e) => setInstagram(e.currentTarget.value)}
            disabled={!canIupdateCustomization}
          />
          <TextInput
            label={translate("Twitter", "تويتر")}
            placeholder={translate("Twitter", "تويتر")}
            value={twitter}
            onChange={(e) => setTwitter(e.currentTarget.value)}
            disabled={!canIupdateCustomization}
          />
          <TextInput
            label={translate("WhatsApp", "واتساب")}
            placeholder={translate("WhatsApp", "واتساب")}
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.currentTarget.value)}
            disabled={!canIupdateCustomization}
          />
          <TextInput
            label={translate("TikTok", "تيك توك")}
            placeholder={translate("TikTok", "تيك توك")}
            value={tiktok}
            onChange={(e) => setTiktok(e.currentTarget.value)}
            disabled={!canIupdateCustomization}
          />
        </div>
      </div>

      <hr />

      <div className="flex flex-col gap-1">
        <h5>{translate("Barcode Sticker Settings", "إعدادات ملصق الباركود")}</h5>
        <p>
          {translate(
            "Select which information to display on barcode printable stickers.",
            "حدد المعلومات التي تريد عرضها على ملصقات الباركود القابلة للطباعة.",
          )}
        </p>
        <div className="flex flex-col gap-2">
          <Checkbox
            label={translate("Show Subcategory", "إظهار الفئة الفرعية")}
            checked={showSubcategory}
            onChange={(e) => setShowSubcategory(e.currentTarget.checked)}
            disabled={!canIupdateCustomization}
          />
          <Checkbox
            label={translate("Show Color", "إظهار اللون")}
            checked={showColor}
            onChange={(e) => setShowColor(e.currentTarget.checked)}
            disabled={!canIupdateCustomization}
          />
          <Checkbox
            label={translate("Show Size", "إظهار الحجم")}
            checked={showSize}
            onChange={(e) => setShowSize(e.currentTarget.checked)}
            disabled={!canIupdateCustomization}
          />
        </div>
      </div>

      {error && <ErrorAlert error={error} />}

      {canIupdateCustomization && (
        <Button variant="gradient" radius={100} type="submit" loading={loading} size="lg" disabled={!isDataChanged}>
          {translate("Save", "حفظ")}
        </Button>
      )}
    </form>
  );
}
