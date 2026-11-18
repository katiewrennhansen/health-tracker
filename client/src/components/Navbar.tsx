import { Show, UserButton } from "@clerk/react";
import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Today" },
  { to: "/history", label: "History" },
] as const;

export function Navbar() {
  return (
    <Show when="signed-in">
      <div className="flex items-center justify-between gap-4">
        <nav aria-label="Main">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-accent"
                      : "text-muted hover:text-foreground"
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <UserButton />
      </div>
    </Show>
  );
}
