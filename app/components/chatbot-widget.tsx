import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { MessageCircle, Send, X } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { navigationChatService } from '~/lib/api/navigation-chat';

interface Message {
	id: string;
	text: string;
	isUser: boolean;
	timestamp: Date;
}

export function ChatbotWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			text: 'Hola! Soy tu asistente virtual de ECIWISE+. ¿En qué puedo ayudarte hoy?',
			isUser: false,
			timestamp: new Date(),
		},
	]);
	const [inputValue, setInputValue] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSendMessage = async () => {
		const textToSend = inputValue.trim();
		if (!textToSend || isSending) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: textToSend,
			isUser: true,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue('');
		setIsSending(true);
		setErrorMessage(null);

		try {
			const reply = await navigationChatService.sendMessage(textToSend);
			const botMessage: Message = {
				id: `${Date.now()}-bot`,
				text: reply,
				isUser: false,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, botMessage]);
		} catch (error) {
			const friendlyMessage =
				error instanceof Error
					? error.message
					: 'No pudimos obtener respuesta del asistente.';
			setErrorMessage(friendlyMessage);

			const fallbackMessage: Message = {
				id: `${Date.now()}-error`,
				text: 'Hubo un problema al conectar con el asistente. Intenta nuevamente en unos segundos.',
				isUser: false,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, fallbackMessage]);
		} finally {
			setIsSending(false);
		}
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSendMessage();
		}
	};

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
			{isOpen && (
				<Card className="w-80 h-[28rem] shadow-xl mb-4 animate-in slide-in-from-bottom-4 zoom-in-95 fade-in duration-500 ease-out">
					<CardHeader className="flex justify-between items-center bg-primary text-white rounded-t-lg">
						<div className="flex items-center gap-2">
							<MessageCircle size={20} />
							<span className="font-semibold">Asistente ECIWISE+</span>
						</div>
					</CardHeader>
					<CardBody className="p-0 flex flex-col">
						<div className="flex-1 p-4 overflow-y-auto space-y-3">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
								>
									<div
										className={`max-w-[80%] p-3 rounded-lg text-sm ${
											message.isUser
												? 'bg-primary text-white'
												: 'bg-default-100 text-foreground'
										}`}
									>
										{message.text}
									</div>
								</div>
							))}
						</div>
						<div className="p-4 border-t border-default-200">
							<div className="flex gap-2">
								<Input
									placeholder="Escribe tu mensaje..."
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									onKeyPress={handleKeyPress}
									size="sm"
									isDisabled={isSending}
								/>
								<Button
									isIconOnly
									color="primary"
									size="sm"
									onClick={handleSendMessage}
									isLoading={isSending}
									isDisabled={isSending || !inputValue.trim()}
								>
									<Send size={16} />
								</Button>
							</div>
							{errorMessage && (
								<p className="text-xs text-danger-500 mt-2">{errorMessage}</p>
							)}
						</div>
					</CardBody>
				</Card>
			)}

			<div className="w-16 h-16">
				<Button
					isIconOnly
					color="primary"
					className="w-full h-full min-w-16 rounded-full shadow-lg flex flex-col items-center justify-center gap-0 p-0 transition-all duration-300"
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? (
						<X size={24} />
					) : (
						<>
							<MessageCircle size={20} />
							<span className="text-xs font-bold leading-none">AI</span>
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
