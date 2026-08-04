import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { isCustomer } from "@/utils/constants/roles";
import MiniDivider from "@/components/ui/mini-divider";
import BasicInfoSection from "./components/basic-info-section";
import AddressesSection from "./components/addresses-section";

export default function Profile() {
  const { translate } = useLanguage();

  useDocumentTitle(translate("Profile", "الملف الشخصي"));

  const { user } = useUser();

  return (
    <div className="flex flex-col items-center gap-6 pb-12">
      <BasicInfoSection />
      <MiniDivider />
      {user && isCustomer(user.role) && <AddressesSection />}
    </div>
  );
}
