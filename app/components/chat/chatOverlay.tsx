import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalBody, Avatar, Button } from "@heroui/react";
import { X } from "lucide-react";
import MessageList from "./messageList";
import MessageInput from "./messageInput";

interface Message {
  id: string;
  type: "text" | "file";
  content: string;
  name?: string;
  sender: "student" | "tutor";
  timestamp: Date;
}

interface ChatOverlayProps {
  tutor: { id: number; name: string; title: string; avatarInitials: string } | null;
  onClose: () => void;
}

export default function ChatOverlay({ tutor, onClose }: ChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (tutor) {
      // Mensaje de bienvenida automático del tutor
      setMessages([
        {
          id: "welcome",
          type: "text",
          content: `¡Hola! Soy ${tutor.name}. ¿En qué puedo ayudarte hoy?`,
          sender: "tutor",
          timestamp: new Date()
        }
      ]);
    }
  }, [tutor]);

  function sendText(text: string) {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "text",
      content: text,
      sender: "student",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // TODO: Aquí integrarías tu lógica de API para enviar el mensaje al backend
    // Ejemplo de respuesta simulada del tutor (reemplazar con tu lógica real)
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        type: "text",
        content: "Gracias por tu mensaje. Te responderé pronto.",
        sender: "tutor",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  }

  function sendFile(file: File) {
    const url = URL.createObjectURL(file);
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "file",
      content: url,
      name: file.name,
      sender: "student",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // TODO: Aquí subirías el archivo a tu servidor
  }

  if (!tutor) return null;

  return (
      <Modal
        isOpen={true}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          backdrop: "bg-black/50",
          wrapper: "!justify-end !items-stretch",
          base: "rounded-3xl",
          body: "rounded-3xl",
        }}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              x: 50,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
      <ModalContent>
        <ModalBody className="p-0 flex flex-col h-[600px]">
          {/* Header del chat */}
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <Avatar
                name={tutor.avatarInitials}
                color="danger"
                size="sm"
              />
              <div>
                <h2 className="font-semibold text-gray-800">{tutor.name}</h2>
                <p className="text-xs text-gray-500">{tutor.title}</p>
              </div>
            </div>
            
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto bg-white">
            <MessageList messages={messages} tutorName={tutor.name} />
          </div>

          {/* Input de mensajes */}
          <MessageInput onSendText={sendText} onSendFile={sendFile} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
