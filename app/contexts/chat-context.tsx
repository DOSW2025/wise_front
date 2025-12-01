import { createContext, type ReactNode, useContext, useState } from 'react';

interface ChatMessage {
	id: string;
	senderId: string;
	content: string;
	timestamp: Date;
	isRead: boolean;
}

interface ChatConversation {
	id: string;
	participantId: string;
	participantName: string;
	participantAvatar?: string;
	participantRole: 'student' | 'tutor' | 'admin';
	lastMessage: ChatMessage;
	unreadCount: number;
}

interface ChatContextType {
	openChatWith: (
		tutorId: string,
		tutorName: string,
		tutorRole?: 'tutor',
	) => void;
	selectedConversation: string | null;
	setSelectedConversation: (id: string | null) => void;
	conversationData: { [key: string]: { name: string; role: string } };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
	const [selectedConversation, setSelectedConversation] = useState<
		string | null
	>(null);
	const [conversationData, setConversationData] = useState<{
		[key: string]: { name: string; role: string };
	}>({});

	const openChatWith = (
		tutorId: string,
		tutorName: string,
		tutorRole: 'tutor' = 'tutor',
	) => {
		// Crear o encontrar conversación existente
		const conversationId = `chat-${tutorId}`;

		// Guardar datos de la conversación
		setConversationData((prev) => ({
			...prev,
			[conversationId]: { name: tutorName, role: tutorRole },
		}));

		setSelectedConversation(conversationId);
	};

	return (
		<ChatContext.Provider
			value={{
				openChatWith,
				selectedConversation,
				setSelectedConversation,
				conversationData,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

export function useChat() {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error('useChat must be used within a ChatProvider');
	}
	return context;
}
