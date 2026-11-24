import { Alert as HeroAlert, type AlertVariants } from "@heroui/react";
import clsx from "clsx";
import type { ReactNode } from "react";

type AlertProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Colour and default icon: "default", "accent", "success", "warning" or "danger". */
  status?: AlertVariants["status"];
  /** Replaces the status's default icon, shown in a small tile on the left (e.g. a Heroicon). */
  icon?: ReactNode;
  /** Buttons or links on the right, e.g. "Later" and "Start check-in". */
  actions?: ReactNode;
  className?: string;
};

/**
 * HeroUI Alert laid out as a banner: icon, title and description on the left, optional actions on
 * the right (they wrap underneath on narrow screens).
 */
export function Alert({
  title,
  description,
  status,
  icon,
  actions,
  className,
}: AlertProps) {
  return (
    <HeroAlert
      status={status}
      className={clsx(
        "flex-wrap items-center rounded-sm border border-border",
        className,
      )}
    >
      {/* With no `icon`, the indicator must get `undefined` (not `false`) to show the status's default icon. */}
      <HeroAlert.Indicator>
        {icon ? (
          <span className="flex size-9 items-center justify-center rounded-sm border border-border bg-surface [&>svg]:size-5">
            {icon}
          </span>
        ) : undefined}
      </HeroAlert.Indicator>
      {/*
       * `basis-0` makes long text wrap inside this block instead of the whole block wrapping onto a
       * new line under the icon; `min-w-48` still lets it drop below when there's really no room.
       */}
      <HeroAlert.Content className="min-w-48 basis-0">
        <HeroAlert.Title>{title}</HeroAlert.Title>
        {description && (
          <HeroAlert.Description>{description}</HeroAlert.Description>
        )}
      </HeroAlert.Content>
      {actions && (
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </HeroAlert>
  );
}
