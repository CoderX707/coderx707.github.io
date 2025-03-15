import { useState } from "react";
import Sidebar from "./components/layout/sidebar";
import Dashboard from "./pages/dashboard";
import CreateInvoice from "./pages/invoices/create";
import { LayoutDashboard, FileText, Users } from "lucide-react";
import Clients from "./pages/clients";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, component: <Dashboard /> },
  { name: "Invoices", icon: FileText, component: <CreateInvoice /> },
  { name: "Clients", icon: Users, component: <Clients /> },
];

export default function Music() {
  const [activeMenu, setActiveMenu] = useState(menu[0]);
  return (
    <div className="flex">
      <Sidebar
        menu={menu}
        onClick={(selectedMenu) => setActiveMenu(selectedMenu)}
      />
      <main className="p-8">{activeMenu.component}</main>
    </div>
  );
}
