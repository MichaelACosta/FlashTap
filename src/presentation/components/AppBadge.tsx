type AppBadgeProps = {
  label: string;
};

export function AppBadge({ label }: AppBadgeProps) {
  return <span>{label}</span>;
}
