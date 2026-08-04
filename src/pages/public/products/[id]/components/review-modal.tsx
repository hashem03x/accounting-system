import { useLanguage } from "@/context/LanguageContext";
import Modal from "@/components/ui/modal";
import { Review } from "@/types/review";
import React, { useState } from "react";
import { Button, Rating } from "@mantine/core";
import handleRequest from "@/utils/helpers/handle-request";
import useDataHandler from "@/hooks/useDataHandler";
import { Product } from "@/types/product";
import { useUser } from "@/context/UserContext";
import ErrorAlert from "@/components/ui/error-alert";
import apiRequest from "@/utils/helpers/api-request";
import { filterProduct } from "@/utils/helpers/product-helpers";
import { outlineIcons } from "@/components/icons";

export default function ReviewModal({
  opened,
  close,
  product,
  setProduct,
  review,
  setReview,
}: {
  opened: boolean;
  close: () => void;
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  review: Review | null;
  setReview: React.Dispatch<React.SetStateAction<Review | null>>;
}) {
  const { translate, language } = useLanguage();

  const { user } = useUser();

  const [value, setValue] = useState(review?.rating || 0);

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  function handleReview() {
    handleRequest(language, setLoading, setError, async () => {
      const response = await privateRequest({
        method: review ? "PUT" : "POST",
        url: review ? `reviews/${review._id}` : "reviews",
        data: { rating: value, user: user?._id, product: product._id },
        language,
      });
      setReview(response.data);
      await reFetchProduct();
      handleClose();
    });
  }

  function deleteReview() {
    handleRequest(language, setLoading, setError, async () => {
      await privateRequest({ method: "DELETE", url: `reviews/${review?._id}`, language });
      setReview(null);
      setValue(0);
      await reFetchProduct();
      handleClose();
    });
  }

  // This function is called to get the latest rating totals
  async function reFetchProduct() {
    handleRequest(language, setLoading, setError, async () => {
      const response = await apiRequest({ url: `products/${product._id}`, language });
      const filteredProduct = filterProduct(response.data);
      setProduct(filteredProduct);
    });
  }

  function handleClose() {
    close();
    setTimeout(() => {
      setError("");
    }, 250);
  }

  const title = translate(`${review ? "Update" : "Add"} Rating`, `${review ? "تحديث التقييم" : "إضافة تقييم"}`);

  return (
    <Modal opened={opened} onClose={close}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-center">{title}</h3>
          <p className="text-sm">
            {translate("Please rate the product based on your experience.", "يرجى تقييم المنتج بناءً على تجربتك.")}
          </p>
        </div>
        <Rating value={value} onChange={setValue} size="lg" dir={"ltr"} />
        <div className="flex w-full flex-col gap-1">
          <div className="flex gap-2">
            <Button
              color="orange"
              onClick={handleReview}
              fullWidth
              radius="md"
              disabled={loading || value === 0 || (!!review && review.rating === value)}
            >
              {title}
            </Button>
            {review && (
              <Button variant="light" color="red" onClick={deleteReview} disabled={loading} radius="md">
                <outlineIcons.Trash />
              </Button>
            )}
          </div>
          {error && <ErrorAlert fade error={error} />}
        </div>
      </div>
    </Modal>
  );
}
