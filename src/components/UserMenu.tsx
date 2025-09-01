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
        className={`bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition font-medium ${className}`}
      >
        Iniciar Sesión
      </button>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {user.email?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">
            {user.displayName || user.email?.split('@')[0]}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <div className="absolute right-0 top-full mt-1 w-48 bg-background rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000]">
        <div className="p-3 border-b border-border">
          <p className="text-sm font-medium text-foreground">
            {user.displayName || 'Usuario'}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
