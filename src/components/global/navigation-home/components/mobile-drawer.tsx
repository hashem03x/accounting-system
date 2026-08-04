import { useMainCategories } from "@/context/MainCategoriesContext";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import translate from "@/utils/helpers/translate";
import paths from "@/utils/constants/paths";
import { isAdmin, isModerator, isRepresentative } from "@/utils/constants/roles";
import { Button, Drawer } from "@mantine/core";
import { solidIcons, outlineIcons } from "@/components/icons";
import Logo from "@/components/global/logo";
import MobileDrawerButton from "./mobile-drawer-button";
import MobileDrawerCategoriesButton from "./mobile-drawer-categories-button";
import useWindowHeight from "@/hooks/useWindowHeight";

export default function MobileDrawer({ opened, close }: { opened: boolean; close: () => void }) {
  const { user } = useUser();
  const { data: cart } = useCart();
  const { language, toggleLanguage, translations } = useLanguage();

  const { data: mainCategories } = useMainCategories();

  // To handle the height of the drawer when the window is resized (avoiding the issue of the address bar and header taking up space on mobile browsers)
  const drawerHeight = useWindowHeight();

  return (
    <Drawer opened={opened} onClose={close} withCloseButton={false} padding={0} size="xs">
      <div className="flex flex-col justify-between" style={{ height: drawerHeight }}>
        {/* Upper Div */}
        <div>
          <header className="flex items-center justify-between p-4">
            <Logo onClick={close} title={translations.appName} linkToHome />
            <Button variant="subtle" color="dark" p="xs" onClick={close}>
              <solidIcons.XMark size={23.75} />
            </Button>
          </header>

          <hr />

          <div className="mt-2">
            {mainCategories?.map((mainCategory) => (
              <MobileDrawerCategoriesButton key={mainCategory._id} mainCategory={mainCategory} close={close} />
            ))}
          </div>
        </div>

        {/* Lower Div */}
        <div className="py-3">
          <MobileDrawerButton
            icon={<outlineIcons.Globe size={23.75} />}
            label={translate(language, "عربي", "English")}
            onClick={toggleLanguage}
          />
          <MobileDrawerButton
            icon={<solidIcons.Search size={23.75} />}
            label={translate(language, "Search for a product", "ابحث عن منتج")}
            onClick={close}
            to={`${paths.products}?page=1`}
          />

          {user && (isAdmin(user.role) || isModerator(user.role) || isRepresentative(user.role)) ? (
            <MobileDrawerButton
              icon={<solidIcons.Adjustments size={23.75} />}
              label={translate(language, "Admin Panel", "لوحة التحكم")}
              onClick={close}
              to={paths.admin}
            />
          ) : (
            <>
              <div className="relative">
                <MobileDrawerButton
                  icon={<outlineIcons.ShoppingBag size={23.75} />}
                  label={translate(language, "Shopping Cart", "عربة التسوق")}
                  onClick={close}
                  to={paths.cart}
                />
                {cart.cartItems.length > 0 && (
                  <div className="flex-center absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-red-500 text-white">
                    <span className="mt-1" style={{ fontSize: "0.75rem" }}>
                      {cart.cartItems.length}
                    </span>
                  </div>
                )}
              </div>
              <MobileDrawerButton
                icon={<outlineIcons.Heart size={23.75} />}
                label={translate(language, "Wishlist", "المفضلة")}
                onClick={close}
                to={paths.wishlist}
              />
            </>
          )}

          <hr className="my-2" />

          <MobileDrawerButton
            icon={<outlineIcons.UserCircle size={23.75} />}
            label={user ? user.name : translate(language, "Login", "تسجيل الدخول")}
            onClick={close}
            to={user ? paths.profile : paths.login}
          />
        </div>
      </div>
    </Drawer>
  );
}
