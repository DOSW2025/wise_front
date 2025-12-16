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

	// biome-ignore lint/correctness/useExhaustiveDependencies: Need to scroll when messages change
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div className="py-3 md:py-4 px-2 flex flex-col gap-3 md:gap-4 max-w-4xl mx-auto">
			{isLoading ? (
				// Skeleton loader mientras carga
				[1, 2, 3].map((i) => (
					<div
						key={`skeleton-${i}`}
						className={`flex gap-1.5 md:gap-2 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
					>
						{i % 2 === 0 && (
							<div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
						)}
						<div
							className={`px-3 md:px-4 py-2 rounded-2xl bg-gray-200 animate-pulse ${
								i % 2 === 0 ? 'max-w-[70%]' : 'max-w-[60%]'
							}`}
							style={{
								height: i === 2 ? '60px' : '40px',
								width: i === 1 ? '160px' : '200px',
							}}
						/>
						{i % 2 !== 0 && (
							<div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
						)}
					</div>
				))
			) : messages.length === 0 ? (
				<div className="text-center text-gray-400 mt-8 px-4">
					<p className="text-sm md:text-base">No hay mensajes aún</p>
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
						<div className="flex gap-1.5 md:gap-2 items-center text-xs md:text-sm text-gray-500 italic px-2 md:px-3">
							<div className="flex gap-0.5 md:gap-1">
								<span
									className="animate-bounce text-xs md:text-sm"
									style={{ animationDelay: '0ms' }}
								>
									●
								</span>
								<span
									className="animate-bounce text-xs md:text-sm"
									style={{ animationDelay: '150ms' }}
								>
									●
								</span>
								<span
									className="animate-bounce text-xs md:text-sm"
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
