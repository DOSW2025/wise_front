import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
  ScrollShadow,
} from '@heroui/react';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import type { ChatMessage } from '@/lib/api/ai-chat.service';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onQuickAction: (prompt: string) => void;
}

/**
 * Panel lateral del asistente IA, inspirado en el mockup.
 */
export function ChatPanel({
  isOpen,
  onClose,
  messages,
  isSending,
  error,
  onSend,
  onQuickAction,
}: ChatPanelProps) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const text = (formData.get('message') as string) ?? '';
    if (!text.trim()) return;
    onSend(text);
    event.currentTarget.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 lg:inset-y-0 lg:right-0 lg:left-auto flex justify-end z-40 pointer-events-none">
      <div className="h-full w-full max-w-md p-4 lg:p-6 flex items-end lg:items-center justify-end pointer-events-none">
        <Card className="w-full h-[75vh] lg:h-[80vh] flex flex-col shadow-2xl pointer-events-auto">
          <CardHeader className="bg-primary text-white flex justify-between items-center rounded-t-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Asistente ECIWISE+</span>
                <span className="text-xs text-white/80">
                  Siempre disponible para ayudarte
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/15 transition-colors"
              aria-label="Cerrar asistente"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardBody className="flex flex-col gap-3 px-4 py-3">
            <ScrollShadow className="flex-1 flex flex-col gap-3 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-default-100 text-foreground rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex items-center gap-2 text-xs text-default-500">
                  <span className="w-2 h-2 rounded-full bg-default-400 animate-bounce" />
                  El asistente está escribiendo…
                </div>
              )}
              {error && <p className="text-xs text-danger mt-1">{error}</p>}
            </ScrollShadow>

            <div className="mt-2">
              <p className="text-xs font-semibold mb-2 text-default-500">
                Acciones rápidas
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="cursor-pointer"
                  onClick={() =>
                    onQuickAction(
                      'Buscar materiales recomendados para mi curso de hoy.',
                    )
                  }
                >
                  Buscar materiales
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="cursor-pointer"
                  onClick={() =>
                    onQuickAction('Ayúdame a agendar una tutoría esta semana.')
                  }
                >
                  Agendar tutoría
                </Chip>
                <Chip
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="cursor-pointer"
                  onClick={() =>
                    onQuickAction(
                      'Necesito ayuda general sobre el uso de ECIWISE+.',
                    )
                  }
                >
                  Ayuda general
                </Chip>
              </div>
            </div>
          </CardBody>

          <CardFooter className="border-t border-default-200 px-4 py-3">
            <form
              onSubmit={handleSubmit}
              className="w-full flex items-center gap-2"
            >
              <Input
                name="message"
                placeholder="Escribe tu pregunta..."
                radius="lg"
                className="flex-1"
                disabled={isSending}
              />
              <Button
                type="submit"
                isIconOnly
                color="primary"
                isDisabled={isSending}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default ChatPanel;
