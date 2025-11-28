import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Input,
	useDisclosure,
} from '@heroui/react';
import { Eye, MessageCircle, Plus, Search, ThumbsUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ForumCreationModal } from '~/components/forum-creation-modal';

interface Forum {
	id: string;
	name: string;
	subject: string;
	createdAt: Date;
	members: number;
	replies?: number;
	likes?: number;
	views?: number;
	author?: string;
}

const SUBJECT_COLORS: Record<
	string,
	'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'default'
> = {
	matematicas: 'primary', // Azul - Precisión y lógica
	programacion: 'secondary', // Morado - Creatividad y tecnología
	fisica: 'warning', // Naranja - Energía y movimiento
	quimica: 'danger', // Rojo - Reacciones y transformaciones
	ingles: 'success', // Verde - Crecimiento y comunicación
	historia: 'default', // Gris - Neutralidad y tradición
	literatura: 'secondary', // Morado - Creatividad
	biologia: 'success', // Verde - Naturaleza y vida
	economia: 'warning', // Naranja - Transacciones
	arte: 'secondary', // Morado - Creatividad
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

export default function StudentCommunity() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [forums, setForums] = useState<Forum[]>([
		{
			id: 'forum-1',
			name: 'Dudas de Cálculo ',
			subject: 'matematicas',
			createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
			members: 12,
			replies: 9,
			likes: 14,
			views: 156,
			author: 'María García',
		},
		{
			id: 'forum-2',
			name: 'Ayuda con React Hooks',
			subject: 'programacion',
			createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
			members: 8,
			replies: 5,
			likes: 23,
			views: 89,
			author: 'Carlos López',
		},
		{
			id: 'forum-3',
			name: 'Leyes de Newton y Movimiento',
			subject: 'fisica',
			createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
			members: 5,
			replies: 3,
			likes: 7,
			views: 42,
			author: 'Juan Pérez',
		},
	]);
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
		setCreationError(null);
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
									color={isSelected ? 'primary' : 'default'}
									variant="bordered"
									className={`cursor-pointer font-medium transition-colors ${
										isSelected
											? 'border-primary text-primary bg-primary-50'
											: 'border-default-300 text-default-700 hover:border-primary hover:text-primary'
									}`}
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
													variant="solid"
													color={SUBJECT_COLORS[forum.subject]}
													className="font-heading font-semibold"
												>
													{SUBJECT_NAMES[forum.subject]}
												</Chip>
											</div>{' '}
											{/* Título */}
											<h3 className="text-lg font-bold text-foreground">
												{forum.name}
											</h3>
											{/* Descripción */}
											<p className="text-default-600 text-sm line-clamp-2">
												{forum.id === 'forum-1'
													? 'Tengo dudas sobre cuándo aplicar sustitución trigonométrica en integrales. ¿Alguien puede explicar los casos más comunes?'
													: forum.id === 'forum-2'
														? 'Necesito entender mejor cómo funcionan los hooks como useState y useEffect. ¿Cuál es la diferencia?'
														: 'Ayuda para comprender las leyes de movimiento y cómo aplicarlas en problemas'}
											</p>
											{/* Metadata */}
											<div className="flex items-center gap-4 text-xs text-default-500 pt-2 flex-wrap">
												<span>Por {forum.author}</span>
												<span>•</span>
												<span>
													{Math.floor(
														(Date.now() - forum.createdAt.getTime()) /
															(1000 * 60 * 60),
													) < 24
														? `Hace ${Math.floor((Date.now() - forum.createdAt.getTime()) / (1000 * 60 * 60))} horas`
														: `Hace ${Math.floor((Date.now() - forum.createdAt.getTime()) / (1000 * 60 * 60 * 24))} días`}
												</span>
											</div>
											{/* Estadísticas */}
											<div className="flex items-center gap-3 pt-3 flex-wrap">
												<Chip
													startContent={
														<MessageCircle className="w-3.5 h-3.5" />
													}
													variant="flat"
													size="sm"
													className="text-xs"
												>
													{forum.replies} respuestas
												</Chip>
												<Chip
													startContent={<ThumbsUp className="w-3.5 h-3.5" />}
													variant="flat"
													color="success"
													size="sm"
													className="text-xs"
												>
													{forum.likes} votos
												</Chip>
												<Chip
													startContent={<Eye className="w-3.5 h-3.5" />}
													variant="flat"
													color="default"
													size="sm"
													className="text-xs"
												>
													{forum.views} vistas
												</Chip>
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
