import { useEffect, useRef } from "react";
import MessageItem from "./messageItem";

interface Message {
  id: string;
  type: "text" | "file";
  content: string;
  name?: string;
  sender: "student" | "tutor";
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  tutorName: string;
}

export default function MessageList({ messages, tutorName }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4 flex flex-col gap-3">
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          <p>No hay mensajes aún</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            tutorName={tutorName}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}