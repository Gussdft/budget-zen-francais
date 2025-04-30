
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface TopBarProps {
  title: string;
}

export const TopBar = ({ title }: TopBarProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <MobileMenu />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold ml-4">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};
