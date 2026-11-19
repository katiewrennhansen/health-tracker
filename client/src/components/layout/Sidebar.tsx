import { Drawer } from "@heroui/react";
import { useState } from "react";
import { SidebarContent } from "@/components/layout/SidebarContent";
import { useBreakpoint } from "@/hooks/useBreakpoint";

/**
 * App navigation down the left side. Collapsed it shows icons only (labels in tooltips); expanded,
 * icons and labels. On wider screens it starts expanded and the toggle expands and collapses it in
 * place. On phones it stays a collapsed icon strip, and the toggle opens the expanded version in a
 * HeroUI Drawer over the page.
 */
export function Sidebar() {
  const isPhone = !useBreakpoint("md");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <aside
        className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-x-hidden border-r border-separator bg-surface transition-[width] ${
          isExpanded && !isPhone ? "w-64 p-5" : "w-18 p-3"
        }`}
      >
        <SidebarContent
          isExpanded={isExpanded && !isPhone}
          onToggle={() =>
            isPhone
              ? setIsDrawerOpen(true)
              : setIsExpanded((expanded) => !expanded)
          }
        />
      </aside>

      <Drawer isOpen={isPhone && isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Backdrop>
          <Drawer.Content placement="left" className="w-64">
            <Drawer.Dialog aria-label="Menu" className="h-full p-5">
              <SidebarContent
                isExpanded
                onToggle={() => setIsDrawerOpen(false)}
                onNavigate={() => setIsDrawerOpen(false)}
              />
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}
