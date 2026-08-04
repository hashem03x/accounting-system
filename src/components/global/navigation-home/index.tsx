import { useEffect, useRef } from "react";
import paths from "@/utils/constants/paths";
import { isAdmin, isModerator, isRepresentative } from "@/utils/constants/roles";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useMainCategories } from "@/context/MainCategoriesContext";
import { Button } from "@mantine/core";
import { outlineIcons, solidIcons } from "@/components/icons";
import Logo from "@/components/global/logo";
import translate from "@/utils/helpers/translate";
import MobileDrawer from "./components/mobile-drawer";
import HeaderTooltipButton from "./components/header-tooltip-button";
import HeaderMainCategoryButton from "./components/header-main-category-button";

export default function Header({ height }: { height: string }) {
  const { language, toggleLanguage, translations } = useLanguage();
  const { user } = useUser();
  const { data: cart } = useCart();
  const { data: mainCategories } = useMainCategories();

  const [opened, { open, close }] = useDisclosure(false);

  // The following code is for horizontal scrolling of main categories
  const navRef = useRef<HTMLDivElement>(null);
  function handleScroll(event: WheelEvent) {
    if (navRef.current) {
      event.preventDefault(); // Prevent default vertical scroll
      if (language === "ar-EG") navRef.current.scrollLeft += event.deltaY * -1;
      else navRef.current.scrollLeft += event.deltaY;
    }
  }
  useEffect(() => {
    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener("wheel", handleScroll, { passive: false });
      return () => navElement.removeEventListener("wheel", handleScroll);
    }
  }, [language]);

  return (
    <header className="sticky top-0 z-40 flex bg-white shadow" style={{ height }}>
      <div className="container relative flex items-center justify-between gap-4 px-4">
        {/* Logo & Categories */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Logo linkToHome />
          </div>
          <div className="block md:hidden">
            <Logo linkToHome title={translations.appName} />
          </div>
          {mainCategories && (
            <div className="hidden md:block">
              <nav
                ref={navRef}
                className="hide-scrollbar flex gap-2 overflow-x-auto scroll-smooth md:max-w-[385px] lg:max-w-[615px] xl:max-w-[845px]"
              >
                {mainCategories.map((category) => (
                  <HeaderMainCategoryButton
                    key={category._id}
                    to={`${paths.categories}/${category._id}`}
                    label={translate(language, category.name.en, category.name.ar)}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Navigation Menu Button */}
        <div className="block md:hidden">
          <Button variant="light" color="dark" p="xs" onClick={open}>
            <solidIcons.Bars3 size={23.75} />
          </Button>
        </div>

        {/* Navigation - User Actions */}
        <nav className="relative hidden items-center justify-end font-semibold md:flex">
          <HeaderTooltipButton
            icon={null}
            label={translations.toggleLanguage}
            children={translate(language, "عربي", "English")}
            onClick={toggleLanguage}
          />

          <HeaderTooltipButton
            to={`/${paths.products}?page=1`}
            label={translate(language, "Search", "بحث")}
            icon={solidIcons.Search}
          />

          {user && (isAdmin(user.role) || isModerator(user.role) || isRepresentative(user.role)) ? (
            <HeaderTooltipButton to={paths.admin} label={translations.adminPanel} icon={solidIcons.Adjustments} />
          ) : (
            <>
              <HeaderTooltipButton
                to={paths.wishlist}
                label={translate(language, "Wishlist", "المفضلة")}
                icon={outlineIcons.Heart}
              />

              <HeaderTooltipButton
                to={paths.cart}
                label={translate(language, "Shopping Cart", "عربة التسوق")}
                icon={outlineIcons.ShoppingBag}
                extraContent={
                  cart.cartItems.length > 0 && (
                    <div className="flex-center pointer-events-none absolute -bottom-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white">
                      <span style={{ fontSize: "0.75rem" }}>{cart.cartItems.length}</span>
                    </div>
                  )
                }
              />
            </>
          )}

          <HeaderTooltipButton
            to={user ? paths.profile : paths.login}
            label={user ? user.name : translate(language, "Login", "تسجيل الدخول")}
            icon={outlineIcons.UserCircle}
          />
        </nav>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer opened={opened} close={close} />
    </header>
  );
}
