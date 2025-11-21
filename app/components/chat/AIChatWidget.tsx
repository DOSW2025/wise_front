import { useAIChat } from '@/lib/api/useAIChat';
import ChatFloatingButton from './ChatFloatingButton';
import ChatPanel from './ChatPanel';

/**
 * Widget completo del asistente de IA.
 * - Botón flotante inferior derecho
 * - Panel lateral con historial de mensajes
 */
export function AIChatWidget() {
  const {
    isOpen,
    toggleOpen,
    messages,
    isSending,
    error,
    sendUserMessage,
    sendQuickAction,
  } = useAIChat();

  return (
    <>
      <ChatFloatingButton onClick={toggleOpen} />
      <ChatPanel
        isOpen={isOpen}
        onClose={toggleOpen}
        messages={messages}
        isSending={isSending}
        error={error}
        onSend={sendUserMessage}
        onQuickAction={sendQuickAction}
      />
    </>
  );
}

export default AIChatWidget;
