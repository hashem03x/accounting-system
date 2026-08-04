import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { PostHogProvider } from "posthog-js/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "@/index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import RememberUser from "@/pages/routes/remeber-user.tsx";
import LanguageProvider from "@/context/LanguageContext.tsx";
import UserProvider from "@/context/UserContext.tsx";
import MainCategoriesProvider from "@/context/MainCategoriesContext.tsx";
import SubCategoriesProvider from "@/context/SubcategoriesContext.tsx";
import WarehousesProvider from "@/context/WarehousesContext.tsx";
import GovernorateProvider from "@/context/GovernorateContext.tsx";
import CartProvider from "@/context/CartContext.tsx";
import AboutProvider from "@/context/AboutContext.tsx";
import HeroProvider from "@/context/HeroContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PostHogProvider
    apiKey={"phc_FBbuibshIAAGhnusKMDdLmme3ZHJqt1hNkJ0s5ivAHE"}
    options={{
      api_host: "https://us.i.posthog.com",
      defaults: "2025-05-24",
      autocapture: true,
      capture_exceptions: true,
    }}
  >
    <MantineProvider forceColorScheme="light">
      <Notifications />
      <LanguageProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <UserProvider>
            <RememberUser>
              <MainCategoriesProvider>
                <SubCategoriesProvider>
                  <GovernorateProvider>
                    <CartProvider>
                      <AboutProvider>
                        <HeroProvider>
                          <WarehousesProvider>
                            <App />
                          </WarehousesProvider>
                        </HeroProvider>
                      </AboutProvider>
                    </CartProvider>
                  </GovernorateProvider>
                </SubCategoriesProvider>
              </MainCategoriesProvider>
            </RememberUser>
          </UserProvider>
        </GoogleOAuthProvider>
      </LanguageProvider>
    </MantineProvider>
    ,
  </PostHogProvider>,
);
