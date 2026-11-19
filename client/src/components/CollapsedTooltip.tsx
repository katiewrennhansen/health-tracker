import { Tooltip } from "@heroui/react";
import type { ReactNode } from "react";

/** Shows `label` on hover or focus, but only while the sidebar is collapsed and the label is hidden. */
export function CollapsedTooltip({
  label,
  isCollapsed,
  children,
}: {
  label: string;
  isCollapsed: boolean;
  children: ReactNode;
}) {
  return (
    <Tooltip delay={300} isDisabled={!isCollapsed}>
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Tooltip.Content placement="right">{label}</Tooltip.Content>
    </Tooltip>
  );
}
