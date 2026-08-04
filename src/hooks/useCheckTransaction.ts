import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/constants/paths";

export default function useCheckTransaction() {
  const params = new URLSearchParams(window.location.search);

  const navigate = useNavigate();

  useEffect(() => {
    const id = params.get("id");

    if (id) {
      window.history.pushState({}, "", window.location.pathname + window.location.hash);
      navigate(`/${paths.paymentStatus}?id=${id}`, { replace: true });
    }
  }, []);
}
