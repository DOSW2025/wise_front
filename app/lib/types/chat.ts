export interface ChatMessage {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	timestamp: Date;
	isRead: boolean;
}

export interface ChatConversation {
	id: string;
	participantId: string;
	participantName: string;
	participantAvatar?: string;
	participantRole: 'student' | 'tutor' | 'admin';
	lastMessage: ChatMessage;
	unreadCount: number;
}

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: 'info' | 'success' | 'warning' | 'error';
	timestamp: Date;
	isRead: boolean;
	actionUrl?: string;
}
