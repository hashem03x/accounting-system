import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import useGovernoratesHelpers from "@/hooks/useGovernoratesHelpers";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import { Address } from "@/types/user";
import { Button } from "@mantine/core";
import { solidIcons, outlineIcons } from "@/components/icons";

export default function AddressCard({ address, deleteOption = true }: { address: Address; deleteOption?: boolean }) {
  const { language, translate } = useLanguage();

  const { user, setUser } = useUser();

  const { getGovernorateNameById } = useGovernoratesHelpers();

  const { privateRequest, loading, setLoading, setError } = useDataHandler({ initialData: null });

  if (!user) return null;

  function handleDelete(id: string) {
    handleRequest(language, setLoading, setError, async () => {
      await privateRequest({
        url: `addresses/${id}`,
        method: "DELETE",
        language,
      });
      if (user) {
        const updatedAddresses = user.addresses?.filter((address) => address._id !== id) || [];
        setUser({ ...user, addresses: updatedAddresses });
      }
    });
  }

  return (
    <div className="relative flex h-full flex-col gap-2 rounded border bg-gray-50 p-4">
      <AddressItem
        Icon={solidIcons.Government}
        title={translate("Governorate", "المحافظة")}
        value={getGovernorateNameById(address.governorate)}
      />
      <AddressItem Icon={solidIcons.Pin} title={translate("City", "المدينة")} value={address.city} />
      <AddressItem Icon={solidIcons.Road} title={translate("Street", "الشارع")} value={address.street} />
      {address.landmark && (
        <AddressItem Icon={solidIcons.MapMarked} title={translate("Landmarks", "علامات")} value={address.landmark} />
      )}
      {address.details && (
        <AddressItem Icon={solidIcons.Map} title={translate("Details", "التفاصيل")} value={address.details} />
      )}
      <AddressItem Icon={solidIcons.Phone} title={translate("Phone", "الهاتف")} value={address.phone} />

      {deleteOption && (
        <div className={`absolute ${translate("right-2", "left-2")} top-2 transition-opacity`}>
          <Button
            variant="light"
            color="red"
            style={{ padding: "5px 10px", border: "1px solid #f885" }}
            loading={loading}
            onClick={() => handleDelete(address._id)}
          >
            <outlineIcons.Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// =============================================================

function AddressItem({ Icon, title, value }: { Icon: any; title: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-gray-800 sm:text-base">
      <div className="flex items-center gap-2" style={{ fontWeight: 500 }}>
        <Icon className="h-4 w-4" />
        {title}:
      </div>
      {value}
    </div>
  );
}
