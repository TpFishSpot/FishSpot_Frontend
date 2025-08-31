import React from 'react';
import { MapPin, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useAuth } from '../contexts/AuthContext';

interface NavigationBarProps {
  onCreateSpotClick?: () => void;
  className?: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  onCreateSpotClick, 
  className = '' 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateSpot = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (onCreateSpotClick) {
      onCreateSpotClick();
    }
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FishSpot</span>
          </div>

          {/* Center actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateSpot}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Crear Spot</span>
            </button>

            {user && (
              <button
                onClick={() => navigate('/spots/pendientes')}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition font-medium"
              >
                <span className="hidden sm:inline">Spots Pendientes</span>
                <span className="sm:hidden">Pendientes</span>
              </button>
            )}
          </div>

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
