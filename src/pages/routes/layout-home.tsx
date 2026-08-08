import Header from "@/components/global/navigation-home";
import Footer from "@/components/global/footer";
import NewSiteNotice from "@/components/global/new-site-notice";
import NewSiteStickyBar from "@/components/global/new-site-sticky-bar";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="flex h-full flex-col">
      <NewSiteNotice />
      <NewSiteStickyBar />
      <div className="flex-1">
        <Header height="80px" />
        <div style={{ minHeight: "calc(100vh - 80px)" }} className="flex flex-col">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
