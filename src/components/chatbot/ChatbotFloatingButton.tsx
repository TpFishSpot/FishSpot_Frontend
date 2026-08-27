import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatbotModal } from './ChatbotModal';

export const ChatbotFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    // En pantallas de celular, abrir directamente la pantalla completa nativa de chat
    if (window.innerWidth < 640) {
      navigate('/chatbot');
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div
        className="fixed z-[90] right-4 sm:right-6"
        style={{
          bottom: 'max(80px, calc(80px + env(safe-area-inset-bottom)))',
        }}
      >
        <button
          onClick={handleClick}
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-primary to-primary-focus text-primary-foreground shadow-2xl shadow-primary/35 hover:scale-110 active:scale-90 transition-all duration-300 border border-primary-foreground/15"
          aria-label="Abrir compañero de pesca IA"
        >
          {/* Doble pulso exterior */}
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-60 duration-1000 -z-10" />
          <span className="absolute inset-0 rounded-full bg-primary/20 scale-125 animate-pulse opacity-40 duration-1000 -z-10" />

          <Bot className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:rotate-6 duration-200" />

          <span
            className="absolute -top-0.5 -right-0.5 flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-[9px] text-white shadow-md ring-2 ring-background animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5" />
          </span>

          {/* Tooltip en desktop */}
          <span className="hidden sm:group-hover:flex items-center gap-1.5 absolute right-16 px-3.5 py-2 rounded-2xl bg-popover/95 backdrop-blur-md text-popover-foreground text-xs font-bold shadow-xl border border-border/40 whitespace-nowrap animate-in fade-in slide-in-from-right-3 duration-200">
            <span>Compañero IA</span>
            <span className="text-sm">🎣</span>
          </span>
        </button>
      </div>

      <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
