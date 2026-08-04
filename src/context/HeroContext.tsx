import { HeroContextProps, Slide } from "@/types/slide";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import handleRequest from "@/utils/helpers/handle-request";
import apiRequest from "@/utils/helpers/api-request";
import useDataHandler from "@/hooks/useDataHandler";

export const HeroContext = createContext<HeroContextProps>({
  data: [],
  setData: () => {},
  loading: true,
  error: "",
  reFetch: () => {},
});

export default function HeroProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();

  const { loading, setLoading, error, setError, data, setData } = useDataHandler<Slide[]>({
    initialData: [],
    initialLoading: true,
  });

  function fetchHeroSlides() {
    handleRequest(language, setLoading, setError, async () => {
      const response = await apiRequest({ url: "hero-section", language });

      setData(response.data);
    });
  }

  useEffect(() => {
    fetchHeroSlides();
  }, []);

  return (
    <HeroContext.Provider value={{ data, setData, loading, error, reFetch: fetchHeroSlides }}>
      {children}
    </HeroContext.Provider>
  );
}

export const useHero = () => useContext(HeroContext);
