import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Input,
	useDisclosure,
} from '@heroui/react';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ForumCreationModal } from '~/components/forum-creation-modal';

interface Forum {
	id: string;
	name: string;
	subject: string;
	createdAt: Date;
	members: number;
}

const SUBJECT_COLORS: Record<
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
	biologia: 'success',
	economia: 'primary',
	arte: 'danger',
};

const SUBJECT_NAMES: Record<string, string> = {
	matematicas: 'Matemáticas',
	programacion: 'Programación',
	fisica: 'Física',
	quimica: 'Química',
	ingles: 'Inglés',
	historia: 'Historia',
	literatura: 'Literatura',
	biologia: 'Biología',
	economia: 'Economía',
	arte: 'Arte',
};

export default function TutorCommunity() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [forums, setForums] = useState<Forum[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
	const [creationError, setCreationError] = useState<string | null>(null);

	const allSubjects = ['Todos', ...Object.values(SUBJECT_NAMES)];

	const filteredForums = useMemo(() => {
		return forums.filter((forum) => {
			const matchesSearch =
				forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				SUBJECT_NAMES[forum.subject]
					?.toLowerCase()
					.includes(searchQuery.toLowerCase());

			const matchesSubject =
				!selectedSubject ||
				selectedSubject === 'Todos' ||
				SUBJECT_NAMES[forum.subject] === selectedSubject;

			return matchesSearch && matchesSubject;
		});
	}, [forums, searchQuery, selectedSubject]);

	const handleCreateForum = (data: { name: string; subject: string }) => {
		const newForum: Forum = {
			id: `forum-${Date.now()}`,
			name: data.name,
			subject: data.subject,
			createdAt: new Date(),
			members: 1,
		};
		setForums((prev) => [newForum, ...prev]);
	};

	const handleCreationError = (error: string) => {
		setCreationError(error);
	};

	return (
		<div className="space-y-6">
			{/* Encabezado */}
			<div>
				<h1 className="text-3xl font-bold text-foreground">
					Comunidad ECIWISE+
				</h1>
				<p className="text-default-500 text-sm">
					Conecta, colabora y aprende con otros estudiantes y tutores
				</p>
			</div>

			{/* Sección principal: Foros y Chat */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				{/* Foros de Discusión (2/3 ancho) */}
				<div className="lg:col-span-2 space-y-4">
					{/* Header */}
					<div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
						<div className="bg-primary rounded-lg px-4 py-2 text-white font-semibold">
							Foros de Discusión
						</div>
						<Button
							color="primary"
							size="lg"
							startContent={<Plus className="w-5 h-5" />}
							onPress={onOpen}
							className="font-semibold sm:w-auto"
						>
							Nuevo tema
						</Button>
					</div>{' '}
					{/* Modal */}
					<ForumCreationModal
						isOpen={isOpen}
						onClose={onClose}
						onSubmit={handleCreateForum}
						onError={handleCreationError}
					/>
					{/* Búsqueda */}
					<div className="flex gap-3">
						<Input
							placeholder="Busca en los foros..."
							startContent={<Search className="w-4 h-4 text-default-400" />}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							variant="bordered"
							size="lg"
							isClearable
							onClear={() => setSearchQuery('')}
							classNames={{ input: 'text-base' }}
						/>
					</div>
					{/* Filtros */}
					<div className="flex flex-wrap gap-2">
						{allSubjects.map((subject) => {
							const isSelected = selectedSubject === subject;

							return (
								<Chip
									key={subject}
									onClick={() =>
										setSelectedSubject(isSelected ? null : subject)
									}
									color="primary"
									variant={isSelected ? 'solid' : 'flat'}
									className="cursor-pointer font-medium"
								>
									{subject}
								</Chip>
							);
						})}
					</div>
					{/* Lista de foros */}
					{filteredForums.length === 0 ? (
						<Card className="border border-default-200">
							<CardBody className="py-12 text-center space-y-3">
								<p className="text-4xl">💬</p>
								<h3 className="text-lg font-semibold text-foreground">
									{forums.length === 0 ? 'Aún no hay foros' : 'Sin resultados'}
								</h3>
								<p className="text-default-500 text-sm">
									{forums.length === 0
										? 'Crea el primer foro para comenzar una conversación'
										: 'Intenta otra búsqueda o materia'}
								</p>
							</CardBody>
						</Card>
					) : (
						<div className="space-y-3">
							{filteredForums.map((forum) => {
								const subjectKey =
									Object.entries(SUBJECT_NAMES).find(
										([, label]) => label === SUBJECT_NAMES[forum.subject],
									)?.[0] || forum.subject;

								return (
									<Card
										key={forum.id}
										className="border border-default-200 hover:border-primary transition-colors cursor-pointer"
									>
										<CardBody className="space-y-2">
											{/* Header del foro */}
											<div className="flex items-center gap-2 flex-wrap">
												<Chip
													size="sm"
													variant="flat"
													color="primary"
													className="font-medium"
												>
													Fijado
												</Chip>
												<Chip
													size="sm"
													variant="flat"
													color={SUBJECT_COLORS[subjectKey]}
													className="font-medium"
												>
													{SUBJECT_NAMES[subjectKey]}
												</Chip>
											</div>

											{/* Título */}
											<h3 className="text-lg font-bold text-foreground">
												{forum.name}
											</h3>

											{/* Descripción */}
											<p className="text-default-600 text-sm line-clamp-2">
												Tengo dudas sobre cuando aplicar sustitución
												trigonométrica en integrales. ¿Alguien puede explicar
												los casos más comunes?
											</p>

											{/* Metadata */}
											<div className="flex items-center gap-4 text-xs text-default-500 pt-2 flex-wrap">
												<span>Por María García</span>
												<span>• Hace 5 min</span>
											</div>

											{/* Estadísticas */}
											<div className="flex items-center gap-4 text-sm text-default-600 pt-2 flex-wrap">
												<span>💬 15 respuestas</span>
												<span>👍 23</span>
												<span>👁 234</span>
											</div>
										</CardBody>
									</Card>
								);
							})}
						</div>
					)}
				</div>

				{/* Chat Grupal (1/3 ancho) */}
				<div className="lg:col-span-1">
					<Card className="border border-default-200 sticky top-6">
						<CardHeader className="flex justify-between items-center pb-2">
							<h3 className="text-lg font-bold text-foreground">Chat Grupal</h3>
							<Chip
								color="primary"
								size="sm"
								variant="flat"
								className="font-semibold"
							>
								9
							</Chip>
						</CardHeader>
						<CardBody className="pt-0">
							<p className="text-default-500 text-sm">
								Conecta en tiempo real con otros estudiantes y tutores.
							</p>
							<Button
								color="primary"
								variant="flat"
								size="sm"
								className="mt-4 w-full"
							>
								Abrir chat
							</Button>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
