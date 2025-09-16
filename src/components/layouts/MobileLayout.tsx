import type { ReactNode } from "react";
import { BottomNavigation } from "../ui/BottomNavigation";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  children: ReactNode;
}

const hideBottomNavPaths = ["/login", "/registro"];

export const MobileLayout = ({ children }: Props) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const showBottomNav = isMobile && !hideBottomNavPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen safe-area-inset-left safe-area-inset-right">
      <main 
        className={`flex-1 ${showBottomNav ? "pb-16 safe-area-inset-bottom" : ""}`}
      >
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};