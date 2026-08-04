import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import { useGovernorates } from "@/context/GovernorateContext";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import { validationRegex } from "@/utils/validations";
import { Button, Select, TextInput } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import ErrorAlert from "@/components/ui/error-alert";
import Modal from "@/components/ui/modal";

export default function AddAddresses() {
  const { language, translate, translations } = useLanguage();
  const { user, setUser } = useUser();

  const { data: governorates } = useGovernorates();

  const [governorate, setGovernorate] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validationRegex.phone.test(phone)) {
      setError(translate("Invalid phone number", "رقم هاتف غير صالح"));
      return;
    }

    await handleRequest(language, setLoading, setError, async () => {
      const res = await privateRequest({
        url: "addresses",
        method: "POST",
        data: { governorate, city, street, landmark, details, phone },
        language,
      });

      setUser((prev) => {
        if (!prev) return prev;
        return { ...prev, addresses: res.data };
      });

      setGovernorate("");
      setCity("");
      setStreet("");
      setLandmark("");
      setDetails("");
      setPhone("");

      handleClose();
    });
  };

  function handleClose() {
    setError("");
    close();
  }

  const [opened, { open, close }] = useDisclosure(false);

  const title = translate("Add New Address", "إضافة عنوان جديد");

  return (
    <>
      <Button onClick={open} radius="md" leftSection={<solidIcons.Plus />}>
        {title}
      </Button>

      <Modal opened={opened} onClose={handleClose} title={title}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Select
            required
            searchable
            label={translate("Governorate", "المحافظة")}
            placeholder={translate("Governorate", "المحافظة")}
            value={governorate}
            onChange={(value) => setGovernorate(value as string)}
            data={Object.values(governorates).map((governorate) => ({
              value: governorate._id,
              label: translate(governorate.name.en, governorate.name.ar),
            }))}
          />

          <TextInput
            required
            label={translate("City", "المدينة")}
            placeholder={translate("City", "المدينة")}
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
          />

          <TextInput
            required
            label={translate("Street", "الشارع")}
            placeholder={translate("Street", "الشارع")}
            value={street}
            onChange={(e) => setStreet(e.currentTarget.value)}
          />

          <TextInput
            label={translate("Landmark (optional)", "علامة مميزة (اختياري)")}
            placeholder={translate("Landmark (optional)", "علامة مميزة (اختياري)")}
            value={landmark}
            onChange={(e) => setLandmark(e.currentTarget.value)}
          />

          <TextInput
            label={translate("Other Details (optional)", "تفاصيل أخرى (اختياري)")}
            placeholder={translate("Other Details (optional)", "تفاصيل أخرى (اختياري)")}
            value={details}
            onChange={(e) => setDetails(e.currentTarget.value)}
          />

          <div className="flex flex-col gap-1">
            <TextInput
              required
              label={translate("Phone", "الهاتف")}
              placeholder={translate("Phone", "الهاتف")}
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
            />

            {user?.phone && (
              <button
                type="button"
                onClick={() => setPhone(user.phone)}
                className="w-fit text-xs font-medium text-blue-500 hover:underline"
              >
                {translate("Use phone number associated with your account", "استخدام رقم الهاتف المرتبط بحسابك")}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleClose} variant="light" color="dark" fullWidth>
              {translations.cancel}
            </Button>
            <Button type="submit" loading={loading} disabled={!governorate || !city || !street || !phone} fullWidth>
              {title}
            </Button>
          </div>

          {error && <ErrorAlert error={error} />}
        </form>
      </Modal>
    </>
  );
}
