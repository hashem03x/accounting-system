import { useAbout } from "@/context/AboutContext";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { solidIcons } from "@/components/icons";

export default function ContactUs() {
  const { translate } = useLanguage();

  useDocumentTitle(translate("Contact Us", "تواصل معنا"));
  const { data: about } = useAbout();

  const branches = [
    {
      name: { en: "Sheikh Zayed Branch", ar: "فرع الشيخ زايد" },
      mobile: "01113132462",
      whatsapp: "01011105252",
    },
    {
      name: { en: "Heliopolis Branch", ar: "فرع مصر الجديدة" },
      mobile: "01005427466",
      whatsapp: "01555957880",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8">{translate("Contact Us", "تواصل معنا")}</h1>

      <section>
        <h2 className="mb-4" style={{ fontWeight: 500 }}>
          {translate("Contact our Branches", "تواصل مع فروعنا")}
        </h2>
        <ul className={`list-disc ${translate("pl-5", "pr-5")}`}>
          {branches.map((branch, index) => (
            <li key={index} className="mb-4">
              <strong>{translate(branch.name.en, branch.name.ar)}</strong>
              <p className="mt-2">
                {translate("Mobile", "موبايل")}: {branch.mobile}
              </p>
              <p className="mt-2">
                {translate("WhatsApp", "واتساب")}: {branch.whatsapp}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <br />

      <section className="mb-8">
        <h2 className="mb-2" style={{ fontWeight: 500 }}>
          {translate(about?.title.en as string, about?.title.ar as string)}
        </h2>
        <p className="leading-6 sm:leading-7">{translate(about?.content.en as string, about?.content.ar as string)}</p>
        <div className="mt-4 flex gap-4">
          {about?.socialLinks.facebook && (
            <SocialLink href={about?.socialLinks.facebook}>
              <solidIcons.Facebook size={18} />
            </SocialLink>
          )}
          {about?.socialLinks.instagram && (
            <SocialLink href={about?.socialLinks.instagram}>
              <solidIcons.Instagram size={18} />
            </SocialLink>
          )}
          {about?.socialLinks.twitter && (
            <SocialLink href={about?.socialLinks.twitter}>
              <solidIcons.Twitter size={18} />
            </SocialLink>
          )}
          {about?.socialLinks.tiktok && (
            <SocialLink href={about?.socialLinks.tiktok}>
              <solidIcons.Tiktok size={18} />
            </SocialLink>
          )}
          {about?.socialLinks.whatsapp && (
            <SocialLink href={about?.socialLinks.whatsapp}>
              <solidIcons.Whatsapp size={18} />
            </SocialLink>
          )}
        </div>
      </section>
    </div>
  );
}

function SocialLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-800">
      {children}
    </a>
  );
}
