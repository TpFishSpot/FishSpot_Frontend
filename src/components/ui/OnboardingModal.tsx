import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  MapPin, 
  Fish, 
  Camera, 
  Bot, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Check, 
  Layers, 
  ThermometerSun, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { useOnboarding } from '../../hooks/ui/useOnboarding';
import { useNavigate } from 'react-router-dom';

interface Slide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  features: {
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
  highlight?: string;
  actionText?: string;
  actionPath?: string;
}

const slides: Slide[] = [
  {
    id: 'intro',
    badge: '¿Qué es FishSpot?',
    badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
    title: 'Tu compañero definitivo de pesca deportiva',
    subtitle: 'La plataforma comunitaria creada por y para pescadores. Información real, geolocalizada y al instante para que nunca más salgas a pescar a ciegas.',
    icon: Compass,
    iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    iconColor: 'text-white',
    features: [
      {
        icon: ShieldCheck,
        title: 'El problema que resolvemos',
        description: 'Se acabó el perder tiempo buscando dónde hay buen pique, cómo llegar al lugar, qué carnada llevar o qué especies están activas.'
      },
      {
        icon: Layers,
        title: 'Todo en un solo lugar',
        description: 'Spots validados, bitácora de capturas personal, guía exhaustiva de especies y asistencia con Inteligencia Artificial.'
      }
    ],
    highlight: '💡 Más de 100+ spots y capturas registradas por la comunidad.'
  },
  {
    id: 'mapa',
    badge: 'Apartado 1',
    badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20',
    title: 'Mapa Interactivo de Spots 📍',
    subtitle: 'Encuentra y comparte los mejores lugares de pesca en ríos, lagunas, diques y mar.',
    icon: MapPin,
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    iconColor: 'text-white',
    features: [
      {
        icon: Compass,
        title: 'Explora & Filtra',
        description: 'Filtra spots por especie objetivo, tipo de pesca (costa, embarcado, mosca) y modalidad.'
      },
      {
        icon: ThermometerSun,
        title: 'Información completa del spot',
        description: 'Accede a indicaciones de llegada, estado del pique, fotos reales, carnadas recomendadas y clima.'
      },
      {
        icon: Sparkles,
        title: 'Comparte tus descubrimientos',
        description: 'Suma nuevos puntos de pesca para ayudar a la comunidad y recibe valoraciones.'
      }
    ]
  },
  {
    id: 'capturas',
    badge: 'Apartado 2',
    badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    title: 'Bitácora de Capturas 🎣',
    subtitle: 'Guarda el historial de tus jornadas y mantén un recuerdo imborrable de cada pique.',
    icon: Camera,
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconColor: 'text-white',
    features: [
      {
        icon: Award,
        title: 'Registra tus trofeos',
        description: 'Guarda fotos, peso, medidas, fecha, especie, señuelo o carnada utilizada y condiciones de la jornada.'
      },
      {
        icon: Layers,
        title: 'Tus estadísticas personales',
        description: 'Consulta tus especies más pescadas, mejores meses y progresión en tu perfil de pescador.'
      }
    ]
  },
  {
    id: 'especies',
    badge: 'Apartado 3',
    badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20',
    title: 'Guía de Especies 🐟',
    subtitle: 'Aprende sobre la fauna acuática y las técnicas más efectivas para cada pez.',
    icon: Fish,
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconColor: 'text-white',
    features: [
      {
        icon: Fish,
        title: 'Fichas técnicas detalladas',
        description: 'Conoce la morfología, hábitat natural, alimentación, tallas mínimas reglamentarias y vedas.'
      },
      {
        icon: Sparkles,
        title: 'Carnadas y señuelos clave',
        description: 'Descubre con qué pican mejor según la época del año y el tipo de agua dulce o salada.'
      }
    ]
  },
  {
    id: 'agente',
    badge: 'Apartado 4',
    badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
    title: 'Asistente IA de Pesca 🤖',
    subtitle: 'Tu guía experto en el bolsillo, disponible las 24 horas.',
    icon: Bot,
    iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    iconColor: 'text-white',
    features: [
      {
        icon: Bot,
        title: 'Respuestas inteligentes',
        description: 'Pregúntale qué línea usar, qué equipo conviene armar, cómo influye el viento o qué spot te conviene visitar hoy.'
      },
      {
        icon: Sparkles,
        title: 'Siempre disponible',
        description: 'Accede al chatbot tocando el botón flotante del asistente o desde la sección dedicada.'
      }
    ]
  },
  {
    id: 'comenzar',
    badge: '¡Comienza ahora!',
    badgeColor: 'bg-primary/15 text-primary border-primary/20',
    title: '¡Todo listo para tu próxima salida!',
    subtitle: 'Únete a la comunidad de pescadores de FishSpot y disfruta de la mejor experiencia.',
    icon: Sparkles,
    iconBg: 'bg-gradient-to-br from-primary to-emerald-600',
    iconColor: 'text-white',
    features: [
      {
        icon: Check,
        title: 'Explora libremente',
        description: 'Navega el mapa, consulta spots y revisa las especies de inmediato.'
      },
      {
        icon: Check,
        title: 'Crea tu cuenta',
        description: 'Regístrate o inicia sesión para guardar tus capturas, subir spots y sincronizar tus salidas.'
      }
    ],
    highlight: '🎣 ¿Listo para tu próxima gran captura?'
  }
];

export const OnboardingModal: React.FC = () => {
  const { isOpen, closeOnboarding } = useOnboarding();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const navigate = useNavigate();

  const currentSlide = slides[currentSlideIndex];
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === slides.length - 1;

  // Keyboard navigation (Escape to close, arrows to navigate)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeOnboarding(dontShowAgain);
      } else if (e.key === 'ArrowRight') {
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlideIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex, dontShowAgain, closeOnboarding]);

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      closeOnboarding(dontShowAgain);
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }, [isLastSlide, closeOnboarding, dontShowAgain]);

  const handlePrev = useCallback(() => {
    if (!isFirstSlide) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }, [isFirstSlide]);

  const handleSkip = useCallback(() => {
    closeOnboarding(dontShowAgain);
  }, [closeOnboarding, dontShowAgain]);

  const handleStartExploring = useCallback(() => {
    closeOnboarding(true);
    navigate('/');
  }, [closeOnboarding, navigate]);

  if (!isOpen) return null;

  const IconComponent = currentSlide.icon;

  return createPortal(
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div 
        className="relative w-full max-w-xl bg-background border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in zoom-in-95 duration-200"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${currentSlide.badgeColor}`}>
              {currentSlide.badge}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Paso {currentSlideIndex + 1} de {slides.length}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Cerrar guía"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Main Visual & Title */}
          <div className="flex items-start space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${currentSlide.iconBg} ${currentSlide.iconColor}`}>
              <IconComponent className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="onboarding-title" className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
                {currentSlide.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {currentSlide.subtitle}
              </p>
            </div>
          </div>

          {/* Feature List Cards */}
          <div className="space-y-2.5 pt-1">
            {currentSlide.features.map((feat, idx) => {
              const FeatIcon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-primary/10 text-primary flex-shrink-0 mt-0.5">
                    <FeatIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Highlight Box */}
          {currentSlide.highlight && (
            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-center">
              <p className="text-xs sm:text-sm font-medium text-primary">
                {currentSlide.highlight}
              </p>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-border/60 bg-muted/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Progress dots & Don't show again toggle */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-1.5" role="tablist">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlideIndex 
                      ? 'w-6 bg-primary' 
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Ir a la diapositiva ${index + 1}`}
                />
              ))}
            </div>

            <label className="flex items-center space-x-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
              />
              <span>No volver a mostrar automáticamente</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            {!isFirstSlide && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors flex items-center space-x-1 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
            )}

            {!isLastSlide ? (
              <button
                onClick={handleNext}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all shadow-md flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartExploring}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-500 text-white text-sm font-semibold transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>¡Comenzar a explorar!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OnboardingModal;
