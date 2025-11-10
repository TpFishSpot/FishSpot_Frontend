import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, User, LogOut, Users, MapPin, Settings, Sun, Moon, Monitor, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../auth/AuthFirebase';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRoles } from '../../hooks/auth/useUserRoles';
import { useHapticFeedback } from '../../hooks/ui/useHapticFeedback';
import { useUsuario } from '../../hooks/usuario/useUsuario';
import { useTheme } from '../../contexts/ThemeContext'; 

export const MobileHamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { usuario } = useUsuario();
  const { isModerator } = useUserRoles();
  const { theme, setTheme } = useTheme(); 
  const navigate = useNavigate();
  const { triggerSelectionHaptic } = useHapticFeedback();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleNavigation = (path: string) => {
    triggerSelectionHaptic();
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    triggerSelectionHaptic();
    setIsOpen(false);
    try {
      await signOut(auth);
      navigate('/');
    } catch {}
  };

  const toggleMenu = () => {
    triggerSelectionHaptic();
    setIsOpen(!isOpen);
  };

  if (!user) return null;

  const nombre = user.displayName || usuario?.nombre || 'Usuario';
  const email = user.email || usuario?.email || '';
  const id = user.uid || usuario?.id;

  const fotoUsuario = usuario?.foto;
  const foto = fotoUsuario 
    ? fotoUsuario?.startsWith('http') 
        ? fotoUsuario
        :`${import.meta.env.VITE_API_URL}${fotoUsuario}`
    : null;


  return (
    <>
      <button
        onClick={toggleMenu}
        className="p-3 text-foreground hover:bg-muted rounded-xl transition-colors active:scale-95"
        style={{ marginRight: '2px' }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen &&
        createPortal(
          <>
            <div className="fixed inset-0 bg-black/40 z-[9999]" />
            <div
              ref={menuRef}
              className="fixed right-4 top-14 w-64 bg-background border border-border rounded-3xl shadow-2xl z-[10000] overflow-hidden transform transition-transform duration-300 ease-out"
              style={{
                boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                padding: '18px 0',
              }}
            >
              <Link to={`/profile/${id}`} className="group">
                <div className="px-5 pb-4 border-b border-border rounded-t-3xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
                      {foto ? (
                        <img
                          src={user.photoURL || usuario?.foto}
                          alt={nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-foreground truncate">{nombre}</p>
                      <p className="text-xs text-muted-foreground truncate">{email}</p>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="py-3 px-2">
                {isModerator && (
                  <>
                    <div className="px-4 py-2 mb-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Moderación</p>
                    </div>
                    <button
                      onClick={() => handleNavigation('/usuarios')}
                      className="w-full flex items-center space-x-3 px-5 py-3 text-foreground hover:bg-muted transition-colors active:bg-muted/70 rounded-xl mb-2"
                    >
                      <Users className="w-5 h-5" />
                      <span className="text-sm font-medium">Usuarios</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('/spots/pendientes')}
                      className="w-full flex items-center space-x-3 px-5 py-3 text-foreground hover:bg-muted transition-colors active:bg-muted/70 rounded-xl mb-2"
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm font-medium">Spots Pendientes</span>
                    </button>
                    <div className="h-px bg-border mx-5 my-3" />
                  </>
                )}

                <button
                  onClick={() => handleNavigation('/EditarPerfil')}
                  className="w-full flex items-center space-x-3 px-5 py-3 text-foreground hover:bg-muted transition-colors active:bg-muted/70 rounded-xl mb-2"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Editar Perfil</span>
                </button>

                <button
                  onClick={() => handleNavigation('/estadisticas')}
                  className="w-full flex items-center space-x-3 px-5 py-3 text-foreground hover:bg-muted transition-colors active:bg-muted/70 rounded-xl mb-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">Destacados</span>
                </button>

                <div className="px-4 py-2 mb-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tema</p>
                </div>
                <div className="flex justify-around px-5 py-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    title="Claro"
                  >
                    <Sun className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    title="Oscuro"
                  >
                    <Moon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-2 rounded-lg transition-colors ${theme === 'system' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    title="Sistema"
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                </div>

                <div className="h-px bg-border mx-5 my-3" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-5 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors active:bg-red-100 dark:active:bg-red-950/50 rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
};
