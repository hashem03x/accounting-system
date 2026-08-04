import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export default function PrivacyPolicy() {
  const { translate } = useLanguage();

  useDocumentTitle(translate("Privacy Policy", "سياسة الخصوصية"));

  const privacyData = [
    {
      id: "data-collection",
      en: "Data Collection",
      ar: "جمع البيانات",
      content: (
        <div>
          <P>
            {translate(
              "We collect personal information when you create an account or place an order. This information may include your name, email address, phone number.",
              "نجمع المعلومات الشخصية عندما تقوم بإنشاء حساب، أو تقديم طلب. قد تشمل هذه المعلومات اسمك، وعنوان بريدك الإلكتروني، ورقم هاتفك.",
            )}
          </P>
          <P>
            {translate(
              "The information we collect is used to process your orders, manage your account, and personalize your experience on our website.",
              "تُستخدم المعلومات التي نجمعها لمعالجة طلباتك، وإدارة حسابك، وتخصيص تجربتك على موقعنا.",
            )}
          </P>
        </div>
      ),
    },
    {
      id: "data-sharing",
      en: "Data Sharing",
      ar: "مشاركة البيانات",
      content: (
        <div>
          <P>
            {translate(
              "We may share your personal data with third-party service providers who assist us in delivering our services, such as payment processors, delivery companies, and marketing platforms. These third parties are required to maintain the confidentiality and security of your information and are prohibited from using it for any purpose other than providing the requested services.",
              "قد نشارك بياناتك الشخصية مع مقدمي الخدمات الخارجيين الذين يساعدوننا في تقديم خدماتنا، مثل معالجي الدفع، وشركات التوصيل، ومنصات التسويق. يتعين على هؤلاء الأطراف الثالثة الحفاظ على سرية وأمان معلوماتك، ولا يجوز لهم استخدامها لأي غرض آخر غير تقديم الخدمات المطلوبة.",
            )}
          </P>
          <P>
            {translate(
              "We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as required by law or to protect our rights, property, or safety, as well as the rights, property, or safety of our users or others.",
              "نحن لا نبيع أو نتاجر أو نحول معلوماتك الشخصية إلى أطراف خارجية دون موافقتك، إلا إذا كان ذلك مطلوبًا بموجب القانون أو لحماية حقوقنا أو ممتلكاتنا أو سلامتنا، وكذلك حقوق أو ممتلكات أو سلامة مستخدمينا أو الآخرين.",
            )}
          </P>
        </div>
      ),
    },
    {
      id: "data-security",
      en: "Data Security",
      ar: "أمان البيانات",
      content: (
        <div>
          <P>
            {translate(
              "We take the security of your personal information seriously. We implement a variety of security measures to maintain the safety of your personal data, including encryption, firewalls, and secure servers.",
              "نحن نتعامل مع أمان معلوماتك الشخصية بجدية. نحن نطبق مجموعة متنوعة من التدابير الأمنية للحفاظ على سلامة بياناتك الشخصية، بما في ذلك التشفير، والجدران النارية، والخوادم الآمنة.",
            )}
          </P>
          <P>
            {translate(
              "If you have any reason to believe that your interaction with us is no longer secure, please immediately notify us through the contact details provided on our website.",
              "إذا كان لديك أي سبب للاعتقاد بأن تفاعلك معنا لم يعد آمنًا، يُرجى إبلاغنا على الفور من خلال تفاصيل الاتصال المقدمة على موقعنا.",
            )}
          </P>
        </div>
      ),
    },
    {
      id: "cookies",
      en: "Cookies and Tracking Technologies",
      ar: "الكوكيز وتقنيات التتبع",
      content: (
        <div>
          <P>
            {translate(
              "Our website uses cookies and similar technologies to enhance your browsing experience and provide personalized content. Cookies are small files that are stored on your device and help us recognize you on future visits. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.",
              "يستخدم موقعنا الكوكيز وتقنيات مشابهة لتحسين تجربة التصفح الخاصة بك وتوفير محتوى مخصص. الكوكيز هي ملفات صغيرة تُخزَّن على جهازك وتساعدنا في التعرف عليك عند الزيارات المستقبلية. يمكنك اختيار قبول الكوكيز أو رفضها. تقبل معظم متصفحات الويب الكوكيز تلقائيًا، ولكن يمكنك عادةً تعديل إعدادات المتصفح لرفض الكوكيز إذا كنت تفضل ذلك. ومع ذلك، قد يمنعك هذا من الاستفادة الكاملة من الموقع.",
            )}
          </P>
        </div>
      ),
    },
    {
      id: "user-rights",
      en: "Your Rights",
      ar: "حقوقك",
      content: (
        <div>
          <P>
            {translate(
              "You have the right to request access to the personal data we hold about you, as well as the right to request correction of it at any time.",
              "لديك الحق في طلب الوصول إلى البيانات الشخصية التي نحتفظ بها عنك، وكذلك الحق في طلب تصحيحها وقتما تشاء.",
            )}
          </P>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">{translate("Privacy Policy", "سياسة الخصوصية")}</h1>

      <section id="privacy-intro" className="mb-8">
        <P>
          {translate(
            "This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or use our services.",
            "توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عندما تزور موقعنا الإلكتروني أو تستخدم خدماتنا.",
          )}
        </P>
      </section>

      {/* Privacy Content Sections */}
      {privacyData.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="mb-4">{translate(section.en, section.ar)}</h2>
          {section.content}
        </section>
      ))}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-6 sm:leading-7">{children}</p>;
}
