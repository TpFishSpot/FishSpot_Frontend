import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../auth/AuthFirebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition ${className}`}
      >
        Iniciar Sesión
      </button>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user.email?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-700">
            {user.displayName || user.email?.split('@')[0]}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
      
      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-3 border-b">
          <p className="text-sm font-medium text-gray-900">
            {user.displayName || 'Usuario'}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
