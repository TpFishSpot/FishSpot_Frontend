import { MapPin, Plus, Fish, Camera } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHapticFeedback } from '../../hooks/ui/useHapticFeedback';
import { useAuth } from '../../contexts/AuthContext';

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerSelectionHaptic } = useHapticFeedback();
  const { user } = useAuth();

  const handleNavigation = (path: string) => {
    triggerSelectionHaptic();
    navigate(path);
  };

  const handleCreateSpot = () => {
    triggerSelectionHaptic();
    if (user) {
      navigate('/crear-spot');
    } else {
      navigate('/login');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { 
      path: '/', 
      icon: MapPin, 
      label: 'Mapa',
      action: () => handleNavigation('/')
    },
    { 
      path: '/especies-guide', 
      icon: Fish, 
      label: 'Especies',
      action: () => handleNavigation('/especies-guide')
    },
    { 
      path: '/crear-spot', 
      icon: Plus, 
      label: 'Crear',
      isCreate: true,
      action: handleCreateSpot
    },
    { 
      path: '/mis-capturas', 
      icon: Camera, 
      label: 'Capturas',
      action: () => handleNavigation('/mis-capturas')
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={item.action}
              className={`
                flex flex-col items-center justify-center min-h-[64px] px-3 py-2 rounded-xl transition-all duration-200 active:scale-95
                ${active 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
                ${item.isCreate 
                  ? 'bg-primary text-primary-foreground scale-110 shadow-lg' 
                  : ''
                }
              `}
            >
              <Icon className={`w-5 h-5 ${item.isCreate ? 'w-6 h-6' : ''}`} />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};