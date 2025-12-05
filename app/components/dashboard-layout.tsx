import { useState } from 'react';
import { Outlet } from 'react-router';
import { ChatbotWidget } from './chatbot-widget';
import { Sidebar } from './sidebar';
import ChatOverlay from './chat/chatOverlay'; // ← Importa el chat

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
				{/* ← AGREGA ESTO: Pasa setSelectedTutor al contexto */}
				<Outlet context={{ onOpenChat: setSelectedTutor }} />
			</main>

			{/* ← AGREGA ESTO: Chat overlay global */}
			<ChatOverlay
				tutor={selectedTutor}
				onClose={() => setSelectedTutor(null)}
			/>
		</div>
	);
}