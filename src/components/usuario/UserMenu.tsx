import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../auth/AuthFirebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../hooks/usuario/useUsuario';

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { usuario, loading } = useUsuario();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.localStorage.removeItem('token');
      navigate('/login');
    } catch (error) { 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || loading) {
    return (
      <button
        onClick={() => navigate('/login')}
        className={`bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition font-medium ${className}`}
      >
        Iniciar Sesión
      </button>
    );
  }
  const nombre = user.displayName || usuario?.nombre || 'Usuario';
  const email = user.email || usuario?.email || '';
  const foto = usuario?.foto || user.photoURL || '';

  return (
    <div ref={menuRef} className={`relative z-[1000] ${className}`}>
      <div
        className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {foto ? (
          <img
            src={foto}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {email?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">{nombre}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-background rounded-lg shadow-lg border border-border z-[1000] animate-in fade-in slide-in-from-top-1">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">{nombre}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              navigate('/EditarPerfil');
            }}
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition"
          >
            Editar perfil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
