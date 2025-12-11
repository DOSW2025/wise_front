import { Calendar, MessageCircle, Star } from 'lucide-react';
import type React from 'react';
import type { TutorProfile } from '~/lib/types/tutoria.types';

interface Tutor {
	id: number;
	tutorId: string;
	name: string;
	title: string;
	department: string;
	avatarInitials: string;
	avatarColor?: string;
	rating: number;
	reviews: number;
	tags: string[];
	availability: string;
	isAvailableToday: boolean;
	timeSlots?: string[];
	disponibilidad?: TutorProfile['disponibilidad'];
}

interface TutorCardProps {
	tutor: Tutor;
	onOpenChat?: (tutor: Tutor) => void;
	onOpen?: (tutor: Tutor) => void;
	onViewProfile?: (tutorId: string) => void;
}

const getAvatarBg = (avatarColor?: string): string => {
	if (!avatarColor) return 'bg-red-500';

	const colorMap: Record<string, string> = {
		'#b81d24': 'bg-red-500',
		'#ff9900': 'bg-orange-500',
		'#8a2be2': 'bg-purple-500',
		'#008000': 'bg-green-500',
	};

	return colorMap[avatarColor] || 'bg-red-500';
};

const TutorCard: React.FC<TutorCardProps> = ({
	tutor,
	onOpenChat,
	onOpen,
	onViewProfile,
}) => {
	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') onOpen?.(tutor);
	};

	return (
		<div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
			<div className="p-4 flex flex-col">
				{/* Info principal (click to open) */}
				<button
					type="button"
					onClick={() => onOpen?.(tutor)}
					onKeyDown={handleKey}
					className="flex items-start mb-4 w-full text-left focus:outline-none"
				>
					<div
						className={`${getAvatarBg(tutor.avatarColor)} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
					>
						{tutor.avatarInitials}
					</div>

					<div className="ml-4 flex-grow">
						<h3 className="text-lg font-semibold text-gray-800">
							{tutor.name}
						</h3>
						<p className="text-sm text-gray-600">{tutor.title}</p>

						<div className="flex items-center mt-1">
							<Star className="w-4 h-4 mr-1 text-red-700 fill-red-700" />
							<span className="text-sm font-medium text-red-700">
								{tutor.rating}
							</span>
							<span className="text-xs text-gray-400 ml-1">
								({tutor.reviews})
							</span>
						</div>
					</div>
				</button>

				{/* Tags */}
				<div className="flex flex-wrap gap-2 mb-4">
					{tutor.tags.map((tag) => (
						<span
							key={tag}
							className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
						>
							{tag}
						</span>
					))}
				</div>

				{/* Disponibilidad */}
				<p className="text-sm font-medium text-gray-600 mb-4 flex items-center">
					<Calendar className="w-4 h-4 mr-2 text-gray-500" />
					{tutor.availability}
				</p>

				{/* Acciones */}
				<div className="flex gap-2 mt-auto pt-2 border-t border-gray-200">
					<button
						type="button"
						onClick={() => onViewProfile?.(tutor.id.toString())}
						className="flex-grow bg-red-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center"
					>
						Ver perfil
					</button>

					<button
						type="button"
						onClick={() => onOpenChat?.(tutor)}
						className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
						aria-label="Enviar Mensaje"
					>
						<MessageCircle className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default TutorCard;
