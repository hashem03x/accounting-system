import Header from "@/components/global/navigation-home";
import Footer from "@/components/global/footer";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="flex h-full flex-col">
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
