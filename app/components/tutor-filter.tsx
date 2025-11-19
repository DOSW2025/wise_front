// app/components/tutor-filter.tsx

import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/solid';
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
	const [materia, setMateria] = useState('Todos');
	const [calificacion, setCalificacion] = useState('Todas');
	const [disponibilidad, setDisponibilidad] = useState('Cualquiera');

	const handleApply = () => {
		onApplyFilters({ materia, calificacion, disponibilidad });
	};

	const selectClasses =
		'p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-red-700 focus:border-red-700 w-full'; // Añadido w-full
	const primaryColor = '#b81d24';

	return (
		<div>
			{/* Contenedor de "Filtros" y Flecha */}
			<div className="flex items-center space-x-2 mb-4">
				{/* Botón/Etiqueta que contiene el icono de embudo y el texto "Filtros" */}
				<button
					onClick={() => setShowFilters(!showFilters)}
					type="button"
					className="flex items-center text-gray-700 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
					title="Alternar filtros"
				>
					<FunnelIcon
						className="w-5 h-5 mr-2"
						style={{ color: primaryColor }}
					/>
					Filtros
					{/* Icono de Flecha: Controla la visibilidad */}
					<ChevronDownIcon
						className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
					/>
				</button>
			</div>

			{/* Contenedor de Filtros (visible condicionalmente) */}
			{showFilters && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
					{/* Filtro de Materia */}
					<div>
						<label
							htmlFor="materia"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Materia
						</label>
						<div className="relative">
							<select
								id="materia"
								value={materia}
								onChange={(e) => setMateria(e.target.value)}
								onBlur={handleApply} // Aplicar al salir del select
								className={selectClasses}
							>
								<option value="Todos">Todos</option>
								<option value="Matemáticas">Matemáticas</option>
								<option value="Química">Química</option>
							</select>
							<ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
						</div>
					</div>

					{/* Filtro de Calificación */}
					<div>
						<label
							htmlFor="calificacion"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Calificación mínima
						</label>
						<div className="relative">
							<select
								id="calificacion"
								value={calificacion}
								onChange={(e) => setCalificacion(e.target.value)}
								onBlur={handleApply}
								className={selectClasses}
							>
								<option value="Todas">Todas</option>
								<option value="4.0">4.0</option>
								<option value="4.5">4.5</option>
							</select>
							<ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
						</div>
					</div>

					{/* Filtro de Disponibilidad */}
					<div>
						<label
							htmlFor="disponibilidad"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Disponibilidad
						</label>
						<div className="relative">
							<select
								id="disponibilidad"
								value={disponibilidad}
								onChange={(e) => setDisponibilidad(e.target.value)}
								onBlur={handleApply}
								className={`${selectClasses} border-red-700`} // Borde Rojo para resaltar
							>
								<option value="Cualquiera">Cualquiera</option>
								<option value="Hoy">Hoy</option>
								<option value="Mañana">Mañana</option>
							</select>
							<ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TutorFilter;
