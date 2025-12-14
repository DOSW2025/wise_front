import { Button } from '@heroui/react';
import { Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';

interface MessageInputProps {
	onSendText: (text: string) => void;
	onSendFile: (file: File) => void;
	onTyping?: () => void;
	onStopTyping?: () => void;
}

export default function MessageInput({
	onSendText,
	onSendFile,
	onTyping,
	onStopTyping,
}: MessageInputProps) {
	const [text, setText] = useState('');
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	function handleSend() {
		if (!text.trim()) return;
		onSendText(text);
		setText('');
		if (onStopTyping) {
			onStopTyping();
		}
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
			typingTimeoutRef.current = null;
		}
	}

	function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newText = e.target.value;
		setText(newText);

		if (newText.length > 0 && onTyping) {
			onTyping();

			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			typingTimeoutRef.current = setTimeout(() => {
				if (onStopTyping) {
					onStopTyping();
				}
			}, 1000);
		} else if (newText.length === 0 && onStopTyping) {
			onStopTyping();
		}
	}

	function handleKey(e: React.KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			onSendFile(file);
			// Limpiar el input para permitir seleccionar el mismo archivo de nuevo
			e.target.value = '';
		}
	}

	return (
		<div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
			<div className="flex gap-2 items-end max-w-4xl mx-auto">
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
					onPress={() => document.getElementById('file-input')?.click()}
				>
					<Paperclip className="w-5 h-5 text-gray-600" />
				</Button>

				<input
					type="text"
					value={text}
					onChange={handleTextChange}
					onKeyDown={handleKey}
					className="flex-1 border-2 border-primary/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
					placeholder="Escribe un mensaje…"
				/>

				<Button
					isIconOnly
					color="primary"
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