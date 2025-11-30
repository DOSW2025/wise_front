// app/components/tutor-filter.tsx

import { Button, Select, SelectItem, type Selection } from '@heroui/react';
import { ChevronDown, Filter } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface TutorFilterProps {
	onApplyFilters: (filters: {
		materia: string;
		calificacion: string;
		disponibilidad: string;
	}) => void;
}

const TutorFilter: React.FC<TutorFilterProps> = ({ onApplyFilters }) => {
	const [showFilters, setShowFilters] = useState(false);
	const [materia, setMateria] = useState<Selection>(new Set(['Todos']));
	const [calificacion, setCalificacion] = useState<Selection>(
		new Set(['Todas']),
	);
	const [disponibilidad, setDisponibilidad] = useState<Selection>(
		new Set(['Cualquiera']),
	);

	const handleApply = () => {
		onApplyFilters({
			materia:
				materia === 'all'
					? 'Todos'
					: (Array.from(materia)[0] as string) || 'Todos',
			calificacion:
				calificacion === 'all'
					? 'Todas'
					: (Array.from(calificacion)[0] as string) || 'Todas',
			disponibilidad:
				disponibilidad === 'all'
					? 'Cualquiera'
					: (Array.from(disponibilidad)[0] as string) || 'Cualquiera',
		});
	};

	// Materia options
	const materiaOptions = [
		{ key: 'Todos', label: 'Todos' },
		{ key: 'Matemáticas', label: 'Matemáticas' },
		{ key: 'Química', label: 'Química' },
	];

	// Calificación options
	const calificacionOptions = [
		{ key: 'Todas', label: 'Todas' },
		{ key: '4.0', label: '4.0' },
		{ key: '4.5', label: '4.5' },
	];

	// Disponibilidad options
	const disponibilidadOptions = [
		{ key: 'Cualquiera', label: 'Cualquiera' },
		{ key: 'Hoy', label: 'Hoy' },
		{ key: 'Mañana', label: 'Mañana' },
	];

	return (
		<div>
			{/* Contenedor de "Filtros" y Flecha */}
			<div className="flex items-center space-x-2 mb-4">
				{/* Botón que contiene el icono de embudo y el texto "Filtros" */}
				<Button
					variant="bordered"
					startContent={<Filter className="w-5 h-5" />}
					endContent={
						<ChevronDown
							className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
						/>
					}
					onPress={() => setShowFilters(!showFilters)}
				>
					Filtros
				</Button>
			</div>

			{/* Contenedor de Filtros (visible condicionalmente) */}
			{showFilters && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-default-200 rounded-lg bg-default-50">
					{/* Filtro de Materia */}
					<Select
						label="Materia"
						placeholder="Selecciona una materia"
						selectedKeys={materia}
						onSelectionChange={setMateria}
						onClose={handleApply}
						variant="bordered"
					>
						{materiaOptions.map((item) => (
							<SelectItem key={item.key}>{item.label}</SelectItem>
						))}
					</Select>

					{/* Filtro de Calificación */}
					<Select
						label="Calificación mínima"
						placeholder="Selecciona calificación"
						selectedKeys={calificacion}
						onSelectionChange={setCalificacion}
						onClose={handleApply}
						variant="bordered"
					>
						{calificacionOptions.map((item) => (
							<SelectItem key={item.key}>{item.label}</SelectItem>
						))}
					</Select>

					{/* Filtro de Disponibilidad */}
					<Select
						label="Disponibilidad"
						placeholder="Selecciona disponibilidad"
						selectedKeys={disponibilidad}
						onSelectionChange={setDisponibilidad}
						onClose={handleApply}
						variant="bordered"
						color="primary"
						className="border-primary"
					>
						{disponibilidadOptions.map((item) => (
							<SelectItem key={item.key}>{item.label}</SelectItem>
						))}
					</Select>
				</div>
			)}
		</div>
	);
};

export default TutorFilter;
