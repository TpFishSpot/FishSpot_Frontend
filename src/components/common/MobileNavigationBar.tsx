import type React from "react";
import { MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserMenu from "../usuario/UserMenu";
import { useAuth } from "../../contexts/AuthContext";
import { useUserRoles } from "../../hooks/auth/useUserRoles";
import { useHapticFeedback } from "../../hooks/ui/useHapticFeedback";

interface NavigationBarProps {
  onCreateSpotClick?: () => void;
  className?: string;
}

const MobileNavigationBar: React.FC<NavigationBarProps> = ({ onCreateSpotClick, className = "" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isModerator } = useUserRoles();
  const { triggerSelectionHaptic } = useHapticFeedback();

  const handleCreateSpot = () => {
    triggerSelectionHaptic();
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (onCreateSpotClick) {
      onCreateSpotClick();
    }
  };

  const handleNavigation = (path: string) => {
    triggerSelectionHaptic();
    navigate(path);
  };

  return (
    <div className={`bg-background/95 backdrop-blur-sm shadow-lg border-b border-border relative z-50 ${className}`}>
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer active:scale-95 transition-transform" 
            onClick={() => handleNavigation("/")}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FishSpot</span>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handleCreateSpot}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl transition-all font-medium min-h-[44px] active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Spot</span>
            </button>

            {user && isModerator && (
              <>
                <button
                  onClick={() => handleNavigation("/usuarios")}
                  className="flex items-center space-x-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-3 rounded-xl transition-all font-medium min-h-[44px] active:scale-95"
                >
                  Usuarios
                </button>
                <button
                  onClick={() => handleNavigation("/spots/pendientes")}
                  className="flex items-center space-x-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-3 rounded-xl transition-all font-medium min-h-[44px] active:scale-95"
                >
                  Spots
                </button>
              </>
            )}

            <UserMenu />
          </div>

          <div className="md:hidden">
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigationBar;