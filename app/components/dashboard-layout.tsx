import { useState } from 'react';
import { Outlet } from 'react-router';
import ChatOverlay from './chat/chatOverlay';
import { ChatbotWidget } from './chatbot-widget';
import { ChatsPanel } from './chats-panel';
import { NotificationsPanel } from './notifications-panel';
import { Sidebar } from './sidebar';
import { TopNavbar } from './top-navbar';

interface DashboardLayoutProps {
	userRole?: 'student' | 'tutor' | 'admin';
	userName?: string;
	userEmail?: string;
	userAvatar?: string;
	onLogout?: () => void;
}

export function DashboardLayout({
	userRole = 'student',
	userName = 'Usuario',
	userEmail = 'usuario@eci.edu',
	userAvatar,
	onLogout,
}: DashboardLayoutProps) {
	const [selectedTutor, setSelectedTutor] = useState<{
		id: number;
		name: string;
		title: string;
		avatarInitials: string;
	} | null>(null);

	const [isChatsOpen, setIsChatsOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

	return (
		<div className="min-h-screen bg-background flex">
			<Sidebar
				userRole={userRole}
				userName={userName}
				userEmail={userEmail}
				userAvatar={userAvatar}
				onLogout={onLogout}
			/>

			{/* Top Navigation Bar */}
			<TopNavbar
				onOpenChats={() => {
					setIsChatsOpen(true);
					setIsNotificationsOpen(false);
				}}
				onOpenNotifications={() => {
					setIsNotificationsOpen(true);
					setIsChatsOpen(false);
				}}
			/>

			<main className="flex-1 lg:ml-64 p-4 pt-24 lg:pt-28 lg:p-8 overflow-y-auto">
				<Outlet context={{ onOpenChat: setSelectedTutor }} />
			</main>

			{/* Chat overlay global */}
			<ChatOverlay
				tutor={selectedTutor}
				onClose={() => setSelectedTutor(null)}
			/>

			{/* Chats Panel */}
			<ChatsPanel
				isOpen={isChatsOpen}
				onClose={() => setIsChatsOpen(false)}
				onSelectChat={(tutor) => {
					setSelectedTutor(tutor);
					setIsChatsOpen(false);
				}}
			/>

			{/* Notifications Panel */}
			<NotificationsPanel
				isOpen={isNotificationsOpen}
				onClose={() => setIsNotificationsOpen(false)}
			/>

			{/* Chatbot Widget */}
			<ChatbotWidget />
		</div>
	);
}
