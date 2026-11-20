import clsx from "clsx";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ListBulletIcon,
  MoonIcon,
  PlusCircleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { Button, Link, Separator } from "@heroui/react";
import { useLocation } from "react-router";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { CollapsedTooltip } from "@/components/CollapsedTooltip";
import { PulseIcon } from "@/components/layout/PulseIcon";

const navItems = [
  { to: "/", label: "Today", icon: SunIcon },
  { to: "/check-in", label: "Check-in", icon: MoonIcon },
  { to: "/log", label: "Log", icon: PlusCircleIcon },
  { to: "/history", label: "History", icon: ListBulletIcon },
];

type SidebarContentProps = {
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
};

export function SidebarContent({
  isExpanded,
  onToggle,
  onNavigate,
}: SidebarContentProps) {
  const { pathname } = useLocation();

  return (
    <div
      className={clsx(
        "flex h-full flex-col gap-8",
        !isExpanded && "items-center",
      )}
    >
      <div
        className={clsx("flex items-center gap-3", !isExpanded && "flex-col")}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-accent text-accent-foreground">
          <PulseIcon />
        </span>
        {isExpanded && (
          <span className="flex-1 text-lg leading-tight font-semibold">
            Workout tracker
          </span>
        )}
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isExpanded}
          onPress={onToggle}
        >
          {isExpanded ? (
            <ChevronDoubleLeftIcon className="size-4" />
          ) : (
            <ChevronDoubleRightIcon className="size-4" />
          )}
        </Button>
      </div>

      <nav aria-label="Main" className="w-full">
        <ul
          className={clsx(
            "flex flex-col gap-1 ",
            !isExpanded && "items-center",
          )}
        >
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to;
            return (
              <li
                key={to}
                className={clsx(
                  "rounded-sm",
                  !isExpanded && "w-full text-center",
                  isActive ? "bg-accent-soft" : "hover:bg-default",
                )}
              >
                <CollapsedTooltip label={label} isCollapsed={!isExpanded}>
                  <Link
                    href={to}
                    aria-label={isExpanded ? undefined : label}
                    aria-current={isActive ? "page" : undefined}
                    onPress={onNavigate}
                    className={clsx(
                      "flex items-center gap-3 py-2 no-underline",
                      isExpanded ? "px-3" : "justify-center",
                      isActive
                        ? "font-semibold text-accent-soft-foreground"
                        : "text-foreground",
                    )}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden />
                    {isExpanded && label}
                  </Link>
                </CollapsedTooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <Separator />
        <AccountMenu isExpanded={isExpanded} />
      </div>
    </div>
  );
}
