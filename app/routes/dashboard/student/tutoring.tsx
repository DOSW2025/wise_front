import { Card, CardBody, Input } from '@heroui/react';
import { Search } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { PageHeader } from '~/components/page-header';
import TutorCard from '~/components/tutor-card';
import TutorFilter from '~/components/tutor-filter';

interface Tutor {
	id: number;
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
}

interface TutorFilters {
	materia: string;
	calificacion: string;
	disponibilidad: string;
}

// TODO: Conectar con API - Ejemplo con valores negativos para referencia
const mockTutors: Tutor[] = [
	{
		id: 1,
		name: 'Dr. María García',
		title: 'Profesora de Matemáticas',
		department: 'Ciencias Exactas',
		avatarInitials: 'MG',
		avatarColor: '#b81d24',
		rating: 4.9,
		reviews: 127,
		tags: ['Cálculo', 'Álgebra', 'Geometría'],
		availability: 'Lun-Vie 9:00-17:00',
		isAvailableToday: true,
	},
	{
		id: 2,
		name: 'Ing. Carlos Rodríguez',
		title: 'Tutor de Programación',
		department: 'Ingeniería',
		avatarInitials: 'CR',
		avatarColor: '#008000',
		rating: 4.8,
		reviews: 89,
		tags: ['React', 'TypeScript', 'Node.js'],
		availability: 'Mar-Sáb 14:00-20:00',
		isAvailableToday: false,
	},
];

const StudentTutoringPage: React.FC = () => {
	const [tutors] = useState<Tutor[]>(mockTutors);
	const [searchValue, setSearchValue] = useState('');

	// Recibe la función del contexto para abrir el chat
	const { onOpenChat } = useOutletContext<{
		onOpenChat: (tutor: Tutor) => void;
	}>();

	const handleSearch = (_filters: TutorFilters) => {
		// Lógica de filtrado simulada (reemplazar con Axios/Zustand después)
	};

	return (
		<div className="space-y-6 p-4 md:p-6">
			{/* PageHeader */}
			<PageHeader title="Tutorías" description="Panel de Estudiante" />

			{/* Buscador y Filtros */}
			<Card>
				<CardBody className="p-4">
					<div className="mb-4">
						<Input
							type="text"
							placeholder="Buscar por nombre, materia o tema..."
							value={searchValue}
							onValueChange={setSearchValue}
							startContent={<Search className="w-5 h-5 text-default-400" />}
							isClearable
							onClear={() => setSearchValue('')}
							variant="bordered"
							fullWidth
						/>
					</div>
					<TutorFilter onApplyFilters={handleSearch} />
				</CardBody>
			</Card>

			{/* Resultados y Botón Ver Calendario */}
			{/* Resultados */}
			<div className="flex justify-between items-center pt-2 border-t border-default-200">
				<p className="text-default-600">{tutors.length} tutores encontrados</p>
			</div>

			{/* Grid de Tarjetas de Tutores */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{tutors.map((tutor) => (
					<TutorCard key={tutor.id} tutor={tutor} onOpenChat={onOpenChat} />
				))}
			</div>
		</div>
	);
};

export default StudentTutoringPage;
