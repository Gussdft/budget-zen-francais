
import { useIsMobile } from "@/hooks/use-mobile";
import { Bell, MenuIcon, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";

export function TopBar() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="h-16 px-4 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between">
      {isMobile && (
        <>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <MenuIcon className="h-5 w-5" />
          </Button>
          <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <div className="text-xl font-bold text-budget-primary">BudgetZen</div>
        </>
      )}
      
      <div className={isMobile ? "w-5" : "w-60"}>
        {/* Placeholder for balance on desktop */}
        {!isMobile && (
          <div className="text-sm">
            <span className="text-muted-foreground">Balance totale:</span>
            <span className="ml-2 font-semibold">1 250,00 €</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mon profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
