// import { Link, useLocation } from "wouter";
import { cn } from "../../lib/utils";
// import { LayoutDashboard, FileText, Users } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: "" },
  { name: "Invoices", href: "/invoices/create", icon: "" },
  { name: "Clients", href: "/clients", icon: "" },
];

export default function Sidebar({ menu, onClick }) {
  // const [location] = useLocation();

  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-border">
      <nav className="flex-1 px-4 py-4">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <span
            key={item.name}
              onClick={() => onClick(item)}
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md mb-1"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
