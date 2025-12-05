import { Avatar } from "@heroui/react";
import { Paperclip } from "lucide-react";

interface MessageItemProps {
  message: {
    id: string;
    type: "text" | "file";
    content: string;
    name?: string;
    sender: "student" | "tutor";
    timestamp: Date;
  };
  tutorName: string;
}

export default function MessageItem({ message, tutorName }: MessageItemProps) {
  const isStudent = message.sender === "student";

  return (
    <div className={`flex gap-2 ${isStudent ? "justify-end" : "justify-start"}`}>
      {!isStudent && (
        <Avatar
          name={tutorName.split(" ").map(n => n[0]).join("")}
          color="danger"
          size="sm"
          className="flex-shrink-0"
        />
      )}
      
      <div
        className={`px-4 py-2 rounded-2xl max-w-[70%] ${
          isStudent
            ? "bg-red-500 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {message.type === "text" && (
          <p className="text-sm break-words">{message.content}</p>
        )}

        {message.type === "file" && (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 underline text-sm"
          >
            <Paperclip className="w-4 h-4" />
            {message.name}
          </a>
        )}

        <span
          className={`text-xs mt-1 block ${
            isStudent ? "text-red-100" : "text-gray-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isStudent && (
        <Avatar
          name="Tú"
          color="default"
          size="sm"
          className="flex-shrink-0"
        />
      )}
    </div>
  );
}
