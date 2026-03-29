import { Home, ChefHat, Package, Shield, LogOut } from "lucide-react";
import { NavLink } from "./NavLink";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

const baseTabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/recipes", icon: ChefHat, label: "Recipes" },
  { to: "/inventory", icon: Package, label: "Inventory" },
];

export function BottomNav() {
  const { user, isAdmin, signOut } = useAuthContext();
  const location = useLocation();

  // Don't show nav on login/signup pages
  if (!user || location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const tabs = isAdmin
    ? [...baseTabs, { to: "/admin", icon: Shield, label: "Admin" }]
    : baseTabs;

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
        <button
          onClick={signOut}
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-muted-foreground transition-colors hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[11px] font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}
