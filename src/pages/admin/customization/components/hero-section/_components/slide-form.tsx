import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useHero } from "@/context/HeroContext";
import { useLanguage } from "@/context/LanguageContext";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import ratios, { getRatioLabel } from "@/utils/constants/ratios";
import { Slide as SlideType } from "@/types/slide";
import { TextInput, Button, ColorInput, Textarea, Switch, Timeline, createTheme, MantineProvider } from "@mantine/core";
import ImgController from "@/components/ui/img-controller";
import DeleteSlideModal from "./delete-slide-modal";
import ErrorAlert from "@/components/ui/error-alert";

const theme = createTheme({
  cursorType: "pointer",
});

export default function SlideForm({ close, updating }: { close: () => void; updating?: SlideType }) {
  const { translate, language, translations } = useLanguage();

  const { setData: setSlides } = useHero();

  const [desktopImg, setDesktopImg] = useState<File | string | null>(updating?.desktopImg || null);
  const [mobileImg, setMobileImg] = useState<File | string | null>(updating?.mobileImg || null);
  const [titleEn, setTitleEn] = useState(updating?.title.en || "");
  const [titleAr, setTitleAr] = useState(updating?.title.ar || "");
  const [titleColor, setTitleColor] = useState(updating?.titleColor || "#ee5555");
  const [descriptionEn, setDescriptionEn] = useState(updating?.description.en || "");
  const [descriptionAr, setDescriptionAr] = useState(updating?.description.ar || "");
  const [descriptionColor, setDescriptionColor] = useState(updating?.descriptionColor || "#555555");
  const [buttonColor, setButtonColor] = useState(updating?.shopNowButton.color || "#ee5555");
  const [showButton, setShowButton] = useState<boolean>(updating ? updating.shopNowButton.show : true);
  const [published, setPublished] = useState<boolean>(updating ? updating.published : true);

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!desktopImg) return setError(translate("Desktop image is required.", "صورة سطح المكتب مطلوبة."));
    if (!mobileImg) return setError(translate("Mobile image is required.", "صورة الجوال مطلوبة."));

    handleRequest(language, setLoading, setError, async () => {
      const formData = new FormData();

      if (desktopImg instanceof File) formData.append("desktopImg", desktopImg);
      if (mobileImg instanceof File) formData.append("mobileImg", mobileImg);
      formData.append("title[en]", titleEn);
      formData.append("title[ar]", titleAr);
      formData.append("titleColor", titleColor);
      formData.append("description[en]", descriptionEn);
      formData.append("description[ar]", descriptionAr);
      formData.append("descriptionColor", descriptionColor);
      formData.append("shopNowButton[show]", showButton.toString());
      formData.append("shopNowButton[color]", buttonColor);
      formData.append("published", published.toString());

      const res = await privateRequest({
        url: updating ? `hero-section/${updating._id}` : "hero-section",
        method: updating ? "PUT" : "POST",
        data: formData,
        language,
      });

      setSlides((prev) =>
        updating ? prev.map((slide) => (slide._id === updating._id ? res.data : slide)) : [res.data, ...prev],
      );

      close();
    });
  };

  const title = updating ? translate("Update Slide", "تحديث الشريحة") : translate("Add New Slide", "إضافة شريحة جديدة");

  return (
    <>
      <form onSubmit={handleSubmit} className="flex animate-fade-in flex-col gap-4 rounded-md border p-4 shadow">
        <header className="flex items-center justify-between gap-2">
          <h3>{title}</h3>

          {updating && (
            <Button variant="light" color="red" onClick={openDeleteModal}>
              {translate("Delete Slide", "حذف الشريحة")}
            </Button>
          )}
        </header>

        <hr />

        <Timeline bulletSize={21} lineWidth={2} active={5}>
          <Timeline.Item bullet={1} title={translate("Select Images (Required)", "اختر الصور (مطلوب)")}>
            <div className="py-1"></div>
            <p className="mb-2">
              {translate(
                `Upload images for the slide. The desktop image should have a ratio of (${getRatioLabel(ratios.slide.desktop)}) and the mobile image should have a ratio of (${getRatioLabel(ratios.slide.mobile)}).`,
                `قم بتحميل الصور للشريحة. يجب أن تكون صورة سطح المكتب عريضة بنسبة (${getRatioLabel(ratios.slide.desktop)}) وصورة الجوال طويلة بنسبة (${getRatioLabel(ratios.slide.mobile)}).`,
              )}
            </p>
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex flex-col gap-2" style={{ width: "415px", maxWidth: "100%" }}>
                <h5>
                  {translate("Desktop Image", "صورة سطح المكتب")} <span className="text-red-500">*</span>
                </h5>
                <ImgController
                  image={desktopImg}
                  setImage={setDesktopImg}
                  style={{ aspectRatio: ratios.slide.desktop }}
                  mini={window.innerWidth < 768}
                />
              </div>
              <div className="flex flex-col gap-2" style={{ width: "92px", maxWidth: "100%" }}>
                <h5 className="text-nowrap">
                  {translate("Mobile Image", "صورة الجوال")} <span className="text-red-500">*</span>
                </h5>
                <ImgController image={mobileImg} setImage={setMobileImg} style={{ aspectRatio: ratios.slide.mobile }} mini />
              </div>
            </div>
          </Timeline.Item>

          <Timeline.Item bullet={2} title={translate("Slide Title", "عنوان الشريحة")}>
            <div className="py-1"></div>
            <p>{translate("(Leave the title empty to hide it)", "(اترك العنوان فارغًا لإخفائه)")}</p>
            <div className="flex flex-wrap gap-3">
              <TextInput
                label={translate("Title in English", "العنوان بالإنجليزية")}
                placeholder={translate("Title in English", "العنوان بالإنجليزية")}
                value={titleEn}
                onChange={(e) => setTitleEn(e.currentTarget.value)}
                style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
              />
              <TextInput
                label={translate("Title in Arabic", "العنوان بالعربية")}
                placeholder={translate("Title in Arabic", "العنوان بالعربية")}
                value={titleAr}
                onChange={(e) => setTitleAr(e.currentTarget.value)}
                style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
              />
              <ColorInput
                label={translate("Title Color", "لون العنوان")}
                placeholder={translate("Title Color", "لون العنوان")}
                value={titleColor}
                onChange={setTitleColor}
                style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
              />
            </div>
          </Timeline.Item>

          <Timeline.Item bullet={3} title={translate("Slide Description", "وصف الشريحة")}>
            <div className="py-1"></div>
            <p>{translate("(Leave the description empty to hide it)", "(اترك الوصف فارغًا لإخفائه)")}</p>
            <div className="flex flex-wrap gap-4">
              <Textarea
                label={translate("Description in English", "الوصف بالإنجليزية")}
                placeholder={translate("Description in English", "الوصف بالإنجليزية")}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.currentTarget.value)}
                style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
                autosize
                minRows={3}
              />
              <Textarea
                label={translate("Description in Arabic", "الوصف بالعربية")}
                placeholder={translate("Description in Arabic", "الوصف بالعربية")}
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.currentTarget.value)}
                style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
                autosize
                minRows={3}
              />
              <ColorInput
                label={translate("Description Color", "لون الوصف")}
                placeholder={translate("Description Color", "لون الوصف")}
                value={descriptionColor}
                onChange={setDescriptionColor}
                style={{ minWidth: "250px", maxWidth: "100%", flex: 1 }}
              />
            </div>
          </Timeline.Item>

          {/* To give switches the correct cursor type */}
          <MantineProvider theme={theme} />

          <Timeline.Item bullet={4} title={translate("Button Settings", "إعدادات الزر")}>
            <div className="flex flex-col gap-3">
              <Switch
                pt={8}
                label={translate("Show (Shop Now) Button", "إظهار زر (تسوق الآن)")}
                checked={showButton}
                onChange={(e) => setShowButton(e.currentTarget.checked)}
              />
              {showButton && (
                <ColorInput
                  label={translate("Button Color", "لون الزر")}
                  placeholder={translate("Button Color", "لون الزر")}
                  value={buttonColor}
                  onChange={setButtonColor}
                  style={{ flex: 1 }}
                />
              )}
            </div>
          </Timeline.Item>

          <Timeline.Item bullet={5} title={translate("Publish", "نشر")}>
            <Switch
              pt={8}
              checked={published}
              onChange={(e) => setPublished(e.currentTarget.checked)}
              label={published ? translate("Published", "منشور") : translate("Draft", "مسودة")}
              description={translate(
                "You can save the slide as a draft to publish it later.",
                "يمكنك حفظ الشريحة كمسودة لنشرها لاحقًا.",
              )}
            />
          </Timeline.Item>
        </Timeline>

        <hr />

        {error && <ErrorAlert error={error} />}

        <div className="flex gap-2">
          <Button onClick={close} color="dark" variant="light">
            {translations.cancel}
          </Button>
          <Button type="submit" loading={loading}>
            {title}
          </Button>
        </div>
      </form>

      {updating && <DeleteSlideModal opened={deleteModalOpened} close={closeDeleteModal} id={updating._id} />}
    </>
  );
}
