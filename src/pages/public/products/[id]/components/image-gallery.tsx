import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import Img from "@/components/ui/img";
import ratios from "@/utils/constants/ratios";
import { UploadedImage } from "@/types/global";
import { outlineIcons } from "@/components/icons";
import placeholderImage from "@/assets/placeholder.jpg";

// Image thumbnail div may need to be more responsive

export default function ImageGallery({
  images,
  discountPercentage,
}: {
  images: UploadedImage[];
  discountPercentage: number;
}) {
  const { translate } = useLanguage();

  const [activeImage, setActiveImage] = useState(placeholderImage);
  const [isOpened, setIsOpened] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)"); // Breakpoint for mobile devices

  const handleImageClick = (url: string) => setActiveImage(url);
  const handleOpen = () => setIsOpened(!isOpened);

  useEffect(() => {
    setActiveImage(images[0]?.url || placeholderImage);
  }, [images]);

  return (
    <div className="flex flex-col-reverse gap-2 md:flex-row md:gap-4">
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex gap-2.5 md:flex-col">
          {images.map((image) => (
            <Img
              key={image._id}
              src={image.url}
              alt="Thumbnail"
              width={isMobile ? "60px" : "75px"}
              aspectRatio={ratios.product}
              className={`cursor-pointer rounded border transition ${activeImage === image.url ? "border-blue-500" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => handleImageClick(image.url)}
            />
          ))}
        </div>
      )}

      {/* Active image */}
      <div className="relative w-full">
        <Img
          src={activeImage}
          alt="Product Image"
          className="rounded" // cursor-zoom-in
          aspectRatio={ratios.product}
          width="100%"
        />

        <button
          onClick={handleOpen}
          className="absolute right-2.5 top-2.5 rounded-full border bg-white p-2"
          title={translate("Full Screen", "عرض كامل")}
        >
          <outlineIcons.Fullscreen size={21} />
        </button>

        {discountPercentage > 0 ? (
          <div className="absolute left-3.5 top-5 rotate-[-10deg] rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-md">
            {translate("Save", "وفر")}{" "}
            {discountPercentage < 10 ? discountPercentage.toFixed(2) : discountPercentage.toFixed()}%
          </div>
        ) : null}
      </div>

      {isOpened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={handleOpen}>
          <img src={activeImage} alt="Product Image" className="max-h-full max-w-full rounded" />
        </div>
      )}
    </div>
  );
}
