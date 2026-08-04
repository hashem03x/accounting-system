import { useAbout } from "@/context/AboutContext";
import { useLanguage } from "@/context/LanguageContext";
import { useMainCategories } from "@/context/MainCategoriesContext";
import paths from "@/utils/constants/paths";
import translate from "@/utils/helpers/translate";
import { Link } from "react-router-dom";

export default function Footer() {
  const { language, translations } = useLanguage();
  const { data: about } = useAbout();
  const { data: mainCategories } = useMainCategories();

  return (
    <footer className="bg-gray-800 py-10 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Column 1: About Us */}
          <div className="md:col-span-2">
            <Link to={"/"} className="mb-4 block text-lg font-semibold text-gray-50">
              {translations.appName}
            </Link>
            {about && (
              <p style={{ lineHeight: "25px" }} className="max-w-[450px] text-xs text-gray-400 sm:text-sm">
                {translate(language, about.content.en, about.content.ar)}
              </p>
            )}
          </div>

          {/* Column 2: Shop */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-50">{translate(language, "Shop", "المتجر")}</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={paths.products} className="text-gray-400 hover:underline">
                  {translate(language, "Shop All", "تسوق الكل")}
                </Link>
              </li>
              {mainCategories &&
                mainCategories.map((category) => (
                  <li key={category._id}>
                    <Link to={`/${paths.categories}/${category._id}`} className="text-gray-400 hover:underline">
                      {translate(language, category.name.en, category.name.ar)}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-50">
              {translate(language, "Customer Care", "خدمة العملاء")}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={`/${paths.contact}`} className="text-gray-400 hover:underline">
                  {translate(language, "Contact Us", "تواصل معنا")}
                </Link>
              </li>
              <li>
                <Link to={`/${paths.terms}`} className="text-gray-400 hover:underline">
                  {translate(language, "Terms & Conditions", "الشروط والأحكام")}
                </Link>
              </li>
              <li>
                <Link to={`/${paths.policy}`} className="text-gray-400 hover:underline">
                  {translate(language, "Privacy Policy", "سياسة الخصوصية")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 text-center text-sm text-gray-400">
          {translate(language, "All rights reserved", "كل الحقوق محفوظة")} &copy; {new Date().getFullYear()}{" "}
          {translations.appName}
        </div>
      </div>
    </footer>
  );
}
