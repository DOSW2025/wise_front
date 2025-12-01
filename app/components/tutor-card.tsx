// app/components/tutor-card.tsx

import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react';
import { Calendar, MessageCircle, Star } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router';
import { useChat } from '~/contexts/chat-context';

interface Tutor {
	id: number;
	name: string;
	title: string;
	department: string;
	avatarInitials: string;
	avatarColor?: string; // Optional now, will use semantic colors
	rating: number;
	reviews: number;
	tags: string[];
	availability: string;
	isAvailableToday: boolean;
}

interface TutorCardProps {
	tutor: Tutor;
}

// Map avatar color variants to HeroUI semantic colors
const getAvatarColor = (
	avatarColor?: string,
): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
	// If no specific color provided, use danger (brand red)
	if (!avatarColor) return 'danger';

	// Map common hex colors to semantic colors
	const colorMap: Record<
		string,
		'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
	> = {
		'#b81d24': 'danger', // Red -> danger
		'#ff9900': 'warning', // Orange -> warning
		'#8a2be2': 'secondary', // Purple -> secondary
		'#008000': 'success', // Green -> success
	};

	return colorMap[avatarColor] || 'danger';
};

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
	const { openChatWith } = useChat();

	const handleMessageClick = () => {
		openChatWith(tutor.id.toString(), tutor.name, 'tutor');
	};

	return (
		<Card isHoverable className="border-default-100">
			<CardBody className="p-4 flex flex-col">
				{/* Info Principal */}
				<div className="flex items-start mb-4">
					{/* Avatar with semantic color */}
					<Avatar
						name={tutor.avatarInitials}
						color={getAvatarColor(tutor.avatarColor)}
						className="flex-shrink-0"
						size="lg"
					/>

					<div className="ml-4 flex-grow">
						<h3 className="text-lg font-semibold text-foreground">
							{tutor.name}
						</h3>
						<p className="text-sm text-default-500">{tutor.title}</p>
						{/* Rating */}
						<div className="flex items-center mt-1">
							<Star className="w-4 h-4 mr-1 text-danger fill-danger" />
							<span className="text-sm font-medium text-danger">
								{tutor.rating}
							</span>
							<span className="text-xs text-default-400 ml-1">
								({tutor.reviews})
							</span>
						</div>
					</div>
				</div>

				{/* Tags de Materias using HeroUI Chip */}
				<div className="flex flex-wrap gap-2 mb-4">
					{tutor.tags.map((tag, index) => (
						<Chip key={index} color="danger" variant="flat" size="sm">
							{tag}
						</Chip>
					))}
				</div>

				{/* Disponibilidad */}
				<p className="text-sm font-medium text-default-600 mb-4 flex items-center">
					<Calendar className="w-4 h-4 mr-1 text-default-500" />
					{tutor.availability}
				</p>

				{/* Acciones */}
				<div className="flex justify-between items-center mt-auto pt-2 border-t border-default-100">
					{/* Botón Ver Perfil */}
					<Button
						as={Link}
						to={`/dashboard/tutor/${tutor.id}`}
						color="danger"
						className="flex-grow mr-2 font-semibold"
					>
						Ver perfil
					</Button>

					{/* ICONO DE MENSAJE */}
					<Button
						isIconOnly
						variant="bordered"
						aria-label="Enviar Mensaje"
						onPress={handleMessageClick}
					>
						<MessageCircle className="w-5 h-5" />
					</Button>
				</div>
			</CardBody>
		</Card>
	);
};

export default TutorCard;
