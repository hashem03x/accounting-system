import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import AddAddresses from "@/components/global/add-address";
import AddressCard from "@/pages/inner/profile/components/address-card";
import noAddresses from "@/assets/no-addresses.png";
import EmptySection from "@/components/ui/sections/empty";

export default function AddressesSection() {
  const { translate } = useLanguage();

  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="container flex flex-col items-center gap-6 px-4">
      <h3>{translate("Addresses", "العناوين")}</h3>
      {user.addresses.length === 0 ? (
        <EmptySection
          img={noAddresses}
          message={translate("You don't have any addresses yet", "ليس لديك أي عناوين بعد")}
          className="w-full py-12"
        />
      ) : (
        <div className={`grid w-full grid-cols-1 gap-4 ${user.addresses.length === 1 ? "" : "sm:grid-cols-2"}`}>
          {user.addresses.map((address) => (
            <AddressCard key={address._id} address={address} />
          ))}
        </div>
      )}

      <AddAddresses />
    </div>
  );
}
