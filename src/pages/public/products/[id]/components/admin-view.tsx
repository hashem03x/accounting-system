import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types/product";
import paths from "@/utils/constants/paths";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { solidIcons } from "@/components/icons";

export default function AdminView({ product }: { product: Product }) {
  const { translate } = useLanguage();

  return (
    <div className="flex flex-col items-center overflow-hidden rounded-md">
      <header className="flex w-full flex-wrap items-center justify-between gap-2 bg-gray-100 p-3">
        <div className="flex items-center gap-2.5">
          <solidIcons.Eye size={18} className="text-sky-950" />
          <p className="text-nowrap text-sky-950" style={{ fontWeight: 800 }}>
            {translate("Private to Admins", "خاص للمسؤولين")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/${paths.admin}/${paths.home}/${paths.products}/${product._id}`}>
            <Button color="dark" size="xs" style={{ fontWeight: 400 }}>
              {translate("Edit Product", "تعديل المنتج")}
            </Button>
          </Link>
          <Link to={`/${paths.admin}/${paths.home}`}>
            <Button color="dark" size="xs" style={{ fontWeight: 400 }}>
              {translate("Admin Panel", "لوحة التحكم")}
            </Button>
          </Link>
        </div>
      </header>
    </div>
  );
}
