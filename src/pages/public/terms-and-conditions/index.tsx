import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export default function TermsAndConditions() {
  const { translate } = useLanguage();

  useDocumentTitle(translate("Terms & Conditions", "الشروط والأحكام"));

  const termsData = [
    {
      id: "contract",
      en: "How the Contract is Formed",
      ar: "كيف يُبرم العقد بينك وبيننا",
      content: (
        <div>
          <P>
            {translate(
              "After you place your order, you will receive a confirmation email from us acknowledging that your order has been received. If you notice any errors in your order, please don't hesitate to contact us. You can reach us by phone at +201011105252 or by email at contact@leopardegy.com. By placing an order, you confirm that all the information you provide is accurate and truthful, that you are an authorized user of the credit or debit card used for the purchase, and that there are sufficient funds to cover the cost of the goods and services. It is your responsibility to promptly notify us of any changes to these details.",
              "بعد تقديم الطلب، ستتلقى بريدًا إلكترونيًا منا للإقرار بأننا تلقينا طلبك .إذا أخطأت في طلبك، يمكنك الاتصال بنا على +201011105252 أو إرسال بريد إلكتروني إلينا على: contact@leopardegy.com. عند تقديم طلب ، فإنك تتعهد بأن جميع التفاصيل التي تقدمها لنا لطلب سلع أو خدمات صحيحة ودقيقة ، وأنك مستخدم معتمد لبطاقة الائتمان أو الخصم المستخدمة لتقديم طلبك وأن هناك أموالًا كافية لتغطية تكلفة السلع والخدمات. تقع على عاتقك مسؤولية إبلاغنا بأي تغييرات تطرأ على هذه التفاصيل في أسرع وقت ممكن.",
            )}
          </P>
        </div>
      ),
    },
    {
      id: "cancellation",
      en: "Your Right to Cancel",
      ar: "حقك في إلغاء العقد",
      content: (
        <div>
          <P>
            {translate(
              "If your order has already been processed, we may not be able to stop the shipment, and you will still need to return all items you purchased. Please ensure you take reasonable care of the items you wish to return, and do not use or wear them.",
              "من أجل إلغاء عقدك خلال فترة الإلغاء، يرجى إخطارنا باستخدام جهات الاتصال الخاصة بنا. إذا كنت متعاقدًا كمستهلك في مصر وقمت بإلغاء طلبك خلال فترة الإلغاء، فستتلقى استردادًا كاملاً للسعر المدفوع للمنتجات في غضون 14 يومًا ('فترة الاسترداد'). تبدأ فترة استرداد الأموال بعد 5 أيام من استلامنا للمنتجات منك.",
            )}
          </P>
          <P className="mt-2">
            <b>{translate("Please note: ", "يرجى ملاحظة")}: </b>
            {translate(
              "You are responsible for the cost of returning the products to us. If you cancel your contract after the products have been dispatched to you, you will be responsible for returning the products to us at your own cost.",
              "إذا تمت معالجة طلبك بالفعل، فقد لا نتمكن من إيقاف إرسال العناصر إليك، لذا ستظل بحاجة إلى إرجاع جميع المنتجات التي تم شراؤها في طلبك. يجب أن تهتم بشكل معقول بالمنتجات التي ترغب في إلغائها وعدم استخدامها أو ارتدائها.",
            )}
          </P>
        </div>
      ),
    },
    {
      id: "payment",
      en: "Payment Methods",
      ar: "طريقة الدفع او السداد",
      content: (
        <div>
          <P>
            {translate(
              "We offer various payment methods, including credit cards (Visa, Visa Debit, MasterCard). We also accept payments via all e-wallets.",
              "نقدم طرق دفع مختلفة مثل بطاقة الائتمان (فيزا ، فيزا ديبيت ، ماستر كارد). كما نقبل الدفع عن طريق جميع المحافظ الإلكترونية.",
            )}
          </P>
        </div>
      ),
    },
    {
      id: "returns",
      en: "Returns & Exchanges",
      ar: "الإرجاع والاستبدال",
      content: (
        <div>
          <P>
            {translate(
              `If you need to return an item because it doesn't fit or you simply don't like it, please make sure that all original tags and labels are still on the item and have not been removed, and that the item is in the same condition as when you received it. 
                Returns must be made within 14 days of delivery.`,
              `إذا كنت بحاجة إلى إرجاع شيء ما لأن الملابس غير مناسبة، أو ببساطة لم يعجبك ما لديك، يرجى التأكد من أن جميع البطاقات والملصقات الأصلية لا تزال متصلة بالمنتج ولم تتم إزالتها، وأن العنصر في نفس الحالة التي استلمته بها. 
                يجب أن يتم الإرجاع في غضون 14 يومًا من تاريخ التسليم.`,
            )}
          </P>
          <div className="mt-2">
            <P>
              <span className="font-semibold">{translate(`How can you cancel an order?`, `كيف يمكنك إلغاء الطلب؟`)}</span>
            </P>
            <P>1. {translate("Go to your account > View My Orders.", "اذهب إلى حسابك > عرض طلباتي.")}</P>
            <P>2. {translate("Select the order you wish to cancel.", "اختر الطلب الذي تريد إلغاءه.")}</P>
            <P>
              {translate(
                `We will review your return request and send a representative to inspect the items. If the items are in good condition, we will process the refund within a maximum of 5 business days.`,
                `سنقوم بمراجعة طلب الاسترجاع وإرسال مندوب لمعاينة المنتجات. إذا كانت المنتجات في حالة سليمة، سنقوم بإرجاع الأموال في غضون خمسة أيام عمل كحد أقصى.`,
              )}
            </P>
          </div>
          <div className="mt-2">
            <P>
              <span className="font-semibold">
                {translate(
                  "Please follow the below process to return the item to us:",
                  "يرجى اتباع العملية التالية لإعادة العنصر إلينا:",
                )}
              </span>
            </P>
            <P>
              1.{" "}
              {translate(
                "Repackage the item in its original packaging with all tags still attached.",
                "أعد تغليف العنصر في عبوته الأصلية مع استمرار إرفاق الملصقات والعلامات.",
              )}
            </P>
            <P>
              2.{" "}
              {translate(
                "Securely attach the original delivery label to your item.",
                "إرفاق ملصق التسليم الأصلي بشكل آمن مع العنصر الخاص بك.",
              )}
            </P>
          </div>
          <P className="mt-4">
            {translate(
              "Pre-Order: If you placed a pre-order, the product cannot be returned, but you can only exchange the size.",
              "الطلب المسبق: في حال قمت بطلب مسبق لا يمكن إرجاع المنتج ولكن يمكنك فقط تغيير المقاس.",
            )}
          </P>
        </div>
      ),
    },
    {
      id: "delivery",
      en: "Delivery Information",
      ar: "معلومات التوصيل",
      content: (
        <div>
          <P>
            {translate(
              "We offer nationwide delivery to all regions in Egypt (Cairo, Alexandria, Tanta, Mahalla, Suez, Hurghada, Sharm El Sheikh, Luxor, Aswan, and other cities).",
              "نقدم خدمة التوصيل على الصعيد الوطني إلى جميع مناطق مصر (القاهرة ، الإسكندرية ، طنطا ، المحلة ، السويس ، الغردقة ، شرم الشيخ ، الأقصر ، أسوان ومدن أخرى).",
            )}
          </P>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold">{translate("Terms & Conditions", "الشروط والأحكام")}</h1>

      <section id="detailed-terms" className="mb-8">
        <P>
          {translate(
            "Please read these terms and conditions carefully before ordering any products from our website.",
            "يرجى قراءة هذه الشروط والأحكام بعناية قبل طلب أي منتجات من موقعنا على الإنترنت.",
          )}
        </P>
      </section>

      {/* Terms Content Sections */}
      {termsData.map((section) => (
        <section key={section.id} id={section.id} className="mb-10">
          <h2 className="mb-4">{translate(section.en, section.ar)}</h2>
          {section.content}
        </section>
      ))}
    </div>
  );
}

function P({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <p className={`leading-6 sm:leading-7 ${className}`}>{children}</p>;
}
