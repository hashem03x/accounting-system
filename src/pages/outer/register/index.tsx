import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useFetchingStatus from "@/hooks/useFetchingStatus";
import apiRequest from "@/utils/helpers/api-request";
import paths from "@/utils/constants/paths";
import { validationRegex } from "@/utils/validations";
import { rememberUser } from "@/utils/helpers/local-storage";
import handleRequest from "@/utils/helpers/handle-request";
import extractUserInfo from "@/utils/helpers/extract-user-info";
import AuthForm from "@/pages/outer/components/auth-form";
import { PasswordInput, TextInput } from "@mantine/core";

export default function Register() {
  const { language, translate, translations } = useLanguage();

  const title = translate("Create new account", "إنشاء حساب جديد");

  useDocumentTitle(`${title} | ${translations.appName}`);

  const { setUser } = useUser();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const isValidName = validationRegex.name.test(name);
  const isValidEmail = validationRegex.email.test(email);
  const isValidPhone = validationRegex.phone.test(phone);
  const isValidPassword = validationRegex.password.test(password);
  const isValidConfirmPassword = password === confirmPassword;

  const requiredFields = { name, email, phone, password, confirmPassword };

  const { loading, setLoading, error, setError } = useFetchingStatus();

  return (
    <AuthForm
      title={title}
      submitLabel={translate("Register", "تسجيل")}
      leave={{
        to: `/${paths.login}`,
        label: translate("Login", "تسجيل الدخول"),
        hint: translate("Already have an account?", "لديك حساب بالفعل؟"),
      }}
      requiredFields={requiredFields}
      isValidated={isValidName && isValidEmail && isValidPhone && isValidPassword && isValidConfirmPassword}
      loading={loading}
      error={error}
      onSubmit={(e) => {
        e.preventDefault();
        handleRequest(language, setLoading, setError, async () => {
          const data = await apiRequest({
            method: "POST",
            url: "auth/signup",
            data: {
              name,
              email,
              phone,
              password,
              passwordConfirm: confirmPassword,
              stringifiedCart: localStorage.getItem("cart"),
              stringifiedWishlist: localStorage.getItem("wishlist"),
            },
            credentials: "include",
            language,
          });
          setUser(extractUserInfo(data));
          rememberUser();
        });
      }}
      withOAuth
    >
      <TextInput
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={translate("Name", "الاسم")}
        size="md"
        error={
          name && !isValidName
            ? translate("Name should not start with a number or special character.", "يجب ألا يبدأ الاسم برقم أو علامة.")
            : null
        }
        autoFocus
      />
      <TextInput
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={translate("Email", "البريد الإلكتروني")}
        size="md"
        error={email && !isValidEmail ? translate("Enter a valid email address.", "أدخل عنوان بريد إلكتروني صالح.") : null}
        autoComplete="off"
      />
      <TextInput
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={translate("Phone", "الهاتف")}
        size="md"
        error={phone && !isValidPhone ? translate("Enter a valid phone number.", "أدخل رقم هاتف صالح.") : null}
        autoComplete="off"
      />
      <PasswordInput
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={translate("Password", "كلمة المرور")}
        size="md"
        error={
          password && !isValidPassword
            ? translate("Password should be at least 8 characters long.", "يجب أن تكون كلمة المرور من 8 أحرف على الأقل.")
            : null
        }
        autoComplete="new-password"
      />
      <PasswordInput
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={translate("Confirm Password", "تأكيد كلمة المرور")}
        size="md"
        error={
          confirmPassword && !isValidConfirmPassword
            ? translate("Passwords do not match.", "كلمات المرور غير متطابقة.")
            : null
        }
      />
    </AuthForm>
  );
}
