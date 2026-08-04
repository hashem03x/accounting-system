import { NavLink } from "react-router-dom";

export default function HeaderMainCategoryButton({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `flex-center gap-2 rounded rounded-b-none border-b-2 border-transparent bg-gray-100 px-8 py-2 font-bold text-gray-800 transition-colors ${
          isActive ? "border-b-red-500" : "hover:border-b-red-500"
        }`
      }
      to={to}
    >
      <span className="text-nowrap">{label}</span>
    </NavLink>
  );
}
