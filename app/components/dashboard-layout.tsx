import { Outlet } from 'react-router';
import { ChatAIButton } from './chat-ai-button';
import { NotificationsButton } from './notifications-button';
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
				{/* Top-right notifications button */}
				<div className="fixed top-4 right-4 z-30 lg:top-8 lg:right-8">
					<NotificationsButton />
				</div>
				<Outlet />
			</main>
			{/* Floating chat button */}
			<ChatAIButton />
		</div>
	);
}
