import clsx from "clsx";
import { Drawer } from "@heroui/react";
import { useState } from "react";
import { SidebarContent } from "@/components/layout/SidebarContent";
import { useMediaQuery } from "react-hooks-ts";

export function Sidebar() {
  const isPhone = !useMediaQuery("(min-width: 768px)");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    if (isPhone) {
      setIsDrawerOpen(true);
    } else {
      setIsExpanded((expanded) => !expanded);
    }
  };

  return (
    <>
      <aside
        className={clsx(
          "sticky top-0 flex h-screen shrink-0 flex-col overflow-x-hidden border-r border-separator bg-surface transition-[width]",
          isExpanded && !isPhone ? "w-64 p-5" : "w-18 p-3",
        )}
      >
        <SidebarContent
          isExpanded={isExpanded && !isPhone}
          onToggle={toggleSidebar}
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
