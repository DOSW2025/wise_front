import { useEffect, useRef } from 'react';
import MessageItem from './messageItem';

interface Message {
	id: string;
	type: 'text' | 'file';
	content: string;
	name?: string;
	sender: 'student' | 'tutor';
	timestamp: Date;
	userAvatar?: string;
	userName?: string;
	userId?: string;
}

interface MessageListProps {
	messages: Message[];
	tutorName: string;
	typingUsers?: string[];
	isLoading?: boolean;
}

export default function MessageList({
	messages,
	tutorName,
	typingUsers = [],
	isLoading = false,
}: MessageListProps) {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	return (
		<div className="p-4 flex flex-col gap-3">
			{isLoading ? (
				// Skeleton loader mientras carga
				[1, 2, 3].map((i) => (
					<div
						key={`skeleton-${i}`}
						className={`flex gap-2 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
					>
						{i % 2 === 0 && (
							<div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
						)}
						<div
							className={`px-4 py-2 rounded-2xl bg-gray-200 animate-pulse ${
								i % 2 === 0 ? 'max-w-[70%]' : 'max-w-[60%]'
							}`}
							style={{ height: i === 2 ? '60px' : '40px', width: '200px' }}
						/>
						{i % 2 !== 0 && (
							<div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
						)}
					</div>
				))
			) : messages.length === 0 ? (
				<div className="text-center text-gray-400 mt-8">
					<p>No hay mensajes aún</p>
				</div>
			) : (
				<>
					{messages.map((message) => (
						<MessageItem
							key={message.id}
							message={message}
							tutorName={tutorName}
						/>
					))}
					{typingUsers.length > 0 && (
						<div className="flex gap-2 items-center text-sm text-gray-500 italic">
							<div className="flex gap-1">
								<span
									className="animate-bounce"
									style={{ animationDelay: '0ms' }}
								>
									●
								</span>
								<span
									className="animate-bounce"
									style={{ animationDelay: '150ms' }}
								>
									●
								</span>
								<span
									className="animate-bounce"
									style={{ animationDelay: '300ms' }}
								>
									●
								</span>
							</div>
							<span>
								{typingUsers.length === 1
									? 'Alguien está escribiendo...'
									: `${typingUsers.length} personas están escribiendo...`}
							</span>
						</div>
					)}
				</>
			)}
			<div ref={bottomRef} />
		</div>
	);
}
