import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { solidIcons } from "@/components/icons";

export default function ImportButton({ url, callback }: { url: string; callback: () => void }) {
  const { language, translate } = useLanguage();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  if (error) {
    notifications.show({
      title: translate("Failed to import data", "فشل في استيراد البيانات"),
      message: error,
      color: "red",
      autoClose: 7500,
      withBorder: true,
    });

    setError("");
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  async function importCsvData(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      notifications.show({
        title: translate("Invalid File Type", "نوع ملف غير صالح"),
        message: translate("Please upload a CSV file", "يرجى تحميل ملف CSV"),
        color: "red",
        autoClose: 7500,
        withBorder: true,
      });
      return;
    }

    // Create FormData and append file
    const formData = new FormData();
    formData.append("file", file);

    handleRequest(language, setLoading, setError, async () => {
      await privateRequest({
        url,
        method: "POST",
        data: formData,
        language,
      });

      notifications.show({
        title: translate("Success", "نجاح"),
        message: translate("Data imported successfully", "تم استيراد البيانات بنجاح"),
        color: "green",
      });

      callback();
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={importCsvData} style={{ display: "none" }} />
      {/* accept=".csv" */}
      <Button
        variant="light"
        color="grape"
        leftSection={loading ? <solidIcons.Spinner className="animate-spin" /> : <solidIcons.ArrowUp />}
        onClick={handleImportClick}
        disabled={loading}
      >
        {translate("Import", "استيراد")}
      </Button>
    </>
  );
}
