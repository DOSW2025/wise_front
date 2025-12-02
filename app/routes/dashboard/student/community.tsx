import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Input,
	Tab,
	Tabs,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import {
	CheckCircle2,
	Eye,
	MessageCircle,
	Pin,
	Plus,
	Search,
	ThumbsUp,
} from 'lucide-react';
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
	isPinned?: boolean;
	isResolved?: boolean;
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
	const [selectedForumId, setSelectedForumId] = useState<string | null>(null);
	const [replyType, setReplyType] = useState<'text' | 'image' | 'link'>('text');
	const [textReply, setTextReply] = useState('');
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [linkUrl, setLinkUrl] = useState('');
	const [replyErrors, setReplyErrors] = useState<{
		text?: string;
		image?: string;
		link?: string;
	}>({});
	const [forums, setForums] = useState<Forum[]>([
		{
			id: 'forum-1',
			name: '¿Cómo resolver integrales por sustitución trigonométrica?',
			subject: 'matematicas',
			createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
			members: 12,
			replies: 15,
			likes: 23,
			views: 234,
			author: 'María García',
			isPinned: true,
			isResolved: false,
		},
		{
			id: 'forum-2',
			name: 'Mejores prácticas para estructuras de datos en Python',
			subject: 'programacion',
			createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
			members: 8,
			replies: 28,
			likes: 45,
			views: 567,
			author: 'Carlos Méndez',
			isPinned: false,
			isResolved: true,
		},
		{
			id: 'forum-3',
			name: 'Duda sobre la segunda ley de Newton',
			subject: 'fisica',
			createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás
			members: 5,
			replies: 12,
			likes: 18,
			views: 189,
			author: 'Laura Martínez',
			isPinned: false,
			isResolved: false,
		},
		{
			id: 'forum-4',
			name: 'Reacciones de oxidación-reducción',
			subject: 'quimica',
			createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
			members: 6,
			replies: 9,
			likes: 14,
			views: 156,
			author: 'Roberto Sánchez',
			isPinned: false,
			isResolved: false,
		},
	]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
	const [_creationError, setCreationError] = useState<string | null>(null);

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
			replies: 0,
			likes: 0,
			views: 1,
			author: 'Tú',
			isPinned: false,
			isResolved: false,
		};
		setForums((prev) => [newForum, ...prev]);
		setCreationError(null);
	};

	const handleCreationError = (error: string) => {
		setCreationError(error);
	};

	const validateLink = (url: string) => {
		const pattern =
			/^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/i;
		return pattern.test(url.trim());
	};

	const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setImageFile(file);
		setReplyErrors((prev) => ({ ...prev, image: '' }));
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		} else {
			setImagePreview(null);
		}
	};

	const canSubmitReply = () => {
		if (!selectedForumId) return false;
		if (replyType === 'text') return textReply.trim().length >= 1;
		if (replyType === 'image') return !!imageFile;
		if (replyType === 'link') return validateLink(linkUrl);
		return false;
	};

	const handleSubmitReply = () => {
		const newErrors: { text?: string; image?: string; link?: string } = {};
		if (replyType === 'text' && textReply.trim().length < 1)
			newErrors.text = 'Escribe un mensaje';
		if (replyType === 'image' && !imageFile)
			newErrors.image = 'Selecciona una imagen';
		if (replyType === 'link' && !validateLink(linkUrl))
			newErrors.link = 'Ingresa una URL válida (http/https)';
		setReplyErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		const payload =
			replyType === 'text'
				? { type: 'text', text: textReply.trim(), forumId: selectedForumId }
				: replyType === 'image'
					? { type: 'image', name: imageFile?.name, forumId: selectedForumId }
					: { type: 'link', url: linkUrl.trim(), forumId: selectedForumId };
		console.log('Demo reply payload:', payload);
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
										className={`border border-default-200 transition-colors cursor-pointer ${selectedForumId === forum.id ? 'border-primary' : 'hover:border-primary'}`}
										onClick={() => setSelectedForumId(forum.id)}
									>
										<CardBody className="space-y-3 py-4">
											{/* Header del foro - Badges */}
											<div className="flex items-center gap-2 flex-wrap">
												{forum.isPinned && (
													<div className="flex items-center gap-1.5 text-danger-500">
														<Pin className="w-4 h-4" />
														<span className="text-xs font-medium">Fijado</span>
													</div>
												)}
												{forum.isResolved && (
													<div className="flex items-center gap-1.5 text-success-600">
														<CheckCircle2 className="w-4 h-4" />
														<span className="text-xs font-medium">
															Resuelto
														</span>
													</div>
												)}
												{selectedForumId === forum.id && (
													<Chip
														size="sm"
														color="primary"
														variant="flat"
														className="font-heading text-xs"
													>
														Seleccionado
													</Chip>
												)}
												<Chip
													size="sm"
													variant="flat"
													color={SUBJECT_COLORS[forum.subject]}
													className="font-heading text-xs"
												>
													{SUBJECT_NAMES[forum.subject]}
												</Chip>
											</div>
											{/* Título */}
											<h3 className="text-base font-bold text-foreground leading-tight">
												{forum.name}
											</h3>
											{/* Descripción */}
											<p className="text-default-600 text-sm line-clamp-2">
												{forum.id === 'forum-1'
													? 'Tengo dudas sobre cuándo aplicar sustitución trigonométrica en integrales. ¿Alguien puede explicar los casos más comunes?'
													: forum.id === 'forum-2'
														? '¿Qué estructura de datos recomiendan usar para implementar un sistema de caché? Estoy considerando usar diccionarios pero me gustaría conocer otras opciones.'
														: forum.id === 'forum-3'
															? 'En problemas con fricción, ¿cómo identifico correctamente todas las fuerzas que actúan sobre un cuerpo?'
															: '¿Alguien tiene tips para balancear ecuaciones redox más fácilmente? Siempre me confundo con los números de oxidación.'}
											</p>
											{/* Metadata - Autor y Tiempo */}
											<div className="flex items-center gap-3 text-xs text-default-500">
												<span>Por {forum.author}</span>
												<span>•</span>
												<span>
													{(() => {
														const minutes = Math.floor(
															(Date.now() - forum.createdAt.getTime()) /
																(1000 * 60),
														);
														const hours = Math.floor(minutes / 60);
														const days = Math.floor(hours / 24);

														if (minutes < 60) return `Hace ${minutes} min`;
														if (hours < 24)
															return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
														return `Hace ${days} día${days > 1 ? 's' : ''}`;
													})()}
												</span>
											</div>
											{/* Separador */}
											<div className="h-px bg-default-200" />
											{/* Estadísticas + Acción */}
											<div className="flex items-center justify-between gap-4 text-sm text-default-600">
												<div className="flex items-center gap-1.5">
													<MessageCircle className="w-4 h-4" />
													<span>{forum.replies} respuestas</span>
												</div>
												<div className="flex items-center gap-1.5">
													<ThumbsUp className="w-4 h-4 text-success-600" />
													<span>{forum.likes}</span>
												</div>
												<div className="flex items-center gap-1.5">
													<Eye className="w-4 h-4" />
													<span>{forum.views}</span>
												</div>
												<div className="ml-auto">
													<Button
														size="sm"
														color="primary"
														variant="flat"
														onPress={() => {
															setSelectedForumId(forum.id);
															// Desplaza al panel de respuesta si existe
															setTimeout(() => {
																const el =
																	document.querySelector('#reply-panel');
																if (el)
																	el.scrollIntoView({
																		behavior: 'smooth',
																		block: 'start',
																	});
															}, 50);
														}}
													>
														Responder
													</Button>
												</div>
											</div>
										</CardBody>
									</Card>
								);
							})}

							{selectedForumId && (
								<Card id="reply-panel" className="border border-primary-200">
									<CardHeader className="py-3">
										<p className="text-sm font-semibold text-foreground">
											Responder al foro seleccionado
										</p>
									</CardHeader>
									<CardBody className="space-y-4">
										<Tabs
											aria-label="Selecciona el tipo de respuesta"
											selectedKey={replyType}
											onSelectionChange={(key) =>
												setReplyType(key as 'text' | 'image' | 'link')
											}
											variant="underlined"
											color="primary"
										>
											<Tab key="text" title="Texto" />
											<Tab key="image" title="Imagen" />
											<Tab key="link" title="Link" />
										</Tabs>

										{replyType === 'text' && (
											<Textarea
												label="Mensaje"
												placeholder="Escribe tu respuesta..."
												value={textReply}
												onChange={(e) => setTextReply(e.target.value)}
												isInvalid={!!replyErrors.text}
												errorMessage={replyErrors.text}
												minRows={4}
											/>
										)}

										{replyType === 'image' && (
											<div className="space-y-2">
												<Input
													type="file"
													accept="image/*"
													onChange={onImageChange}
													isInvalid={!!replyErrors.image}
													errorMessage={replyErrors.image}
												/>
												{imagePreview && (
													<img
														src={imagePreview}
														alt="previsualización"
														className="rounded-md border border-default-200 max-h-64 object-contain"
													/>
												)}
											</div>
										)}

										{replyType === 'link' && (
											<Input
												type="url"
												label="URL"
												placeholder="https://ejemplo.com/articulo"
												value={linkUrl}
												onChange={(e) => setLinkUrl(e.target.value)}
												isInvalid={!!replyErrors.link}
												errorMessage={replyErrors.link}
											/>
										)}

										<div className="flex justify-end">
											<Button
												color="primary"
												isDisabled={!canSubmitReply()}
												onPress={handleSubmitReply}
											>
												Enviar respuesta (Demo)
											</Button>
										</div>
									</CardBody>
								</Card>
							)}
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
