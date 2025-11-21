import { useState } from 'react';
import { sendMessageToAssistant, type ChatMessage } from './ai-chat.service';

/**
 * Hook que encapsula el estado y las acciones del chat de IA.
 * Gestiona el historial local de mensajes y el ciclo de envío.
 */
export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        '¡Hola! Soy el asistente de ECIWISE+. ¿En qué puedo ayudarte hoy?',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleOpen = () => setIsOpen((prev: boolean) => !prev);

  const sendUserMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setIsSending(true);
    setError(null);

    try {
      const assistantMessage = await sendMessageToAssistant({
        messages: [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError(
        'Ocurrió un problema al conectar con el asistente. Intenta de nuevo en unos minutos.',
      );
    } finally {
      setIsSending(false);
    }
  };

  const sendQuickAction = (prompt: string) => {
    void sendUserMessage(prompt);
  };

  return {
    isOpen,
    toggleOpen,
    messages,
    isSending,
    error,
    sendUserMessage,
    sendQuickAction,
  };
}
