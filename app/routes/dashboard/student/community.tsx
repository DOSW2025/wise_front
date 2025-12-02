import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tab,
	Tabs,
	Textarea,
	Tooltip,
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
import { useAuth } from '~/contexts/auth-context';
import { createForumReply, getForumById } from '~/lib/services/forum.service';

interface Forum {
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

// Alias de tipo para Sonar (evita union literal repetida)
type ReplyKind = 'text' | 'image' | 'link';

// Helpers para reducir ternarios/anidaciones
function getForumDescription(forumId: string): string {
	switch (forumId) {
		case 'forum-1':
			return 'Tengo dudas sobre cuándo aplicar sustitución trigonométrica en integrales. ¿Alguien puede explicar los casos más comunes?';
		case 'forum-2':
			return '¿Qué estructura de datos recomiendan usar para implementar un sistema de caché? Estoy considerando usar diccionarios pero me gustaría conocer otras opciones.';
		case 'forum-3':
			return 'En problemas con fricción, ¿cómo identifico correctamente todas las fuerzas que actúan sobre un cuerpo?';
		default:
			return '¿Alguien tiene tips para balancear ecuaciones redox más fácilmente? Siempre me confundo con los números de oxidación.';
	}
}

type ReplyPayload =
	| { forumId: string; type: 'text'; text: string }
	| { forumId: string; type: 'image'; imageName?: string }
	| { forumId: string; type: 'link'; url: string };

function buildReplyPayload(
	replyType: 'text' | 'image' | 'link',
	forumId: string,
	textReply: string,
	imageFile: File | null,
	linkUrl: string,
): ReplyPayload {
	if (replyType === 'text') {
		return { forumId, type: 'text', text: textReply.trim() };
	}
	if (replyType === 'image') {
		return { forumId, type: 'image', imageName: imageFile?.name };
	}
	return { forumId, type: 'link', url: linkUrl.trim() };
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
	const [replyType, setReplyType] = useState<ReplyKind>('text');
	const [textReply, setTextReply] = useState('');
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [linkUrl, setLinkUrl] = useState('');
	const [replyErrors, setReplyErrors] = useState<{
		text?: string;
		image?: string;
		link?: string;
	}>({});
	const DEMO_FORUMS: Forum[] = [
		{
			id: 'forum-1',
			name: '¿Cómo resolver integrales por sustitución trigonométrica?',
			subject: 'matematicas',
			createdAt: new Date(Date.now() - 5 * 60 * 1000),
			members: 12,
			replies: 2,
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
			createdAt: new Date(Date.now() - 15 * 60 * 1000),
			members: 8,
			replies: 1,
			likes: 45,
			views: 567,
			author: 'Carlos Méndez',
			isPinned: false,
			isResolved: true,
		},
	];
	const [forums, setForums] = useState<Forum[]>(DEMO_FORUMS);

	// Fallback por si llega vacío desde otras ramas / pruebas
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
	const [creationError, setCreationError] = useState<string | null>(null);
	const [threadError, setThreadError] = useState<string | null>(null);
	const [threadLoading, setThreadLoading] = useState<boolean>(false);
	// Estado local de respuestas del hilo (ejemplo temporal hasta conectar backend)
	const [threadReplies, setThreadReplies] = useState<
		{
			id: string;
			forumId: string;
			authorId: string;
			authorName: string;
			type: 'text';
			content: string;
			createdAt: Date;
			editedAt?: Date;
			isEdited?: boolean;
		}[]
	>([]);
	// Edición de respuesta
	const editModal = useDisclosure();
	const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
	const [editingContent, setEditingContent] = useState('');
	const [savingEdit, setSavingEdit] = useState(false);
	const [editError, setEditError] = useState<string | null>(null);

	// Validación del contenido editado (reglas básicas de higiene de texto)
	const validateEditedContent = (text: string): string | null => {
		const trimmed = text.trim();
		if (trimmed.length < 5)
			return 'El mensaje debe tener al menos 5 caracteres';
		// Evitar solo signos o caracteres repetidos
		if (/^([\p{P}\p{S}\s]|.)\1{4,}$/u.test(trimmed))
			return 'Evita texto repetitivo o sin contenido claro';
		// Evitar solo espacios/nuevas líneas
		if (!/[\p{L}\p{N}]/u.test(trimmed))
			return 'El mensaje debe contener letras o números';
		return null;
	};
	// Eliminación de respuesta
	const deleteModal = useDisclosure();
	const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const { user } = useAuth();
	const currentUserId = user?.id || 'mock-user-student';

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

	const viewThread = async (forumId: string) => {
		setSelectedForumId(forumId);
		setThreadError(null);
		setThreadLoading(true);
		try {
			await getForumById(forumId);
			// Éxito: no hacemos nada específico, sólo limpiar error
			// Cargar ejemplos de respuestas para demostrar edición (solo texto)
			setThreadReplies([
				{
					id: 'r1',
					forumId,
					authorId: 'mock-user-student',
					authorName: 'Tú',
					type: 'text',
					content:
						'Este es mi primer aporte al hilo. Quiero mejorar la explicación.',
					createdAt: new Date(Date.now() - 3 * 60 * 1000),
				},
				{
					id: 'r2',
					forumId,
					authorId: 'other-user-1',
					authorName: 'Ana Torres',
					type: 'text',
					content:
						'Puedes aplicar sustitución cuando el integrando tiene raíces cuadradas de 1 - x^2, etc.',
					createdAt: new Date(Date.now() - 8 * 60 * 1000),
				},
			]);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Error desconocido';
			setThreadError(message);
		} finally {
			setThreadLoading(false);
			// Desplaza al panel de hilo si existe
			setTimeout(() => {
				const el = document.querySelector('#thread-panel');
				if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 50);
		}
	};

	const validateLink = (url: string) => {
		const pattern =
			/^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#@!$&'()*+,;=.]+$/i;
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

	// Helpers para acciones de modal (reduce anidación >4 niveles)
	const applyEdit = async (
		forumId: string | null,
		replyId: string | null,
		content: string,
		onCloseFn: () => void,
	) => {
		const validationError = validateEditedContent(content);
		if (validationError) {
			setEditError(validationError);
			return;
		}
		setEditError(null);
		setSavingEdit(true);
		try {
			if (!forumId || !replyId) {
				throw new Error('No hay foro/respuesta seleccionada');
			}
			setThreadReplies((prev) =>
				prev.map((r) =>
					r.id === replyId
						? {
								...r,
								content,
								editedAt: new Date(),
								isEdited: true,
							}
						: r,
				),
			);
			setEditingReplyId(null);
			setEditingContent('');
			onCloseFn();
		} catch (error_) {
			setEditError('Error al guardar. Intenta nuevamente.');
		} finally {
			setSavingEdit(false);
		}
	};

	const applyDelete = async (replyId: string | null, onCloseFn: () => void) => {
		setDeleteError(null);
		setDeleting(true);
		try {
			if (!replyId) throw new Error('No hay respuesta seleccionada');
			setThreadReplies((prev) => prev.filter((r) => r.id !== replyId));
			setDeletingReplyId(null);
			onCloseFn();
		} catch (error_) {
			setDeleteError('No se pudo eliminar. Intenta nuevamente.');
		} finally {
			setDeleting(false);
		}
	};

	const canSubmitReply = () => {
		if (!selectedForumId) return false;
		if (replyType === 'text') return textReply.trim().length >= 1;
		if (replyType === 'image') return !!imageFile;
		if (replyType === 'link') return validateLink(linkUrl);
		return false;
	};

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState<string | null>(null);

	const handleSubmitReply = async () => {
		const newErrors: { text?: string; image?: string; link?: string } = {};
		if (replyType === 'text' && textReply.trim().length < 1)
			newErrors.text = 'Escribe un mensaje';
		if (replyType === 'image' && !imageFile)
			newErrors.image = 'Selecciona una imagen';
		if (replyType === 'link' && !validateLink(linkUrl))
			newErrors.link = 'Ingresa una URL válida (http/https)';
		setReplyErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		if (!selectedForumId) return;
		setIsSubmitting(true);
		setSubmitMessage(null);
		try {
			const payload =
				replyType === 'text'
					? {
							forumId: selectedForumId,
							type: 'text' as const,
							text: textReply.trim(),
						}
					: replyType === 'image'
						? {
								forumId: selectedForumId,
								type: 'image' as const,
								imageName: imageFile?.name,
							}
						: {
								forumId: selectedForumId,
								type: 'link' as const,
								url: linkUrl.trim(),
							};

			await createForumReply(payload);
			setSubmitMessage('✅ Respuesta enviada');
			setTextReply('');
			setImageFile(null);
			setImagePreview(null);
			setLinkUrl('');
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Error desconocido';
			setSubmitMessage(`❌ ${message}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
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
							<div className="flex gap-2">
								<Button
									color="primary"
									size="lg"
									startContent={<Plus className="w-5 h-5" />}
									onPress={onOpen}
									className="font-semibold"
								>
									Nuevo tema
								</Button>
							</div>
						</div>
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
										{forums.length === 0
											? 'Aún no hay foros'
											: 'Sin resultados'}
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
															<span className="text-xs font-medium">
																Fijado
															</span>
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
													{getForumDescription(forum.id)}
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
													<div className="ml-auto flex items-center gap-2">
														<Button
															size="sm"
															color="primary"
															variant="flat"
															onPress={() => {
																setSelectedForumId(forum.id);
																// Cargar respuestas demo al presionar Responder (sustituye antiguo botón Ver Ejemplo)
																setThreadReplies([
																	{
																		id: `r-demo-1-${forum.id}`,
																		forumId: forum.id,
																		authorId: currentUserId,
																		authorName: 'Tú',
																		type: 'text',
																		content:
																			'Mensaje de ejemplo editable para demostrar el flujo.',
																		createdAt: new Date(
																			Date.now() - 2 * 60 * 1000,
																		),
																	},
																	{
																		id: `r-demo-2-${forum.id}`,
																		forumId: forum.id,
																		authorId: 'other-user-1',
																		authorName: 'Ana Torres',
																		type: 'text',
																		content:
																			'Respuesta de otra persona para comparar permisos.',
																		createdAt: new Date(
																			Date.now() - 9 * 60 * 1000,
																		),
																	},
																]);
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
														<Button
															size="sm"
															color="default"
															variant="bordered"
															onPress={() => viewThread(forum.id)}
															isLoading={
																threadLoading && selectedForumId === forum.id
															}
														>
															Ver hilo
														</Button>
													</div>
												</div>
											</CardBody>
										</Card>
									);
								})}

								{selectedForumId && (
									<Card id="thread-panel" className="border border-default-200">
										<CardHeader className="py-2">
											<p className="text-sm font-semibold text-foreground">
												Foro seleccionado
											</p>
										</CardHeader>
										<CardBody className="space-y-4">
											{threadError ? (
												<div className="flex items-start gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg">
													<span className="text-danger-600">❌</span>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-semibold text-danger-700">
															Error al cargar el hilo
														</p>
														<p className="text-xs text-danger-600 mt-0.5">
															{threadError}
														</p>
													</div>
												</div>
											) : (
												<div className="space-y-3">
													{threadReplies.length === 0 && (
														<div className="p-3 bg-default-50 border border-default-200 rounded-lg">
															<p className="text-xs text-default-600">
																Este hilo aún no tiene respuestas.
															</p>
															<p className="text-[11px] text-default-500">
																Usa el panel de abajo para responder con texto,
																imagen o link.
															</p>
														</div>
													)}
													{threadReplies.map((reply) => {
														const isAuthor = reply.authorId === currentUserId;
														const withinTime =
															Date.now() - reply.createdAt.getTime() <=
															60 * 60 * 1000; // 60 minutos
														return (
															<div
																key={reply.id}
																className="p-3 rounded-lg border border-default-200 bg-white space-y-2"
															>
																<div className="flex items-center justify-between">
																	<span className="text-xs font-medium text-default-700">
																		{reply.authorName} • {(() => {
																			const mins = Math.floor(
																				(Date.now() -
																					reply.createdAt.getTime()) /
																					(1000 * 60),
																			);
																			if (mins < 60) return `Hace ${mins} min`;
																			const hrs = Math.floor(mins / 60);
																			return `Hace ${hrs} h`;
																		})()}
																		{reply.isEdited && (
																			<span className="ml-2 align-middle">
																				<Chip
																					size="sm"
																					variant="flat"
																					color="secondary"
																					className="font-heading text-[10px]"
																				>
																					Editado
																				</Chip>
																			</span>
																		)}
																	</span>
																	{isAuthor && (
																		<div className="flex gap-2">
																			<Tooltip
																				content="Tiempo para editar/eliminar expirado (60 min)"
																				isDisabled={withinTime}
																			>
																				<span>
																					<Button
																						variant="light"
																						color="primary"
																						size="sm"
																						isDisabled={!withinTime}
																						onPress={
																							withinTime
																								? () => {
																										setEditingReplyId(reply.id);
																										setEditingContent(
																											reply.content,
																										);
																										setEditError(null);
																										editModal.onOpen();
																									}
																								: undefined
																						}
																					>
																						Editar
																					</Button>
																				</span>
																			</Tooltip>
																			<Tooltip
																				content="Tiempo para editar/eliminar expirado (60 min)"
																				isDisabled={withinTime}
																			>
																				<span>
																					<Button
																						variant="light"
																						color="danger"
																						size="sm"
																						isDisabled={!withinTime}
																						onPress={
																							withinTime
																								? () => {
																										setDeletingReplyId(
																											reply.id,
																										);
																										setDeleteError(null);
																										deleteModal.onOpen();
																									}
																								: undefined
																						}
																					>
																						Eliminar
																					</Button>
																				</span>
																			</Tooltip>
																		</div>
																	)}
																</div>
																<p className="text-sm text-default-700 leading-snug whitespace-pre-line">
																	{reply.content}
																</p>
															</div>
														);
													})}
												</div>
											)}
										</CardBody>
									</Card>
								)}

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

											{submitMessage && (
												<div
													className="text-xs px-3 py-2 rounded border"
													style={{
														borderColor: submitMessage.startsWith('✅')
															? 'var(--heroui-success-200)'
															: 'var(--heroui-danger-200)',
													}}
												>
													<span
														className={
															submitMessage.startsWith('✅')
																? 'text-success-700'
																: 'text-danger-700'
														}
													>
														{submitMessage}
													</span>
												</div>
											)}
											<div className="flex justify-end">
												<Button
													color="primary"
													isDisabled={!canSubmitReply() || isSubmitting}
													isLoading={isSubmitting}
													onPress={handleSubmitReply}
												>
													Enviar respuesta
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
								<h3 className="text-lg font-bold text-foreground">
									Chat Grupal
								</h3>
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
			{/* Modal de edición de respuesta */}
			{editingReplyId && (
				<Modal isOpen={editModal.isOpen} onClose={editModal.onClose} size="lg">
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">
									Editar respuesta
								</ModalHeader>
								<ModalBody>
									<Textarea
										value={editingContent}
										onChange={(e) => setEditingContent(e.target.value)}
										minRows={5}
										isInvalid={!!editError}
										errorMessage={editError || ''}
										placeholder="Actualiza tu mensaje manteniendo claridad y respeto"
										classNames={{
											inputWrapper:
												'border-default-300 focus:border-primary-300',
										}}
									/>
									<p className="text-[11px] text-default-500">
										No se guardará si el texto queda vacío.
									</p>
								</ModalBody>
								<ModalFooter>
									<Button
										variant="light"
										color="default"
										onPress={() => {
											setEditingReplyId(null);
											setEditingContent('');
											onClose();
										}}
									>
										Cancelar
									</Button>
									<Button
										color="primary"
										isLoading={savingEdit}
										isDisabled={savingEdit}
										onPress={() =>
											applyEdit(
												selectedForumId,
												editingReplyId,
												editingContent,
												onClose,
											)
										}
									>
										Guardar cambios
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			)}
			{/* Modal de confirmación de eliminación */}
			{deletingReplyId && (
				<Modal
					isOpen={deleteModal.isOpen}
					onClose={deleteModal.onClose}
					size="md"
				>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">
									Confirmar eliminación
								</ModalHeader>
								<ModalBody>
									<p className="text-sm text-default-600">
										¿Seguro que deseas eliminar esta respuesta? Esta acción es{' '}
										<span className="italic">visual</span> por ahora y se usará
										para pruebas de flujo.
									</p>
									{deleteError && (
										<p className="text-xs text-danger-600 mt-2">
											{deleteError}
										</p>
									)}
								</ModalBody>
								<ModalFooter>
									<Button
										variant="light"
										color="default"
										onPress={() => {
											setDeletingReplyId(null);
											setDeleteError(null);
											onClose();
										}}
									>
										Cancelar
									</Button>
									<Button
										color="danger"
										isLoading={deleting}
										onPress={() => applyDelete(deletingReplyId, onClose)}
									>
										Eliminar
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			)}
		</>
	);
}
