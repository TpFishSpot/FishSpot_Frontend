import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { ChatbotModal } from './ChatbotModal';

export const ChatbotFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-24 right-5 z-[90] sm:bottom-6 sm:right-6">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-primary-focus text-primary-foreground shadow-3xl shadow-primary/30 hover:scale-110 hover:shadow-primary/50 active:scale-95 transition-all duration-300 border border-primary-foreground/10"
          aria-label="Abrir compañero de pesca IA"
        >
          {/* Doble pulso de animación exterior */}
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-60 duration-1000 -z-10" />
          <span className="absolute inset-0 rounded-full bg-primary/20 scale-125 animate-pulse opacity-40 duration-1000 -z-10" />

          <Bot className="w-7 h-7 transition-transform group-hover:rotate-6 duration-200" />
          
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-[9px] text-white shadow-md ring-2 ring-background animate-bounce" style={{ animationDuration: '3s' }}>
            <Sparkles className="w-2.5 h-2.5" />
          </span>

          {/* Tooltip en desktop con Glassmorphism */}
          <span className="hidden sm:group-hover:flex items-center gap-1.5 absolute right-17 px-3.5 py-2 rounded-2xl bg-popover/90 backdrop-blur-md text-popover-foreground text-xs font-bold shadow-xl border border-border/40 whitespace-nowrap animate-in fade-in slide-in-from-right-3 duration-200">
            <span>Compañero IA</span>
            <span className="text-sm">🎣</span>
          </span>
        </button>
      </div>

      <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
