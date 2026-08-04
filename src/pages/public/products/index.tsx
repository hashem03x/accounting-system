import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import FiltersProvider from "./context";
import Layout from "./layout";

export default function Products() {
  const { translations } = useLanguage();

  useDocumentTitle(`${translations.pages.products} | ${translations.appName}`);

  return (
    <FiltersProvider>
      <Layout />
    </FiltersProvider>
  );
}
