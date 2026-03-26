import { Home, ChefHat, Package } from "lucide-react";
import { NavLink } from "./NavLink";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/recipes", icon: ChefHat, label: "Recipes" },
  { to: "/inventory", icon: Package, label: "Inventory" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
