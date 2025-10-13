import type React from "react";
import { MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useHapticFeedback } from "../../hooks/ui/useHapticFeedback";
import { MobileHamburgerMenu } from "../ui/MobileHamburgerMenu";
import { useState } from "react";

interface NavigationBarProps {
  onCreateSpotClick?: () => void;
  onSearch?: (query: string) => void;
  className?: string;
}

const MobileNavigationBar: React.FC<NavigationBarProps> = ({ onSearch, className = "" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerSelectionHaptic } = useHapticFeedback();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigation = (path: string) => {
    triggerSelectionHaptic();
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className={`bg-background/95 backdrop-blur-sm shadow-lg border-b border-border z-[100] ${className}`} style={{overflow: 'visible'}}>
      <div className="w-full px-2">
        <div className="flex items-center h-14 justify-between relative" style={{overflow: 'visible'}}>
          <button
            className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center active:scale-95 ml-1"
            onClick={() => handleNavigation("/")}
          >
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </button>
          <form onSubmit={handleSearchSubmit} className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[140px]">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-0.5 text-sm bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                style={{minWidth: '0'}}
              />
            </div>
          </form>
          <div className="flex items-center pr-2 z-[101]" style={{overflow: 'visible'}}>
            {user && <MobileHamburgerMenu />}
            {!user && (
              <button
                onClick={() => handleNavigation('/login')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded-xl transition font-medium flex-shrink-0 active:scale-95 text-sm"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigationBar;