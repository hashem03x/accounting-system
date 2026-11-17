import { useCallback, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Color } from "@/types/product";
import { UploadedImage } from "@/types/global";
import ratios, { getRatioLabel } from "@/utils/constants/ratios";
import { colorsArray, getColorLabel } from "@/utils/constants/colors";
import { ActionIcon, Autocomplete, Button, ColorInput } from "@mantine/core";
import { solidIcons, outlineIcons } from "@/components/icons";
import MultiImgsController from "@/components/ui/img-controller-multi";
import Img from "@/components/ui/img";
import { useProduct } from "../../context";

const IMAGE_WIDTH = "120px";

const MAX_IMAGES = 5;

// Quick-pick swatches for the picker's popover - purely a UI shortcut for the common predefined
// color names in colors.ts, not a data contract: the stored value is still whatever HEX string
// ends up in `code` (typed manually, picked from the saturation/hue area, or one of these), same
// as before this feature existed. Intentionally kept local to this file rather than added to
// colors.ts, since it's a presentation detail of this one picker, not something other
// consumers of the Color/colorsArray exports (variant-modal, Filters, product-card, ...) need.
const HEX_SWATCHES = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#008000",
  "#0000FF",
  "#FFFF00",
  "#FFA500",
  "#A52A2A",
  "#FFFDD0",
  "#808000",
  "#000080",
  "#FFC0CB",
  "#808080",
  "#800080",
  "#6F4E37",
  "#F5F5DC",
  "#F0E68C",
  "#FFD700",
  "#C0C0C0",
  "#800000",
  "#008080",
];

const HEX_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function isValidHexColor(value: string) {
  return HEX_PATTERN.test(value.trim());
}

export default function ColorsInformation() {
  const { translate, language } = useLanguage();

  const { colors, setColors, readOnly, currentProduct } = useProduct();

  function addColor() {
    setColors([...colors, { name: "black", code: "", images: [] }]);
  }

  function removeColor(index: number) {
    setColors(colors.filter((_, i) => i !== index));
  }

  function handleChangeColorName(colorIndex: number, value: Color) {
    const newColors = [...colors];
    newColors[colorIndex].name = value;
    setColors(newColors);
  }

  function handleChangeColorCode(colorIndex: number, value: string) {
    const newColors = [...colors];
    newColors[colorIndex].code = value;
    setColors(newColors);
  }

  return (
    <div className="product-details-box">
      <h3>{translate("Available Colors", "الألوان المتوفرة")}</h3>

      {colors.map((colorData, colorIndex) => (
        <div key={colorIndex} className="border-b pb-4">
          <header className="flex items-center justify-between py-2">
            <h4>
              {translate("Color", "اللون")} {colorIndex + 1}
            </h4>
            {!currentProduct?.colors.find((c) => c.name === colorData.name) && (
              <Button
                onClick={() => removeColor(colorIndex)}
                leftSection={<outlineIcons.Trash />}
                variant="light"
                color="red"
                disabled={colors.length === 1}
                title={colors.length === 1 ? translate("At least one color is required", "مطلوب على الأقل لون واحد") : ""}
              >
                {translate("Remove Color", "إزالة اللون")}
              </Button>
            )}
          </header>

          {/* Color Name and Code */}
          <div className="flex gap-3">
            <Autocomplete
              className="flex-1"
              withAsterisk
              placeholder={translate("Type any color name", "اكتب اسم أي لون")}
              value={colorData.name}
              onChange={(value) => handleChangeColorName(colorIndex, value)}
              // Suggestions only - not a restriction. Any free text is accepted; these are just
              // the old predefined names, offered as a convenience for the common case.
              data={colorsArray.map((color) => color.value)}
              // readOnly={!!currentProduct?.colors.find((c) => c.name === colorData.name)}
              readOnly={readOnly}
            />
            <ColorInput
              className="flex-1"
              withAsterisk
              placeholder={translate("Color Code (e.g. #000000)", "درجة اللون (مثال: #000000)")}
              value={colorData.code}
              onChange={(value) => handleChangeColorCode(colorIndex, value)}
              readOnly={readOnly}
              format="hex"
              swatches={HEX_SWATCHES}
              error={
                colorData.code && !isValidHexColor(colorData.code)
                  ? translate("Enter a valid HEX color, e.g. #000000", "أدخل كود هيكس صالح، مثال: #000000")
                  : undefined
              }
              // No built-in `clearable` prop on this Mantine version's ColorInput - a manual clear
              // button replaces the (also built-in) eye-dropper button only while there's a value
              // to clear, so both affordances stay available depending on the field's state.
              rightSection={
                colorData.code && !readOnly ? (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => handleChangeColorCode(colorIndex, "")}
                    title={translate("Clear color", "مسح اللون")}
                  >
                    <solidIcons.XMark />
                  </ActionIcon>
                ) : undefined
              }
            />
          </div>

          {/* Selected color preview: swatch + name + HEX, matching the picker's current value */}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <span
              className="h-6 w-6 shrink-0 rounded-full border border-gray-300"
              style={{ backgroundColor: isValidHexColor(colorData.code || "") ? colorData.code : "transparent" }}
            />
            <span>
              {translate("Selected Color", "اللون المحدد")}: {getColorLabel(colorData.name, language)}
              {colorData.code && isValidHexColor(colorData.code) ? ` — ${translate("HEX", "هيكس")}: ${colorData.code.toUpperCase()}` : ""}
            </span>
          </div>

          {/* Images */}
          {readOnly ? (
            <ImagesViewer images={colorData.images as UploadedImage[]} />
          ) : (
            <ImagesHandler colorIndex={colorIndex} />
          )}
        </div>
      ))}

      {!readOnly && (
        <div>
          <Button onClick={addColor} variant="light" leftSection={<solidIcons.Plus />}>
            {colors.length === 0 ? translate("Add Color", "إضافة لون") : translate("Add Another Color", "إضافة لون آخر")}
          </Button>
        </div>
      )}
    </div>
  );
}

// =============================================================

function ImagesViewer({ images }: { images: UploadedImage[] }) {
  const { translate } = useLanguage();
  const { titleEn, titleAr } = useProduct();

  return (
    <div className="mt-4 flex gap-2">
      {images.map((image) => (
        <Img
          key={image._id}
          src={image.url}
          alt={translate(titleEn, titleAr)}
          aspectRatio={ratios.product}
          width={IMAGE_WIDTH}
          className="rounded-lg"
        />
      ))}
    </div>
  );
}

// =============================================================

function ImagesHandler({ colorIndex }: { colorIndex: number }) {
  const { translate } = useLanguage();
  const { colors, setColors } = useProduct();

  // Derived state for managing images for the specific color
  const initialImages = useMemo(() => colors[colorIndex]?.images || [], [colors, colorIndex]);
  const [images, setImages] = useState(initialImages);

  // Handle image deletion
  const handleImageDelete = useCallback(
    (imageIndex: number) => {
      setImages((prevImages) => {
        const updatedImages = prevImages.filter((_, i) => i !== imageIndex);

        // Update deleted images if the removed item is not a File
        const deletedImage = prevImages[imageIndex];
        if (deletedImage && !(deletedImage instanceof File)) {
          setColors((prevColors) => {
            const updatedColors = [...prevColors];
            const currentColor = updatedColors[colorIndex];
            if (currentColor) {
              currentColor.deleteImages = currentColor.deleteImages || [];
              currentColor.deleteImages.push(deletedImage._id);
            }
            return updatedColors;
          });
        }

        return updatedImages;
      });
    },
    [colorIndex, setColors],
  );

  // Sync images with the parent state
  useEffect(() => {
    const newColors = [...colors];
    newColors[colorIndex].images = images;
    setColors(newColors);
  }, [images]);

  return (
    <div className="mt-4">
      <div className="my-2">
        <span className="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
          {translate("Upload images for this color", "تحميل صور لهذا اللون")}
        </span>
        <p className="text-xs sm:text-sm">
          {translate(
            `Upload up to a maximum of ${MAX_IMAGES} images. Upload portrait images (${getRatioLabel(ratios.product)} ratio) for a better display.`,
            `قم بتحميل ما يصل إلى ${MAX_IMAGES} صور. قم بتحميل صور طولية (نسبة ${getRatioLabel(ratios.product)}) لكي تظهر بشكل أفضل.`,
          )}
        </p>
      </div>

      <MultiImgsController
        mini
        images={images}
        setImages={setImages}
        onClickOnImage={handleImageDelete}
        style={{ aspectRatio: ratios.product, width: IMAGE_WIDTH }}
      />
    </div>
  );
}
