import {
	MagnifyingGlassIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import {
	BookOpenIcon,
	CalculatorIcon,
	BeakerIcon,
	CodeBracketIcon,
	CpuChipIcon,
	ChartBarIcon,
	LanguageIcon,
	PaintBrushIcon,
	AcademicCapIcon,
	LightBulbIcon,
	RocketLaunchIcon,
	CubeIcon,
} from '@heroicons/react/24/solid';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Input,
} from '@heroui/react';
import { useState } from 'react';
import type { Subject } from '~/lib/types/materias.types';

interface MateriasManagementProps {
	materias: Subject[];
	onDelete: (codigo: string) => void;
	onEdit: (materia: Subject) => void;
	onOpenForm: () => void;
}

// Función para obtener el icono basado en el código o nombre de la materia
const getMateriaIcon = (codigo: string, nombre: string) => {
	const codigoLower = codigo.toLowerCase();
	const nombreLower = nombre.toLowerCase();

	// Matemáticas y Cálculo
	if (
		codigoLower.includes('calc') ||
		codigoLower.includes('mat') ||
		nombreLower.includes('cálculo') ||
		nombreLower.includes('matemática')
	) {
		return <CalculatorIcon className="w-12 h-12" />;
	}

	// Programación y Desarrollo
	if (
		codigoLower.includes('prog') ||
		codigoLower.includes('dosw') ||
		codigoLower.includes('dev') ||
		nombreLower.includes('programación') ||
		nombreLower.includes('desarrollo')
	) {
		return <CodeBracketIcon className="w-12 h-12" />;
	}

	// Química y Ciencias Naturales
	if (
		codigoLower.includes('quim') ||
		codigoLower.includes('fis') ||
		nombreLower.includes('química') ||
		nombreLower.includes('física')
	) {
		return <BeakerIcon className="w-12 h-12" />;
	}

	// Computación y Sistemas
	if (
		codigoLower.includes('comp') ||
		codigoLower.includes('sist') ||
		codigoLower.includes('info') ||
		nombreLower.includes('computación') ||
		nombreLower.includes('sistemas')
	) {
		return <CpuChipIcon className="w-12 h-12" />;
	}

	// Estadística y Análisis de Datos
	if (
		codigoLower.includes('est') ||
		codigoLower.includes('data') ||
		nombreLower.includes('estadística') ||
		nombreLower.includes('datos')
	) {
		return <ChartBarIcon className="w-12 h-12" />;
	}

	// Idiomas
	if (
		codigoLower.includes('ing') ||
		codigoLower.includes('esp') ||
		codigoLower.includes('fra') ||
		nombreLower.includes('inglés') ||
		nombreLower.includes('idioma')
	) {
		return <LanguageIcon className="w-12 h-12" />;
	}

	// Arte y Diseño
	if (
		codigoLower.includes('art') ||
		codigoLower.includes('dis') ||
		nombreLower.includes('arte') ||
		nombreLower.includes('diseño')
	) {
		return <PaintBrushIcon className="w-12 h-12" />;
	}

	// Innovación y Emprendimiento
	if (
		codigoLower.includes('inno') ||
		codigoLower.includes('empr') ||
		nombreLower.includes('innovación') ||
		nombreLower.includes('emprendimiento')
	) {
		return <RocketLaunchIcon className="w-12 h-12" />;
	}

	// Ingeniería
	if (codigoLower.includes('ing') || nombreLower.includes('ingeniería')) {
		return <CubeIcon className="w-12 h-12" />;
	}

	// Investigación
	if (
		codigoLower.includes('inv') ||
		nombreLower.includes('investigación')
	) {
		return <LightBulbIcon className="w-12 h-12" />;
	}

	// Por defecto: ícono académico general
	return <AcademicCapIcon className="w-12 h-12" />;
};

// Función para obtener el color
const getMateriaColor = () => {
	return 'bg-primary';
};

export function MateriasManagement({
	materias,
	onDelete,
	onEdit,
	onOpenForm,
}: MateriasManagementProps) {
	const [searchTerm, setSearchTerm] = useState('');

	const filteredMaterias = materias.filter(
		(materia) =>
			materia.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
			materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="space-y-6">
			{/* Barra de búsqueda y botón */}
			<Card>
				<CardBody>
					<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
						<Input
							placeholder="Buscar por código o nombre..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							startContent={
								<MagnifyingGlassIcon className="w-5 h-5 text-default-400" />
							}
							className="max-w-xs"
						/>
						<Button
							color="primary"
							startContent={<PlusIcon className="w-5 h-5" />}
							onPress={onOpenForm}
						>
							Nueva Materia
						</Button>
					</div>
				</CardBody>
			</Card>

			{/* Grid de materias */}
			{filteredMaterias.length === 0 ? (
				<Card>
					<CardBody>
						<div className="text-center py-12">
							<BookOpenIcon className="w-16 h-16 mx-auto text-default-300 mb-4" />
							<p className="text-default-500">No hay materias registradas</p>
						</div>
					</CardBody>
				</Card>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{filteredMaterias.map((materia) => (
							<Card
								key={materia.codigo}
								className="hover:scale-105 transition-transform duration-200"
								isPressable
								onPress={() => onEdit(materia)}
							>
								<CardHeader
									className={`${getMateriaColor(materia.codigo)} text-white p-6 flex flex-col items-center justify-center gap-2`}
								>
									{getMateriaIcon(materia.codigo, materia.nombre)}
									<h3 className="text-2xl font-bold">{materia.codigo}</h3>
								</CardHeader>
								<CardBody className="p-4">
									<p className="text-center font-semibold text-foreground line-clamp-2 min-h-[3rem]">
										{materia.nombre}
									</p>
								</CardBody>
								<CardFooter className="justify-center gap-2 border-t border-divider">
									<Button
										isIconOnly
										size="sm"
										variant="flat"
										color="warning"
										onPress={(e) => {
											e.stopPropagation();
											onEdit(materia);
										}}
									>
										<PencilIcon className="w-4 h-4" />
									</Button>
									<Button
										isIconOnly
										size="sm"
										variant="flat"
										color="danger"
										onPress={(e) => {
											e.stopPropagation();
											if (
												confirm(
													`¿Estás seguro de eliminar la materia ${materia.codigo}?`,
												)
											) {
												onDelete(materia.codigo);
											}
										}}
									>
										<TrashIcon className="w-4 h-4" />
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>

					<div className="text-sm text-default-500 text-center">
						Mostrando {filteredMaterias.length} de {materias.length} materias
					</div>
				</>
			)}
		</div>
	);
}
