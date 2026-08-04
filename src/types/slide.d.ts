import { ContextProps } from "@/types/global";

export type Slide = {
  _id: string;
  published: boolean;
  desktopImg: string;
  mobileImg: string;
  titleColor: string;
  descriptionColor: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  shopNowButton: {
    show: boolean;
    color: string;
  };
};

export type HeroContextProps = ContextProps<Slide[]>;
