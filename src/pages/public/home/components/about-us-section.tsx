import { useAbout } from "@/context/AboutContext";
import { useLanguage } from "@/context/LanguageContext";
import { solidIcons } from "@/components/icons";
import Img from "@/components/ui/img";

export default function AboutUsSection() {
  const { translate } = useLanguage();
  const { data } = useAbout();

  if (!data) return null;

  return (
    <section className="container p-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative m-auto aspect-square w-[415px] max-w-full overflow-hidden">
          <Img src={data.logo} alt={translate(data.title.en, data.title.ar)} aspectRatio="1/1" width="100%" />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 md:items-start">
          <h2 className="text-center text-3xl md:text-start">{translate(data.title.en, data.title.ar)}</h2>
          <p className="text-justify leading-6 sm:leading-7">{translate(data.content.en, data.content.ar)}</p>
          <div className="mt-2 flex gap-4">
            {data.socialLinks.facebook && (
              <SocialLink href={data.socialLinks.facebook}>
                <solidIcons.Facebook size={20} />
              </SocialLink>
            )}
            {data.socialLinks.instagram && (
              <SocialLink href={data.socialLinks.instagram}>
                <solidIcons.Instagram size={20} />
              </SocialLink>
            )}
            {data.socialLinks.twitter && (
              <SocialLink href={data.socialLinks.twitter}>
                <solidIcons.Twitter size={20} />
              </SocialLink>
            )}
            {data.socialLinks.tiktok && (
              <SocialLink href={data.socialLinks.tiktok}>
                <solidIcons.Tiktok size={20} />
              </SocialLink>
            )}
            {data.socialLinks.whatsapp && (
              <SocialLink href={data.socialLinks.whatsapp}>
                <solidIcons.Whatsapp size={20} />
              </SocialLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800">
      {children}
    </a>
  );
}
