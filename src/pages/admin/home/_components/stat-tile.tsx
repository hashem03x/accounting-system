import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@mantine/core";
import { IconType } from "react-icons";
import { useLanguage } from "@/context/LanguageContext";

/**
 * One KPI number on the dashboard. Deliberately tri-state (loading / unavailable / value) instead
 * of just loading/value - Promise.allSettled in index.tsx means one failed stat request must
 * never block the rest of the dashboard (see Phase 4 of the redesign brief), so "this one stat
 * couldn't be loaded" is a real, expected state to render, not an error to throw.
 */
export default function StatTile({
  icon: Icon,
  label,
  value,
  to,
  loading = false,
  unavailable = false,
}: {
  icon: IconType;
  label: string;
  value: ReactNode;
  to?: string;
  loading?: boolean;
  unavailable?: boolean;
}) {
  const { translate } = useLanguage();

  const content = (
    <div className="flex h-full items-center gap-4 rounded-lg border bg-gray-50 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">
        <Icon size={20} />
      </div>
      <div className="flex min-w-0 flex-col gap-[2px]">
        <span className="truncate text-xs text-gray-500 sm:text-sm">{label}</span>
        {loading ? (
          <Skeleton height={22} width={70} radius="sm" />
        ) : unavailable ? (
          <span className="text-sm text-gray-400" title={translate("Unavailable right now", "غير متاح حاليًا")}>
            {translate("Unavailable", "غير متاح")}
          </span>
        ) : (
          <span className="truncate text-lg font-semibold text-gray-800 sm:text-xl">{value}</span>
        )}
      </div>
    </div>
  );

  if (!to) return content;

  return (
    <Link to={to} className="block h-full">
      {content}
    </Link>
  );
}
