import { Link } from "react-router-dom";
import { IconType } from "react-icons";

/**
 * Icon-based nav tile for the Quick Navigation / Quick Actions grid - same purpose as the older
 * image-based BasicLink (still used for nothing else now, kept as-is for backward compatibility),
 * but using the existing solidIcons/outlineIcons convention instead of static PNGs, and able to
 * show an optional live count badge next to the title.
 */
export default function QuickNavCard({
  to,
  Icon,
  title,
  subTitle,
  count,
}: {
  to: string;
  Icon: IconType;
  title: string;
  subTitle?: string;
  count?: number | null;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-lg border bg-white p-4 transition-colors hover:border-sky-200 hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
        <Icon size={20} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-medium text-gray-800">{title}</p>
          {count != null && (
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-[2px] text-xs font-medium text-gray-600">{count}</span>
          )}
        </div>
        {subTitle && <span className="truncate text-xs text-gray-500">{subTitle}</span>}
      </div>
    </Link>
  );
}
