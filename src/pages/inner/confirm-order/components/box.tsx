export default function Box({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-base text-gray-800 sm:text-lg">{title}</h3>
      <div className={className}>{children}</div>
    </div>
  );
}
