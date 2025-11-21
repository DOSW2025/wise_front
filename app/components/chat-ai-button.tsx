import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	ScrollShadow,
} from '@heroui/react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';

interface ChatMessage {
	id: string;
	text: string;
	sender: 'user' | 'ai';
	timestamp: string;
}

export function ChatAIButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: '1',
			text: '¡Hola! Soy el asistente de ECIWISE+. ¿En qué puedo ayudarte hoy?',
			sender: 'ai',
			timestamp: new Date().toLocaleTimeString('es-ES', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		},
	]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSendMessage = async () => {
		if (!inputValue.trim()) return;

		// Agregar mensaje del usuario
		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			text: inputValue,
			sender: 'user',
			timestamp: new Date().toLocaleTimeString('es-ES', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue('');
		setIsLoading(true);

		// Simular respuesta de IA
		setTimeout(() => {
			const aiMessage: ChatMessage = {
				id: (Date.now() + 1).toString(),
				text: 'Entendido. Estoy procesando tu pregunta. ¿Hay algo más en lo que pueda ayudarte?',
				sender: 'ai',
				timestamp: new Date().toLocaleTimeString('es-ES', {
					hour: '2-digit',
					minute: '2-digit',
				}),
			};
			setMessages((prev) => [...prev, aiMessage]);
			setIsLoading(false);
		}, 1000);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<>
			{/* Botón Flotante */}
			<div className="fixed bottom-6 right-6 z-40">
				{isOpen && (
					<Card className="w-96 shadow-lg border border-default-200">
						<CardHeader className="flex justify-between items-center bg-red-600 text-white rounded-t-lg">
							<div className="flex items-center gap-2">
								<MessageCircle className="w-5 h-5" />
								<span className="font-semibold">Asistente ECIWISE+</span>
							</div>
							<Button
								isIconOnly
								size="sm"
								className="bg-transparent hover:bg-red-700"
								onClick={() => setIsOpen(false)}
								aria-label="Cerrar chat"
							>
								<X className="w-4 h-4" />
							</Button>
						</CardHeader>

						<CardBody className="p-0 flex flex-col h-96">
							{/* Área de mensajes */}
							<ScrollShadow className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
								{messages.map((message) => (
									<div
										key={message.id}
										className={`flex ${
											message.sender === 'user'
												? 'justify-end'
												: 'justify-start'
										}`}
									>
										<div
											className={`max-w-xs px-4 py-2 rounded-lg ${
												message.sender === 'user'
													? 'bg-red-600 text-white rounded-br-none'
													: 'bg-default-100 text-default-900 rounded-bl-none'
											}`}
										>
											<p className="text-sm">{message.text}</p>
											<p
												className={`text-xs mt-1 ${
													message.sender === 'user'
														? 'text-red-200'
														: 'text-default-500'
												}`}
											>
												{message.timestamp}
											</p>
										</div>
									</div>
								))}
								{isLoading && (
									<div className="flex justify-start">
										<div className="bg-default-100 px-4 py-2 rounded-lg rounded-bl-none">
											<div className="flex gap-1">
												<div className="w-2 h-2 bg-default-400 rounded-full animate-bounce" />
												<div className="w-2 h-2 bg-default-400 rounded-full animate-bounce delay-100" />
												<div className="w-2 h-2 bg-default-400 rounded-full animate-bounce delay-200" />
											</div>
										</div>
									</div>
								)}
							</ScrollShadow>

							{/* Área de entrada */}
							<div className="border-t border-default-200 p-3 flex gap-2">
								<Input
									placeholder="Escribe tu pregunta..."
									value={inputValue}
									onValueChange={setInputValue}
									onKeyPress={handleKeyPress}
									disabled={isLoading}
									size="sm"
									className="flex-1"
									classNames={{
										input: 'text-sm',
										inputWrapper: 'h-9',
									}}
								/>
								<Button
									isIconOnly
									size="sm"
									className="bg-red-600 hover:bg-red-700 text-white"
									onClick={handleSendMessage}
									disabled={isLoading || !inputValue.trim()}
									aria-label="Enviar mensaje"
								>
									<Send className="w-4 h-4" />
								</Button>
							</div>
						</CardBody>
					</Card>
				)}

				{/* Botón de Chat */}
				<Button
					isIconOnly
					className={`rounded-full shadow-lg w-14 h-14 ${
						isOpen
							? 'bg-default-200 text-default-600'
							: 'bg-red-600 hover:bg-red-700 text-white'
					}`}
					onClick={() => setIsOpen(!isOpen)}
					aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
				>
					<MessageCircle className="w-6 h-6" />
				</Button>
			</div>
		</>
	);
}
