
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!isMobile && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
