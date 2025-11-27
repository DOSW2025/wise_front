import {
	Button,
	Card,
	CardBody,
	CardHeader,
	useDisclosure,
} from '@heroui/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ForumCreationModal } from '~/components/forum-creation-modal';

interface Forum {
	id: string;
	name: string;
	subject: string;
	createdAt: Date;
	members: number;
}

export default function StudentCommunity() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [forums, setForums] = useState<Forum[]>([]);

	// Mapeo de materias a colores semánticos
	const subjectColorMap: Record<
		string,
		'primary' | 'success' | 'warning' | 'danger'
	> = {
		matematicas: 'primary',
		programacion: 'success',
		fisica: 'warning',
		quimica: 'danger',
		ingles: 'primary',
		historia: 'success',
		literatura: 'warning',
	};

	// Mapeo de materias a nombres legibles
	const subjectNameMap: Record<string, string> = {
		matematicas: 'Matemáticas',
		programacion: 'Programación',
		fisica: 'Física',
		quimica: 'Química',
		ingles: 'Inglés',
		historia: 'Historia',
		literatura: 'Literatura',
	};

	const handleCreateForum = (data: { name: string; subject: string }) => {
		const newForum: Forum = {
			id: `forum-${Date.now()}`,
			name: data.name,
			subject: data.subject,
			createdAt: new Date(),
			members: 1, // El creador es miembro automáticamente
		};

		setForums((prev) => [newForum, ...prev]);
	};

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold text-foreground">
						Comunidad ECIWISE+
					</h1>
					<p className="text-default-500">
						Conecta con otros estudiantes y tutores, comparte conocimiento
					</p>
				</div>

				{/* Botón Nuevo Foro */}
				<Button
					color="primary"
					size="lg"
					startContent={<Plus className="w-5 h-5" />}
					onPress={onOpen}
					className="font-semibold"
				>
					Nuevo Foro
				</Button>
			</div>

			{/* Modal de Creación */}
			<ForumCreationModal
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={handleCreateForum}
			/>

			{/* Lista de Foros */}
			{forums.length === 0 ? (
				<Card className="border border-default-200 bg-gradient-to-br from-default-50 to-default-100">
					<CardBody className="py-12 text-center space-y-4">
						<div className="text-4xl">💬</div>
						<h3 className="text-lg font-semibold text-foreground">
							Aún no hay foros creados
						</h3>
						<p className="text-default-500 max-w-md">
							Sé el primero en crear un foro temático. Haz clic en el botón
							"Nuevo Foro" para comenzar una conversación sobre tu materia
							favorita.
						</p>
						<Button
							color="primary"
							variant="flat"
							startContent={<Plus className="w-4 h-4" />}
							onPress={onOpen}
							className="mt-2 self-center"
						>
							Crear primer foro
						</Button>
					</CardBody>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{forums.map((forum) => (
						<Card
							key={forum.id}
							className="border border-default-200 hover:shadow-md transition-shadow cursor-pointer"
						>
							<CardHeader className="flex flex-col items-start gap-2">
								<div className="flex items-center justify-between w-full">
									<h3 className="text-lg font-bold text-foreground">
										{forum.name}
									</h3>
									<span
										className={`text-xs px-3 py-1 rounded-full font-medium ${
											subjectColorMap[forum.subject] === 'primary'
												? 'bg-primary-100 text-primary-700'
												: subjectColorMap[forum.subject] === 'success'
													? 'bg-success-100 text-success-700'
													: subjectColorMap[forum.subject] === 'warning'
														? 'bg-warning-100 text-warning-700'
														: 'bg-danger-100 text-danger-700'
										}`}
									>
										{subjectNameMap[forum.subject]}
									</span>
								</div>
								<p className="text-sm text-default-500">
									Creado {forum.createdAt.toLocaleDateString('es-ES')}
								</p>
							</CardHeader>
							<CardBody className="pt-0">
								<p className="text-sm text-default-600">
									👥 {forum.members} miembro{forum.members !== 1 ? 's' : ''}
								</p>
							</CardBody>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
