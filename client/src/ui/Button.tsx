import { Button as HeroButton, Spinner } from "@heroui/react";
export function Button({
  isLoading,
  children,
  icon,
  ...ButtonProps
}: React.ComponentProps<typeof HeroButton> & {
  children: React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <HeroButton {...ButtonProps}>
      {isLoading ? <Spinner size="sm" color="current" /> : icon}
      {children}
    </HeroButton>
  );
}
