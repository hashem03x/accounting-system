import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { useGovernorates } from "@/context/GovernorateContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useDataHandler from "@/hooks/useDataHandler";
import extractUserInfo from "@/utils/helpers/extract-user-info";
import handleRequest from "@/utils/helpers/handle-request";
import apiRequest from "@/utils/helpers/api-request";
import paths from "@/utils/constants/paths";
import { trackEvent } from "@/utils/helpers/facebook-pixel";
import submitCheckoutSession from "@/utils/helpers/submit-checkout-session";
import { SKIP_CONFIRM_ORDER_PAGE } from "@/utils/constants/checkout";
import { Address } from "@/types/user";
import { rememberUser } from "@/utils/helpers/local-storage";
import { validationRegex } from "@/utils/validations";
import { WebsitePaymentMethod } from "@/types/payment";
import {
  isCodWebsitePayment,
  isWalletWebsitePayment,
  websitePaymentMethods,
  websitePaymentMethodsArray,
} from "@/utils/constants/payment-methods";
import { Button, PasswordInput, Select, TextInput, Checkbox } from "@mantine/core";
import { outlineIcons } from "@/components/icons";
import AddAddresses from "@/components/global/add-address";
import EmptySection from "@/components/ui/sections/empty";
import noAddresses from "@/assets/no-addresses.png";
import ErrorAlert from "@/components/ui/error-alert";
import AddressOption from "./_components/address-option";
import PaymentMethodOption from "./_components/payment-method-option";

export default function Checkout() {
  const { translations, translate, language } = useLanguage();

  const navigate = useNavigate();

  const { user, setUser } = useUser();
  const { data: cart, setData: setCart } = useCart();
  const { data: governorates } = useGovernorates();

  useDocumentTitle(`${translate("Checkout", "الدفع")} | ${translations.appName}`);

  // State management
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(user?.addresses[0] || null);
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    governorate: "",
    city: "",
    street: "",
    landmark: "",
    details: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<WebsitePaymentMethod>(websitePaymentMethods.cod.value);
  const [walletNumber, setWalletNumber] = useState<string>("");
  const [needCardReader, setNeedCardReader] = useState<boolean>(false);
  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  // Helper to update guest data
  const updateGuestData = (field: keyof typeof guestData, value: string) => {
    setGuestData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();

    // Validation for logged in users
    if (user) {
      if (!selectedAddress) {
        setError(translate("Please select an address", "من فضلك اختر عنوان"));
        return;
      }
    } else {
      // Validation for guest users
      const guestValidation = validateGuestUserData(
        {
          name: guestData.name,
          phone: guestData.phone,
          email: guestData.email,
          password: guestData.password,
          governorate: guestData.governorate,
          city: guestData.city,
          street: guestData.street,
        },
        translate,
      );

      if (!guestValidation.isValid) {
        setError(guestValidation.errorMessage!);
        return;
      }
    }

    // Payment validation
    const paymentValidation = validatePaymentMethod(paymentMethod, walletNumber, translate);
    if (!paymentValidation.isValid) {
      setError(paymentValidation.errorMessage!);
      return;
    }

    // Facebook Pixel tracking
    trackEvent("InitiateCheckout", {
      value: cart.totalCartPrice,
      currency: "EGP",
    });

    handleRequest(language, setLoading, setError, async () => {
      let addressToUse: Address;
      let guestAccessToken: string | undefined;

      if (!user) {
        const res = await apiRequest({
          language,
          method: "POST",
          url: `sale-orders/online/guest-checkout`,
          credentials: "include",
          data: {
            ...guestData,
            governorateId: guestData.governorate,
            stringifiedCart: JSON.stringify(cart),
          },
        });

        const userInfo = extractUserInfo(res);
        setUser(userInfo);
        rememberUser();
        addressToUse = res.selectedAddress;
        guestAccessToken = userInfo.accessToken;
      } else {
        addressToUse = selectedAddress!;
      }

      if (SKIP_CONFIRM_ORDER_PAGE) {
        const request = guestAccessToken
          ? (options: Parameters<typeof apiRequest>[0]) =>
              apiRequest({
                ...options,
                credentials: "include",
                headers: { authorization: `Bearer ${guestAccessToken}`, ...options.headers },
              })
          : privateRequest;

        await submitCheckoutSession({
          request,
          language,
          paymentMethod,
          selectedAddress: addressToUse,
          walletNumber,
          needCardReader,
          translate,
          navigate,
          setCart,
        });
      } else {
        navigate(`/${paths.confirmOrder}`, {
          state: { selectedAddress: addressToUse, paymentMethod, walletNumber, needCardReader },
        });
      }
    });
  }

  if (cart.cartItems.length === 0) return <Navigate to={`/${paths.cart}`} />;

  return (
    <div className="root-flex-1 bg-gray-50 p-4">
      <div className="container flex max-w-[1000px] flex-col gap-4">
        <h1 className="my-4">{translate("Secure Checkout", "الدفع الآمن")}</h1>

        {/* Address Section */}
        {user ? (
          <CheckoutSection>
            <SectionHeader stepNumber={1} title={translate("Enter Your Address", "أدخل عنوانك")}>
              <AddAddresses />
            </SectionHeader>

            {user.addresses.length === 0 ? (
              <EmptySection
                img={noAddresses}
                message={translate("You don't have any addresses yet", "ليس لديك أي عناوين بعد")}
                className="w-full py-12"
              />
            ) : (
              <div className="flex flex-col gap-4">
                {user.addresses.map((address) => (
                  <AddressOption
                    key={address._id}
                    address={address}
                    selectedAddressId={selectedAddress?._id || ""}
                    onClick={() => {
                      setError("");
                      setSelectedAddress(address);
                    }}
                  />
                ))}
              </div>
            )}
          </CheckoutSection>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Basic Information Section */}
            <CheckoutSection>
              <SectionHeader stepNumber={1} title={translate("Enter Your Basic Information", "ادخل معلوماتك الأساسية")} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  required
                  value={guestData.name}
                  onChange={(e) => updateGuestData("name", e.target.value)}
                  label={translate("Name", "الاسم")}
                  placeholder={translate("Name", "الاسم")}
                  autoFocus
                />
                <TextInput
                  required
                  label={translate("Phone", "الهاتف")}
                  placeholder={translate("Phone", "الهاتف")}
                  value={guestData.phone}
                  onChange={(e) => updateGuestData("phone", e.currentTarget.value)}
                />
                <TextInput
                  required
                  value={guestData.email}
                  onChange={(e) => updateGuestData("email", e.target.value)}
                  label={translate("Email", "البريد الإلكتروني")}
                  placeholder={translate(
                    "Enter your email that you'll need to access your account later",
                    "ادخل عنوان بريدك الالكتروني الذي ستستخدمه للوصول الى حسابك لاحقا",
                  )}
                  autoComplete="off"
                />
                <PasswordInput
                  required
                  value={guestData.password}
                  onChange={(e) => updateGuestData("password", e.target.value)}
                  label={translate("Password", "كلمة المرور")}
                  placeholder={translate("Enter your password", "ادخل كلمة المرور الخاصة بك")}
                  autoComplete="new-password"
                />
              </div>
            </CheckoutSection>

            {/* Address Section */}
            <CheckoutSection>
              <SectionHeader stepNumber={2} title={translate("Enter Your Address", "ادخل عنوانك")} />
              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  required
                  searchable
                  label={translate("Governorate", "المحافظة")}
                  placeholder={translate("Select a governorate", "اختر المحافظة")}
                  value={guestData.governorate}
                  onChange={(value) => updateGuestData("governorate", value as string)}
                  data={Object.values(governorates).map((gov) => ({
                    value: gov._id,
                    label: translate(gov.name.en, gov.name.ar),
                  }))}
                />
                <TextInput
                  required
                  label={translate("City", "المدينة")}
                  placeholder={translate("City", "المدينة")}
                  value={guestData.city}
                  onChange={(e) => updateGuestData("city", e.currentTarget.value)}
                />
                <TextInput
                  required
                  label={translate("Street", "الشارع")}
                  placeholder={translate("Street", "الشارع")}
                  value={guestData.street}
                  onChange={(e) => updateGuestData("street", e.currentTarget.value)}
                />
                <TextInput
                  label={translate("Landmark (optional)", "علامة مميزة (اختياري)")}
                  placeholder={translate("Landmark (optional)", "علامة مميزة (اختياري)")}
                  value={guestData.landmark}
                  onChange={(e) => updateGuestData("landmark", e.currentTarget.value)}
                />
                <TextInput
                  label={translate("Other Details (optional)", "تفاصيل أخرى (اختياري)")}
                  placeholder={translate("Other Details (optional)", "تفاصيل أخرى (اختياري)")}
                  value={guestData.details}
                  onChange={(e) => updateGuestData("details", e.currentTarget.value)}
                />
              </div>
            </CheckoutSection>
          </div>
        )}

        {/* Payment Method Section */}
        <CheckoutSection>
          <SectionHeader stepNumber={user ? 2 : 3} title={translate("Choose Payment Method", "اختر طريقة الدفع")} />

          <div className="flex flex-col gap-4">
            {websitePaymentMethodsArray.map((method) => (
              <PaymentMethodOption
                key={method.value}
                paymentMethod={method}
                selectedPaymentMethod={paymentMethod}
                onClick={() => setPaymentMethod(method.value)}
              />
            ))}
          </div>

          {isWalletWebsitePayment(paymentMethod) && (
            <TextInput
              label={translate("Wallet Number", "رقم المحفظة")}
              placeholder={translate("Enter your wallet number", "ادخل رقم المحفظة الخاصة بك")}
              value={walletNumber}
              onChange={(e) => setWalletNumber(e.currentTarget.value)}
              required
            />
          )}

          {isCodWebsitePayment(paymentMethod) && (
            <Checkbox
              label={translate("I want to pay by card upon delivery.", "أرغب في الدفع بالبطاقة عند الاستلام.")}
              checked={needCardReader}
              onChange={(e) => setNeedCardReader(e.currentTarget.checked)}
            />
          )}
        </CheckoutSection>

        {/* Continue Button */}
        <Button
          type="button"
          size="lg"
          radius="md"
          onClick={handleContinue}
          loading={loading}
          disabled={cart.cartItems.length === 0}
        >
          {SKIP_CONFIRM_ORDER_PAGE
            ? isCodWebsitePayment(paymentMethod)
              ? translate("Confirm Order", "تأكيد الطلب")
              : translate("Proceed to Payment", "اتمام عملية الدفع")
            : translate("Continue", "متابعة")}
        </Button>

        {/* {SKIP_CONFIRM_ORDER_PAGE && loading && <LoadingPayment />} */}

        {error && (
          <div className="animate-fade-in">
            <ErrorAlert error={error} />
          </div>
        )}

        {error === "This account already exists, but the password you entered is not correct." && (
          <p>
            {translate("If you forgot your password, you can ", "إذا كنت قد نسيت كلمة المرور، يمكنك ")}
            <Link className="text-blue-500 hover:underline" to={`/${paths.forgotPassword}`}>
              {translate("reset it here", "إعادة تعيينها من هنا")}
            </Link>
            .
          </p>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-4 rounded-lg bg-blue-50 px-6 py-4">
          <outlineIcons.ShieldCheck size={19} className="text-blue-500" />
          <div>
            <h5 className="text-sm font-bold text-slate-900">{translate("Secure Checkout", "إتمام شراء آمن")}</h5>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              {translate(
                "Your payment information is encrypted and processed securely. We do not store credit card details.",
                "يتم تشفير معلومات الدفع الخاصة بك ومعالجتها بأعلى معايير الأمان. نحن لا نقوم بتخزين بيانات بطاقات الائتمان.",
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// VALIDATION FUNCTIONS
// =============================================================

interface ValidationError {
  isValid: boolean;
  errorMessage?: string;
}

function validateGuestUserData(
  data: { name: string; phone: string; email: string; password: string; governorate: string; city: string; street: string },
  translate: (en: string, ar: string) => string,
): ValidationError {
  if (!validationRegex.name.test(data.name))
    return {
      isValid: false,
      errorMessage: translate(
        "Name should not start with a number or special character.",
        "يجب ألا يبدأ الاسم برقم أو علامة.",
      ),
    };

  if (!validationRegex.phone.test(data.phone))
    return {
      isValid: false,
      errorMessage: translate("Enter a valid phone number.", "أدخل رقم هاتف صالح."),
    };

  if (!validationRegex.email.test(data.email))
    return {
      isValid: false,
      errorMessage: translate("Enter a valid email address.", "أدخل عنوان بريد إلكتروني صالح."),
    };

  if (!validationRegex.password.test(data.password))
    return {
      isValid: false,
      errorMessage: translate(
        "Password should be at least 8 characters long.",
        "يجب أن تكون كلمة المرور من 8 أحرف على الأقل.",
      ),
    };

  if (!data.governorate.trim() || !data.city.trim() || !data.street.trim())
    return {
      isValid: false,
      errorMessage: translate("Please provide all required address details", "من فضلك ادخل جميع التفاصيل المطلوبة للعنوان"),
    };

  return { isValid: true };
}

function validatePaymentMethod(
  paymentMethod: WebsitePaymentMethod | null,
  walletNumber: string,
  translate: (en: string, ar: string) => string,
): ValidationError {
  if (!paymentMethod)
    return {
      isValid: false,
      errorMessage: translate("Please select a payment method", "من فضلك اختر طريقة دفع"),
    };

  if (isWalletWebsitePayment(paymentMethod) && !walletNumber)
    return {
      isValid: false,
      errorMessage: translate("Please enter your wallet number", "من فضلك ادخل رقم المحفظة"),
    };

  if (walletNumber && !validationRegex.phone.test(walletNumber))
    return {
      isValid: false,
      errorMessage: translate("Invalid wallet number", "رقم المحفظة غير صالح"),
    };

  return { isValid: true };
}

// =============================================================
// SUB-COMPONENTS
// =============================================================

function SectionHeader({ stepNumber, title, children }: { stepNumber: number; title: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="flex-center h-10 w-10 rounded-full bg-blue-100 font-bold text-blue-500">{stepNumber}</div>
        <h2>{title}</h2>
      </div>
      {children}
    </header>
  );
}

function CheckoutSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10 ${className}`}
    >
      {children}
    </section>
  );
}
