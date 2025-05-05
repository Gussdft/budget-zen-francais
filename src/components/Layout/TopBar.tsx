
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";

interface TopBarProps {
  title?: string;
}

export const TopBar = ({ title = "BudgetZen" }: TopBarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background shadow-sm">
      <div className="flex items-center">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold ml-4 bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};
