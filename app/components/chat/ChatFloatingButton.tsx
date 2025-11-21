import { Button } from '@heroui/react';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface ChatFloatingButtonProps {
  onClick: () => void;
}

/**
 * Botón flotante inferior derecho que abre el chat de IA.
 */
export function ChatFloatingButton({ onClick }: ChatFloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40"
      aria-label="Abrir asistente ECIWISE+"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <Button
          isIconOnly
          className="relative w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 transition-transform"
        >
          <SparklesIcon className="w-7 h-7" />
        </Button>
      </div>
    </button>
  );
}

export default ChatFloatingButton;
