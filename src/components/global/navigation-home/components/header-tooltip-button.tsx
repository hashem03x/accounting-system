import { Button, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";

export default function HeaderTooltipButton({
  to,
  label,
  icon: Icon,
  onClick,
  children,
  extraContent,
}: {
  to?: string;
  label: string;
  icon?: any;
  onClick?: () => void;
  children?: React.ReactNode;
  extraContent?: React.ReactNode;
}) {
  return (
    <Tooltip
      withArrow
      label={label}
      openDelay={100}
      offset={12}
      transitionProps={{
        transition: "fade",
        duration: 250,
      }}
    >
      {to ? (
        <Link to={to} onClick={onClick}>
          <div className="relative">
            <Button variant="subtle" color="dark" px="xs">
              {Icon ? <Icon size={23.75} /> : children}
            </Button>
            {extraContent}
          </div>
        </Link>
      ) : (
        <button onClick={onClick}>
          <div className="relative">
            <Button variant="subtle" color="dark" px="xs">
              {Icon ? <Icon size={23.75} /> : children}
            </Button>
            {extraContent}
          </div>
        </button>
      )}
    </Tooltip>
  );
}
