import { Card, CardBody } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MateriaForm, MateriasManagement } from '~/components/admin/materias';
import { materiasApi } from '~/lib/api/materias';
import type { CreateSubjectDto, Subject } from '~/lib/types/materias.types';

export default function AdminMaterias() {
	const [materias, setMaterias] = useState<Subject[]>([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingMateria, setEditingMateria] = useState<Subject | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const loadMaterias = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await materiasApi.getAll();
			setMaterias(data);
		} catch (error) {
			console.error('Error al cargar materias:', error);
			toast.error('Error al cargar las materias');
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Cargar materias al montar el componente
	useEffect(() => {
		loadMaterias();
	}, [loadMaterias]);

	const handleAddMateria = async (data: CreateSubjectDto) => {
		try {
			const newMateria = await materiasApi.create(data);
			setMaterias([...materias, newMateria]);
			toast.success(`Materia ${data.codigo} creada exitosamente`);
			setIsFormOpen(false);
		} catch (error: unknown) {
			console.error('Error al crear materia:', error);
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || 'Error al crear la materia';
			toast.error(errorMessage);
		}
	};

	const handleUpdateMateria = async (
		codigo: string,
		data: { nombre: string },
	) => {
		try {
			const updatedMateria = await materiasApi.update(codigo, data);
			setMaterias(
				materias.map((m) => (m.codigo === codigo ? updatedMateria : m)),
			);
			toast.success(`Materia ${codigo} actualizada exitosamente`);
			setEditingMateria(null);
			setIsFormOpen(false);
		} catch (error: unknown) {
			console.error('Error al actualizar materia:', error);
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || 'Error al actualizar la materia';
			toast.error(errorMessage);
		}
	};

	const handleDeleteMateria = async (codigo: string) => {
		try {
			await materiasApi.delete(codigo);
			setMaterias(materias.filter((m) => m.codigo !== codigo));
			toast.success(`Materia ${codigo} eliminada exitosamente`);
		} catch (error: unknown) {
			console.error('Error al eliminar materia:', error);
			const errorMessage =
				(error as { response?: { data?: { message?: string } } })?.response
					?.data?.message || 'Error al eliminar la materia';
			toast.error(errorMessage);
		}
	};

	const handleOpenForm = () => {
		setEditingMateria(null);
		setIsFormOpen(true);
	};

	const handleEditMateria = (materia: Subject) => {
		setEditingMateria(materia);
		setIsFormOpen(true);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Gestión de Materias
				</h1>
				<p className="text-default-500">
					Administra las materias disponibles en la plataforma
				</p>
			</div>

			{/* Info Card */}
			<Card className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
				<CardBody className="p-4">
					<h4 className="font-semibold text-primary mb-2">
						Gestión de Materias
					</h4>
					<p className="text-sm text-default-600">
						Desde esta sección puedes crear, editar y eliminar las materias
						disponibles en el sistema. Las materias son utilizadas por los
						tutores para ofrecer sus servicios.
					</p>
				</CardBody>
			</Card>

			{/* Materias Management */}
			{isLoading ? (
				<Card>
					<CardBody>
						<div className="text-center py-8">
							<p className="text-default-500">Cargando materias...</p>
						</div>
					</CardBody>
				</Card>
			) : (
				<MateriasManagement
					materias={materias}
					onDelete={handleDeleteMateria}
					onEdit={handleEditMateria}
					onOpenForm={handleOpenForm}
				/>
			)}

			{/* Form Modal */}
			<MateriaForm
				isOpen={isFormOpen}
				onClose={() => {
					setIsFormOpen(false);
					setEditingMateria(null);
				}}
				onSubmit={(data) => {
					if (editingMateria) {
						handleUpdateMateria(editingMateria.codigo, { nombre: data.nombre });
					} else {
						handleAddMateria(data);
					}
				}}
				editingMateria={editingMateria}
			/>
		</div>
	);
}
