import { Avatar } from '@heroui/react';
import { Paperclip } from 'lucide-react';

function fixGoogleAvatarUrl(url: string | undefined): string | undefined {
	if (!url) return undefined;
	if (url.includes('googleusercontent.com')) {
		const baseUrl = url.split('=')[0];
		return `${baseUrl}=s96-c`;
	}
	return url;
}

interface MessageItemProps {
	message: {
		id: string;
		type: 'text' | 'file';
		content: string;
		name?: string;
		sender: 'student' | 'tutor';
		timestamp: Date;
		userAvatar?: string;
		userName?: string;
		userId?: string;
	};
	tutorName: string;
}

export default function MessageItem({ message, tutorName }: MessageItemProps) {
	const isStudent = message.sender === 'student';
	// Solo animar mensajes de otros usuarios (tutor), no animar mensajes propios ni sus reemplazos
	const shouldAnimate = !isStudent;

	const getAvatarProps = () => {
		if (message.userAvatar) {
			const fixedUrl = fixGoogleAvatarUrl(message.userAvatar);
			return {
				src: fixedUrl,
				name: message.userName || tutorName,
				showFallback: true,
				imgProps: {
					referrerPolicy: 'no-referrer' as const,
				},
			};
		}
		return {
			name: (message.userName || tutorName)
				.split(' ')
				.map((n) => n[0])
				.join(''),
			showFallback: true,
		};
	};

	return (
		<div
			className={`flex gap-2 ${isStudent ? 'justify-end' : 'justify-start'} px-2 ${shouldAnimate ? 'opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]' : ''}`}
			style={shouldAnimate ? { animationDelay: '0.05s' } : undefined}
		>
			{!isStudent && (
				<Avatar
					{...getAvatarProps()}
					color="danger"
					size="md"
					className="flex-shrink-0"
				/>
			)}

			<div
				className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'} w-auto min-w-[180px] max-w-[90%]`}
			>
				{/* Burbuja integrada con header */}
				<div
					className={`w-full rounded-2xl overflow-hidden border border-black ${
						isStudent ? 'rounded-tr-none' : 'rounded-tl-none'
					}`}
				>
					{/* Header con nombre del usuario */}
					<div className="px-3 py-0.5 bg-primary">
						<span className="text-xs font-semibold text-white">
							{message.userName || tutorName}
						</span>
					</div>

					{/* Contenido del mensaje */}
					<div className="px-4 py-2.5 bg-gray-50">
						{message.type === 'text' && (
							<p className="text-sm break-words text-black">
								{message.content}
							</p>
						)}

						{message.type === 'file' && (
							<a
								href={message.content}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 underline text-sm text-black"
							>
								<Paperclip className="w-4 h-4" />
								{message.name}
							</a>
						)}

						<span className="text-xs mt-1 block opacity-60 text-black">
							{message.timestamp.toLocaleTimeString('es-ES', {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</span>
					</div>
				</div>
			</div>

			{isStudent && (
				<Avatar
					{...getAvatarProps()}
					color="default"
					size="md"
					className="flex-shrink-0"
				/>
			)}
		</div>
	);
}
