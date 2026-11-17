import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";
import { solidIcons } from "@/components/icons";
import type { NavLinkItem } from "../index";

/**
 * Collapsible sidebar section header + its child links. Expansion state is fully controlled by
 * the parent (AllAdminOptions) so it can be persisted to localStorage and auto-opened for the
 * group containing the active route - this component only renders what it's told.
 */
export default function AdminNavGroup({
  label,
  Icon,
  links,
  open,
  onToggle,
  onLinkClick,
}: {
  label: string;
  Icon: IconType;
  links: NavLinkItem[];
  open: boolean;
  onToggle: () => void;
  onLinkClick?: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-5 py-[10px] text-left text-xs font-semibold uppercase tracking-wide text-gray-500 transition-colors hover:bg-gray-100"
      >
        <span className="flex items-center gap-3">
          <Icon size={18} />
          {label}
        </span>
        {open ? <solidIcons.AngleUp size={12} /> : <solidIcons.AngleDown size={12} />}
      </button>

      {open && (
        <div className="my-[2px] flex flex-col">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-4 py-[6px] pl-[28px] pr-[12px] text-sm transition-colors duration-100 ${isActive ? "bg-blue-100 text-sky-600" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`
              }
            >
              <solidIcons.Circle size={4} />
              <div>{link.label}</div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
