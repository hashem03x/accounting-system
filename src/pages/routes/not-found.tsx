import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import paths from "@/utils/constants/paths";
import roles from "@/utils/constants/roles";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import img from "@/assets/error-404.png";
import Img from "@/components/ui/img";

function NotFound() {
  const navigate = useNavigate();

  const { translate } = useLanguage();

  const { user } = useUser();

  return (
    <div className="flex-center h-full flex-1 flex-col gap-6 p-4 pb-20">
      <Img src={img} alt="404" className="h-28" />
      <h1 className="text-3xl">{translate("Page not found", "الصفحة غير موجودة")}</h1>
      <p>{translate("The page you're looking for doesn't exist.", "الصفحة التي تبحث عنها غير موجودة.")}</p>
      <div className="flex flex-col gap-4">
        <Button variant="light" onClick={() => navigate("/")}>
          {translate("Home", "الصفحة الرئيسية")}
        </Button>
        {user?.role === roles.admin.value || user?.role === roles.moderator.value ? (
          <Button variant="light" onClick={() => navigate(`/${paths.admin}`)}>
            {translate("Admin panel", "لوحة التحكم")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default NotFound;
