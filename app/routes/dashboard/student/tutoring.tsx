// routes/dashboard/student/tutoring.tsx

import { Button, Card, CardBody, Input } from '@heroui/react';
import { Calendar, Search } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
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

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	const paginatedTutors = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return tutors.slice(start, end);
	}, [tutors, currentPage]);

	const totalPages = Math.ceil(tutors.length / itemsPerPage);

	useEffect(() => {
		setCurrentPage(1);
	}, []);

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
					color="primary"
					startContent={<Calendar className="w-5 h-5" />}
				>
					Ver calendario
				</Button>
			</div>

			{/* Grid de Tarjetas de Tutores */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{paginatedTutors.map((tutor) => (
					<TutorCard key={tutor.id} tutor={tutor} />
				))}
			</div>

			{/* Paginación (mostrar solo si hay más de una página) */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between mt-4">
					<p className="text-sm text-default-600">
						Mostrando{' '}
						{Math.min((currentPage - 1) * itemsPerPage + 1, tutors.length)} -{' '}
						{Math.min(currentPage * itemsPerPage, tutors.length)} de{' '}
						{tutors.length}
					</p>
					<div className="flex items-center space-x-2">
						<Button
							variant="light"
							disabled={currentPage === 1}
							onPress={() => setCurrentPage(currentPage - 1)}
						>
							Anterior
						</Button>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Button
								key={page}
								variant={page === currentPage ? 'solid' : 'light'}
								color={page === currentPage ? 'primary' : 'default'}
								onPress={() => setCurrentPage(page)}
							>
								{page}
							</Button>
						))}
						<Button
							variant="light"
							disabled={currentPage === totalPages}
							onPress={() => setCurrentPage(currentPage + 1)}
						>
							Siguiente
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default StudentTutoringPage;
