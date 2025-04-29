
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  PieChart, 
  WalletCards, 
  Target, 
  TrendingUp, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { name: "Tableau de bord", icon: Home, path: "/" },
    { name: "Transactions", icon: WalletCards, path: "/transactions" },
    { name: "Catégories", icon: PieChart, path: "/categories" },
    { name: "Budgets & Projets", icon: Target, path: "/budgets" },
    { name: "Investissements", icon: TrendingUp, path: "/investissements" },
    { name: "Paramètres", icon: Settings, path: "/parametres" },
  ];
  
  return (
    <aside className={cn(
      "bg-sidebar h-screen border-r border-border transition-all duration-300 flex flex-col relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center h-16 px-4 border-b border-border">
        {!collapsed && (
          <span className="text-xl font-bold text-budget-primary">BudgetZen</span>
        )}
        {collapsed && (
          <span className="text-xl font-bold text-budget-primary mx-auto">B</span>
        )}
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "flex items-center py-3 px-3 rounded-md transition-colors",
                location.pathname === item.path 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-sidebar rounded-full p-1 border border-border"
      >
        {collapsed ? 
          <ArrowRight className="h-4 w-4" /> : 
          <ArrowLeft className="h-4 w-4" />
        }
      </button>
    </aside>
  );
}
