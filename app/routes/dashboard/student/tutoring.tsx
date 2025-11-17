// routes/dashboard/student/tutoring.tsx

import { CalendarIcon } from '@heroicons/react/24/solid'; // UsersIcon ya no es necesario
import type React from 'react';
import { useState } from 'react';
import { PageHeader } from '~/components/page-header';
import TutorCard from '~/components/tutor-card';
import TutorFilter from '~/components/tutor-filter';

// Asumiendo que Card y CardBody son componentes de tu librería UI
// import { Card, CardBody } from '@heroui/react'; // No son necesarios aquí

// Tipo de dato para un tutor (Esquema)
interface Tutor {
	id: number;
	name: string;
	title: string;
	department: string;
	avatarInitials: string;
	avatarColor: string;
	rating: number;
	reviews: number;
	tags: string[];
	availability: string;
	isAvailableToday: boolean;
}

// TIPO DE DATOS PARA FILTROS (Reemplaza el 'any')
interface TutorFilters {
	materia: string;
	calificacion: string;
	disponibilidad: string;
}

// Datos de ejemplo
const mockTutors: Tutor[] = [
	{
		id: 1,
		name: 'Dr. Carlos Méndez',
		title: 'Profesor de Matemáticas',
		department: 'Cálculo Diferencial, Álgebra Lineal, Ecuaciones Diferenciales',
		avatarInitials: 'DC',
		avatarColor: '#b81d24',
		rating: 4.5,
		reviews: 127,
		tags: ['Cálculo Diferencial', 'Álgebra Lineal', 'Ecuaciones Diferenciales'],
		availability: 'Disponible hoy',
		isAvailableToday: true,
	},
	{
		id: 2,
		name: 'Ing. Ana López',
		title: 'Ingeniera en Software',
		department: 'Python, JavaScript, Estructuras de Datos',
		avatarInitials: 'IA',
		avatarColor: '#ff9900',
		rating: 4.8,
		reviews: 95,
		tags: ['Python', 'JavaScript', 'Estructuras de Datos'],
		availability: 'Disponible mañana',
		isAvailableToday: false,
	},
	// Añade más tutores para simular la vista
	{
		id: 3,
		name: 'Dr. Roberto Sánchez',
		title: 'Profesor de Física',
		department: 'Mecánica Clásica, Termodinámica, Electromagnetismo',
		avatarInitials: 'DR',
		avatarColor: '#8a2be2',
		rating: 4.7,
		reviews: 83,
		tags: ['Mecánica Clásica', 'Termodinámica', 'Electromagnetismo'],
		availability: 'Disponible esta semana',
		isAvailableToday: false,
	},
	{
		id: 4,
		name: 'Prof. María García',
		title: 'Profesora de Química',
		department: 'Química Orgánica, Bioquímica',
		avatarInitials: 'PM',
		avatarColor: '#008000',
		rating: 4.9,
		reviews: 142,
		tags: ['Química Orgánica', 'Química Inorgánica', 'Bioquímica'],
		availability: 'Disponible hoy',
		isAvailableToday: true,
	},
];

const StudentTutoringPage: React.FC = () => {
	// Corrección Biome: tutors se usa para simular la respuesta
	const [tutors] = useState<Tutor[]>(mockTutors);

	// Corrección Biome: 'filters' ahora usa el tipo 'TutorFilters'
	const handleSearch = (filters: TutorFilters) => {
		console.log('Filtros aplicados:', filters);
		// Lógica de filtrado simulada (reemplazar con Axios/Zustand después)
		// Por ahora, solo simula que la búsqueda ocurre
		// setTutors(filteredList);
	};

	return (
		<div className="space-y-6 p-4 md:p-6">
			{/* PageHeader usado para evitar error de unused import */}
			<PageHeader title="Tutorías" description="Panel de Estudiante" />

			{/* Buscador y Filtros */}
			<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
				<div className="flex items-center space-x-2 mb-4">
					<input
						type="text"
						placeholder="Buscar por nombre, materia o tema..."
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primaryblue focus:border-primaryblue"
					/>
				</div>
				<TutorFilter onApplyFilters={handleSearch} />
			</div>

			{/* Resultados y Botón Ver Calendario */}
			<div className="flex justify-between items-center pt-2 border-t">
				<p className="text-gray-600">{tutors.length} tutores encontrados</p>
				{/* CORRECCIÓN Biome: Añadir type="button" */}
				<button
					type="button" // CORRECCIÓN APLICADA
					className="flex items-center text-red-700 font-medium hover:text-red-800"
				>
					<CalendarIcon className="w-5 h-5 mr-1" />
					Ver calendario
				</button>
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
