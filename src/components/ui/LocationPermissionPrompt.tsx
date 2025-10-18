import { useState, useEffect } from 'react';

interface LocationPermissionPromptProps {
  onPermissionGranted: () => void;
}

export const LocationPermissionPrompt = ({ onPermissionGranted }: LocationPermissionPromptProps) => {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (!navigator.geolocation) {
      setPermissionState('denied');
      return;
    }

    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
        
        if (result.state === 'granted') {
          onPermissionGranted();
        }

        result.onchange = () => {
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          if (result.state === 'granted') {
            onPermissionGranted();
          }
        };
      } catch (error) {
        setPermissionState('prompt');
      }
    } else {
      setPermissionState('prompt');
    }
  };

  const requestPermission = () => {
    if (!navigator.geolocation) {
      setPermissionState('denied');
      setShowInstructions(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setPermissionState('granted');
        onPermissionGranted();
        setTimeout(() => {
          window.location.reload();
        }, 100);
      },
      (error) => {
        console.error('Error de geolocalización:', error.code, error.message);
        if (error.code === 1) {
          setPermissionState('denied');
          setShowInstructions(true);
        } else if (error.code === 2) {
          alert('No se pudo obtener tu ubicación. Verifica que tengas GPS/WiFi activo.');
          setPermissionState('granted');
          onPermissionGranted();
        } else if (error.code === 3) {
          alert('La solicitud de ubicación expiró. Intenta de nuevo.');
          setPermissionState('granted');
          onPermissionGranted();
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }
    );
  };

  if (permissionState === 'checking' || permissionState === 'granted') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Activa tu ubicación
          </h2>
          <p className="text-gray-600">
            Para mostrarte los mejores spots de pesca cerca de ti
          </p>
        </div>

        {!showInstructions ? (
          <div className="space-y-3">
            <button
              onClick={requestPermission}
              onTouchEnd={(e) => {
                e.preventDefault();
                requestPermission();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Activar ubicación
            </button>
            <p className="text-xs text-gray-500 text-center">
              Se solicitarán permisos de ubicación
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 font-semibold mb-2">
                Permisos bloqueados
              </p>
              <p className="text-sm text-amber-700">
                Para usar FishSpot, activa la ubicación en la configuración:
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <p>Ve a <strong>Configuración</strong> de tu dispositivo</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <p>Busca <strong>Safari</strong> o <strong>Privacidad</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <p>Encuentra <strong>FishSpot</strong> y activa la ubicación</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <p>Vuelve a la app y recarga</p>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Recargar app
            </button>
          </div>
        )}

        <button
          onClick={() => {
            setPermissionState('granted');
            onPermissionGranted();
          }}
          className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm py-2"
        >
          Continuar sin ubicación
        </button>
      </div>
    </div>
  );
};
