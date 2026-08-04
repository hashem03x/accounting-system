import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import paths from "@/utils/constants/paths";
import { getColorLabel } from "@/utils/constants/colors";
import { SalesOrder, SalesOrderItem } from "@/types/orders";
import { Button, Table, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import { solidIcons } from "@/components/icons";
import ReturningRequestModal from "./returning-request-modal";

export default function ItemRow({
  item,
  isThereAnyReturnedItem,
  isThereAnyReturningRequest,
  lessThan15DaysPassed,
  setOrder,
}: {
  item: SalesOrderItem;
  isThereAnyReturnedItem: boolean;
  isThereAnyReturningRequest: boolean;
  lessThan15DaysPassed: boolean;
  setOrder: React.Dispatch<React.SetStateAction<SalesOrder>>;
}) {
  const { translate, language, translations } = useLanguage();

  const [returningModalOpened, { open: openReturningModal, close: closeReturningModal }] = useDisclosure();

  return (
    <Table.Tr className="text-gray-600" h={40}>
      {/* Product Title */}
      <Table.Td className="font-bold text-gray-800">
        <Link target="_blank" to={`/${paths.products}/${item.variant.product._id}`} className="hover:underline">
          {translate(item.variant.product.title.en, item.variant.product.title.ar)}
        </Link>
      </Table.Td>
      {/* Color */}
      <Table.Td>{getColorLabel(item.variant.color, language)}</Table.Td>
      {/* Size */}
      <Table.Td>{item.variant.size}</Table.Td>
      {/* Quantity */}
      <Table.Td>{item.starterQuantity}</Table.Td>
      {/* Returned */}
      {isThereAnyReturnedItem && <Table.Td>{item.returnedQuantity}</Table.Td>}
      {/* Requesting Return */}
      {isThereAnyReturningRequest && (
        <Table.Td>
          <Tooltip withArrow label={translate("You requested to return this quantity", "لقد طلبت إرجاع هذه الكمية")}>
            <span className="animate-pulse font-bold text-red-500">{item.quantityToBeReturned}</span>
          </Tooltip>
        </Table.Td>
      )}
      {/* Unit Price */}
      <Table.Td>
        {item.unitPrice.toFixed(2)} {translations.currency}
      </Table.Td>
      {/* Discount */}
      <Table.Td>
        {item.itemDiscount.value > 0 ? (
          <div className="flex items-center gap-1">
            {item.itemDiscount.type === "percentage" ? (
              <span>{item.itemDiscount.value}%</span>
            ) : (
              <span>
                {item.itemDiscount.value.toFixed(2)} {translations.currency}
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs sm:text-sm">{translate("No Discount", "لا يوجد خصم")}</p>
        )}
      </Table.Td>
      {/* Unit Price After Discount */}
      <Table.Td>
        {item.unitPriceAfterDiscount.toFixed(2)} {translations.currency}
      </Table.Td>
      {/* Subtotal */}
      <Table.Td className="font-bold text-gray-800">
        {item.subtotal.toFixed(2)} {translations.currency}
      </Table.Td>
      {/* Return Option */}
      {lessThan15DaysPassed && (
        <Table.Td>
          {item.starterQuantity - item.returnedQuantity > 0 && (
            <Tooltip withArrow label={translate("Return Item", "إرجاع العنصر")}>
              <Button variant="transparent" size="xs" p="0" onClick={openReturningModal}>
                <solidIcons.Return size={19} />
              </Button>
            </Tooltip>
          )}
        </Table.Td>
      )}

      {/* Returning Modal */}
      <ReturningRequestModal opened={returningModalOpened} close={closeReturningModal} item={item} setOrder={setOrder} />
    </Table.Tr>
  );
}
