import { useHero } from "@/context/HeroContext";
import { useLanguage } from "@/context/LanguageContext";
import handleRequest from "@/utils/helpers/handle-request";
import useDataHandler from "@/hooks/useDataHandler";
import DeleteModal from "@/components/ui/delete-modal";

export default function DeleteSlideModal({ opened, close, id }: { opened: boolean; close: () => void; id: string }) {
  const { translate, language } = useLanguage();

  const { data: currentSlides, setData: setCurrentSlides } = useHero();

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  function handleDelete() {
    handleRequest(language, setLoading, setError, async () => {
      await privateRequest({ method: "DELETE", url: `hero-section/${id}`, language });
      setCurrentSlides(currentSlides.filter((slide) => slide._id !== id));
      handleClose();
    });
  }

  function handleClose() {
    close();
    setTimeout(() => setError(""), 250);
  }

  return (
    <DeleteModal
      opened={opened}
      onClose={handleClose}
      title={translate(`Delete Slide`, `حذف الشريحة`)}
      subTitle={translate(`Are you sure you want to delete this slide?`, `هل أنت متأكد أنك تريد حذف هذه الشريحة؟`)}
      action={handleDelete}
      loading={loading}
      error={error}
    />
  );
}
