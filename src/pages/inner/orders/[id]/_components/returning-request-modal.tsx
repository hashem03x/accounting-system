import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import useDataHandler from "@/hooks/useDataHandler";
import handleApiRequest from "@/utils/helpers/handle-request";
import { SalesOrder, SalesOrderItem } from "@/types/orders";
import { Alert, Button, NumberInput } from "@mantine/core";
import Modal from "@/components/ui/modal";
import ErrorAlert from "@/components/ui/error-alert";
import { solidIcons } from "@/components/icons";

export default function ReturningRequestModal({
  opened,
  close,
  item,
  setOrder,
}: {
  opened: boolean;
  close: () => void;
  item: SalesOrderItem;
  setOrder: React.Dispatch<React.SetStateAction<SalesOrder>>;
}) {
  const { language, translate, translations } = useLanguage();
  const { id } = useParams<{ id: string }>();

  const [quantity, setQuantity] = useState<string | number>("");
  const [success, setSuccess] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  const soldQuantity = item.starterQuantity - item.returnedQuantity;

  const sendReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (+quantity > soldQuantity) {
      return setError(
        translate(
          "The quantity you entered is more than the quantity you can return",
          "الكمية التي أدخلتها أكبر من الكمية التي يمكنك إرجاعها",
        ),
      );
    }

    await handleApiRequest(language, setLoading, setError, async () => {
      const res = await privateRequest({
        language,
        method: "PUT",
        url: `sale-orders/online/${id}/cancel-items`,
        data: { quantityToBeReturned: quantity, variantId: item.variant._id },
      });

      setOrder(res.data);
      setSuccess(true);
      setTimeout(() => handleClose(), 2500);
    });
  };

  const cancelRequest = async () => {
    await handleApiRequest(language, setCancelling, setError, async () => {
      const res = await privateRequest({
        language,
        method: "PUT",
        url: `sale-orders/online/${id}/cancel-items`,
        data: { quantityToBeReturned: 0, variantId: item.variant._id },
      });

      setOrder(res.data);
      handleClose();
    });
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      setQuantity("");
      setError("");
      setSuccess(false);
    }, 250);
  };

  const title = translate("Return Item", "إرجاع العنصر");

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={title + ` ` + translate(item.variant.product.title.en, item.variant.product.title.ar)}
    >
      {success ? (
        <Alert color="teal" title={translate("Success", "نجاح")} icon={<solidIcons.CheckCircle />} radius="md">
          {translate(
            "Your request has been sent successfully to admins, you will be notified with the result soon",
            "تم إرسال طلبك بنجاح إلى الإدارة، ستتلقى إشعار بالنتيجة قريبًا",
          )}
        </Alert>
      ) : (
        <form onSubmit={sendReturnRequest} className="flex flex-col gap-3">
          {/* If the quantity to be returned is greater than 0, show this message */}
          {item.quantityToBeReturned > 0 && (
            <div className="flex items-center gap-2">
              <solidIcons.ExclamationCircle className="text-red-500" />
              <span className="text-xs text-gray-800 sm:text-sm">
                {translate(
                  `You already requested to return ${item.quantityToBeReturned} of this item`,
                  `لقد طلبت بالفعل إرجاع ${item.quantityToBeReturned} من هذا العنصر`,
                )}
              </span>
              <button
                type="button"
                className="text-xs text-red-500 hover:underline disabled:hover:no-underline sm:text-sm"
                disabled={cancelling}
                onClick={cancelRequest}
              >
                {cancelling ? translate("Cancelling...", "جاري الإلغاء...") : translate("Cancel?", "تراجع؟")}
              </button>
            </div>
          )}

          <NumberInput
            label={translate("Quantity To Be Returned", "الكمية المراد إرجاعها")}
            placeholder={translate("Quantity To Be Returned", "الكمية المراد إرجاعها")}
            required
            max={soldQuantity}
            min={0}
            clampBehavior="strict"
            allowNegative={false}
            decimalScale={0}
            value={quantity}
            onChange={setQuantity}
          />

          <div className="flex gap-2">
            <Button onClick={handleClose} variant="light" color="dark" fullWidth>
              {translations.cancel}
            </Button>
            <Button type="submit" loading={loading} disabled={!quantity} fullWidth>
              {title}
            </Button>
          </div>

          {error && <ErrorAlert error={error} />}
        </form>
      )}
    </Modal>
  );
}
