import useGovernoratesHelpers from "@/hooks/useGovernoratesHelpers";
import useStringifyOnlineAddress from "@/hooks/useStringifyOnlineAddress";
import { Address } from "@/types/user";
import { solidIcons } from "@/components/icons";

export default function AddressOption({
  address,
  onClick,
  selectedAddressId,
}: {
  address: Address;
  onClick: () => void;
  selectedAddressId: string;
}) {
  const { getGovernorateNameById } = useGovernoratesHelpers();

  const isSelected = selectedAddressId === address._id;

  return (
    <div
      className={`flex gap-3 rounded-xl bg-gray-100 p-4 transition ${!isSelected ? "cursor-pointer hover:bg-gray-200" : ""}`}
      onClick={onClick}
    >
      <div>
        {isSelected ? (
          <solidIcons.CheckCircle className="text-blue-500" size={25} />
        ) : (
          <solidIcons.Circle className="text-gray-300" size={25} />
        )}
      </div>

      <div className="flex flex-col gap-1 text-gray-800">
        <span>{getGovernorateNameById(address.governorate)}</span>
        <span>{useStringifyOnlineAddress(address, { excludeGovernorate: true })}</span>
        <span>{address.phone}</span>
      </div>
    </div>
  );
}
