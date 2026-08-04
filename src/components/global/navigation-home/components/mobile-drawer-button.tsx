import { useNavigate } from "react-router-dom";

export default function MobileDrawerButton({
  icon,
  label,
  onClick,
  to,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  to?: string;
}) {
  const navigate = useNavigate();

  return (
    <button
      className="flex w-full items-center gap-6 px-4 py-3 text-gray-600 transition-colors hover:bg-gray-100"
      onClick={() => {
        onClick();
        if (to) navigate(to);
      }}
    >
      <div>{icon}</div>
      <div style={{ fontWeight: 500 }}>{label}</div>
    </button>
  );
}
