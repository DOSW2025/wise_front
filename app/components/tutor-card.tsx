// app/components/tutor-card.tsx

import {
	CalendarDaysIcon,
	ChatBubbleOvalLeftIcon,
	StarIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@heroui/react';
import type React from 'react';
import { Link } from 'react-router-dom';

interface Tutor {
	id: number;
	name: string;
	title: string;
	department: string;
	avatarInitials: string;
	avatarColor: string; // Propiedad para el color del círculo
	rating: number;
	reviews: number;
	tags: string[];
	availability: string;
	isAvailableToday: boolean;
}

interface TutorCardProps {
	tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
	// Color principal de la aplicación (Rojo oscuro de la imagen)
	const primaryColor = '#b81d24';
	const tagBgColor = '#f5e2e3'; // Fondo claro para tags

	return (
		<div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-4 flex flex-col">
			{/* Info Principal */}
			<div className="flex items-start mb-4">
				{/* Avatar: Usa tutor.avatarColor */}
				<div
					className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold`}
					style={{ backgroundColor: tutor.avatarColor || primaryColor }}
				>
					{tutor.avatarInitials}
				</div>

				<div className="ml-4 flex-grow">
					<h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
					<p className="text-sm text-gray-600">{tutor.title}</p>
					{/* Rating */}
					<div className="flex items-center mt-1">
						<StarIcon
							className="w-4 h-4 mr-1"
							style={{ color: primaryColor }}
						/>
						<span
							className="text-sm font-medium"
							style={{ color: primaryColor }}
						>
							{tutor.rating}
						</span>
						<span className="text-xs text-gray-500 ml-1">
							({tutor.reviews})
						</span>
					</div>
				</div>
			</div>

			{/* Tags de Materias */}
			<div className="flex flex-wrap gap-2 mb-4">
				{tutor.tags.map((tag, index) => (
					<span
						key={index}
						className="text-xs px-2 py-1 rounded-full font-medium"
						style={{ backgroundColor: tagBgColor, color: primaryColor }}
					>
						{tag}
					</span>
				))}
			</div>

			{/* Disponibilidad */}
			<p className="text-sm font-medium text-gray-600 mb-4 flex items-center">
				<CalendarDaysIcon className="w-4 h-4 mr-1 text-gray-500" />
				{tutor.availability}
			</p>

			{/* Acciones */}
			<div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
				{/* Botón Ver Perfil */}
				<Button
					as={Link}
					to={`/dashboard/tutor/${tutor.id}`}
					className="flex-grow mr-2"
					style={{
						backgroundColor: primaryColor,
						color: 'white',
						fontWeight: '600',
					}}
				>
					Ver perfil
				</Button>

				{/* ICONO DE MENSAJE */}
				<button
					title="Enviar Mensaje"
					type="button"
					className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
					onClick={() => console.log(`Iniciar chat con ${tutor.name}`)}
				>
					<ChatBubbleOvalLeftIcon className="w-5 h-5 text-gray-500" />
				</button>
			</div>
		</div>
	);
};

export default TutorCard;
