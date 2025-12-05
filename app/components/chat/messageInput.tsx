import { useState } from "react";
import { Button } from "@heroui/react";
import { Send, Paperclip } from "lucide-react";

interface MessageInputProps {
  onSendText: (text: string) => void;
  onSendFile: (file: File) => void;
}

export default function MessageInput({ onSendText, onSendFile }: MessageInputProps) {
  const [text, setText] = useState("");

  function handleSend() {
    if (!text.trim()) return;
    onSendText(text);
    setText("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(file);
      // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
      e.target.value = "";
    }
  }

  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="flex gap-2 items-end">
        <input
          type="file"
          id="file-input"
          className="hidden"
          onChange={handleFile}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        <Button
          isIconOnly
          variant="light"
          aria-label="Adjuntar archivo"
          onPress={() => document.getElementById("file-input")?.click()}
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </Button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Escribe un mensaje…"
        />

        <Button
          isIconOnly
          color="danger"
          aria-label="Enviar"
          onPress={handleSend}
          isDisabled={!text.trim()}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}