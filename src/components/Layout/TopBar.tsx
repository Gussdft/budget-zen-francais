
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { Bell, LogOut, MenuIcon, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function TopBar() {
  const isMobile = useIsMobile();
  const { userEmail, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
  };

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
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{userEmail ? userEmail : 'Mon profil'}</span>
            </DropdownMenuItem>
            <Link to="/parametres">
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
