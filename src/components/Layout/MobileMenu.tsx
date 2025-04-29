
import { Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { X, Home, PieChart, WalletCards, Target, TrendingUp, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
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
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 -translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-full"
          >
            <Dialog.Panel className="relative w-full max-w-xs flex-1 bg-background">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="rounded-md p-2 text-muted-foreground hover:text-foreground focus:outline-none"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              
              <div className="h-full flex flex-col overflow-y-auto">
                <div className="flex items-center h-16 px-4 border-b border-border">
                  <span className="text-xl font-bold text-budget-primary">BudgetZen</span>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        "flex items-center py-3 px-3 rounded-md transition-colors",
                        location.pathname === item.path 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
