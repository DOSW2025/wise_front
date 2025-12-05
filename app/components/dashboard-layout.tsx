import { Button } from '@heroui/react';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router';
import ChatOverlay from './chat/chatOverlay';
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
	// ← AGREGA ESTO: Estado para el chat
	const [selectedTutor, setSelectedTutor] = useState<{
		id: number;
		name: string;
		title: string;
		avatarInitials: string;
	} | null>(null);

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
						<Button isIconOnly variant="light" size="md" className="relative">
							<MessageSquare className="w-6 h-6" />
							<span className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-white"></span>
						</Button>
						<NotificationsDropdown />
					</div>
				</div>

				<Outlet context={{ onOpenChat: setSelectedTutor }} />
			</main>

			{/* Chat overlay global */}
			<ChatOverlay
				tutor={selectedTutor}
				onClose={() => setSelectedTutor(null)}
			/>

			{/* Chatbot Widget */}
			<ChatbotWidget />
		</div>
	);
}
