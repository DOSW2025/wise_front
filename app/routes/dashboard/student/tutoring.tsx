// routes/dashboard/student/tutoring.tsx

import { Button, Card, CardBody, Input } from '@heroui/react';
import { Calendar, Search } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { PageHeader } from '~/components/page-header';
import TutorCard from '~/components/tutor-card';
import TutorFilter from '~/components/tutor-filter';

// Tipo de dato para un tutor (Esquema)
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

// TIPO DE DATOS PARA FILTROS
interface TutorFilters {
	materia: string;
	calificacion: string;
	disponibilidad: string;
}

// TODO: Conectar con API - Ejemplo con valores negativos para referencia
const mockTutors: Tutor[] = [
	{
		id: -1,
		name: 'Tutor Ejemplo (Sin conexión)',
		title: 'Sin datos de API',
		department: 'Esperando conexión con backend',
		avatarInitials: 'XX',
		avatarColor: '#b81d24',
		rating: -1,
		reviews: -1,
		tags: ['Sin datos'],
		availability: 'No disponible',
		isAvailableToday: false,
	},
];

const StudentTutoringPage: React.FC = () => {
	const [tutors] = useState<Tutor[]>(mockTutors);
	const [searchValue, setSearchValue] = useState('');

	// Filtros aplicados
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
			<div className="flex justify-between items-center pt-2 border-t border-default-200">
				<p className="text-default-600">{tutors.length} tutores encontrados</p>
				<Button
					variant="light"
					color="danger"
					startContent={<Calendar className="w-5 h-5" />}
				>
					Ver calendario
				</Button>
			</div>

			{/* Grid de Tarjetas de Tutores */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{tutors.map((tutor) => (
					<TutorCard key={tutor.id} tutor={tutor} />
				))}
			</div>
		</div>
	);
};

export default StudentTutoringPage;
