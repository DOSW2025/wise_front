import { useState } from 'react';
import { Outlet } from 'react-router';
import ChatOverlay from './chat/chatOverlay';
import { ChatDropdown } from './chat-dropdown';
import { ChatbotWidget } from './chatbot-widget';
import { NotificationsDropdown } from './notifications-dropdown';
import { Sidebar } from './sidebar';

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

	const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
		undefined,
	);

	const handleOpenChat = (data: {
		id: number;
		name: string;
		title: string;
		avatarInitials: string;
		groupId?: string;
	}) => {
		if (data.groupId) {
			setSelectedGroupId(data.groupId);
			setSelectedTutor({
				id: data.id,
				name: data.name,
				title: data.title,
				avatarInitials: data.avatarInitials,
			});
		} else {
			setSelectedTutor(data);
			setSelectedGroupId(undefined);
		}
	};

	const handleCloseChat = () => {
		setSelectedTutor(null);
		setSelectedGroupId(undefined);
	};

	return (
		<div className="min-h-screen bg-background flex">
			<Sidebar
				userRole={userRole}
				userName={userName}
				userEmail={userEmail}
				userAvatar={userAvatar}
				onLogout={onLogout}
			/>
			<main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8 overflow-y-auto">
				{/* Header con iconos de chat y notificaciones */}
				<div className="flex justify-end items-center mb-6 mr-8">
					<div className="flex items-center gap-6">
						<ChatDropdown onOpenChat={handleOpenChat} />
						<NotificationsDropdown />
					</div>
				</div>

				<Outlet context={{ onOpenChat: handleOpenChat }} />
			</main>

			{/* Chat overlay global */}
			<ChatOverlay
				groupId={selectedGroupId}
				tutor={selectedTutor}
				onClose={handleCloseChat}
			/>

			{/* Chatbot Widget */}
			<ChatbotWidget isChatOpen={!!selectedTutor} />
		</div>
	);
}