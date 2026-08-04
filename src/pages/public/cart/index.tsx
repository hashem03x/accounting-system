import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import paths from "@/utils/constants/paths";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import CartSummary from "./components/cart-summary";
import CartItems from "./components/cart-items";

export default function Cart() {
  const { translations, translate } = useLanguage();

  useDocumentTitle(`${translate("Shopping Cart", "عربة التسوق")} | ${translations.appName}`);

  return (
    <div className="root-flex-1 container flex flex-col gap-6 p-4">
      <header className="flex items-center justify-between">
        <h1>{translate("Shopping Cart", "عربة التسوق")}</h1>
        <Link to={`/${paths.orders}`}>
          <Button variant="light" size="xs">
            <span style={{ fontWeight: 400 }}>{translate("View Orders", "عرض الطلبات")}</span>
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:flex-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartItems />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
