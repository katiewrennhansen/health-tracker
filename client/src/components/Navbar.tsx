import { Link } from "@tanstack/react-router";

const navItems = [
  { to: "/", label: "Today" },
  { to: "/history", label: "History" },
] as const;

export function Navbar() {
  return (
    <nav aria-label="Main">
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              activeOptions={{ exact: true }}
              className="text-muted hover:text-foreground data-[status=active]:font-semibold data-[status=active]:text-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
