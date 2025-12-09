'use client';

import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Progress,
	Select,
	SelectItem,
	Spinner,
	Textarea,
	Tooltip,
} from '@heroui/react';
import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	Eye,
	MessageCircle,
	Pencil,
	Pin,
	Plus,
	RotateCcw,
	ThumbsUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { type ChatGroup, chatsService } from '~/lib/services/chats.service';
import {
	type Forum,
	forumsService,
	type Response,
	type Thread,
} from '~/lib/services/forums.service';
import { getStorageItem } from '~/lib/utils/storage';

type LocalTopic = {
	id: string;
	title: string;
	excerpt: string;
	author: string;
	timeAgo: string;
	subject: string;
	pinned?: boolean;
	resolved?: boolean;
	myTopic?: boolean;
	counts: { replies: number; likes: number; views: number };
	forumId: string;
};

type Reply = {
	id: string;
	author: string;
	timeAgo: string;
	content: string;
	mine?: boolean;
};

const SUBJECTS = [
	'Todos',
	'Matemáticas',
	'Programación',
	'Física',
	'Química',
	'Lenguaje',
];

function TopicCard({
	topic,
	onReply,
	onToggleReplies,
	repliesCount,
	onToggleResolved,
	onEditTopic,
	onTogglePinned,
	edited,
	isLoading,
}: {
	topic: LocalTopic;
	onReply: (id: string) => void;
	onToggleReplies: (id: string) => void;
	repliesCount: number;
	onToggleResolved: (id: string) => void;
	onEditTopic: (id: string) => void;
	onTogglePinned: (id: string) => void;
	edited?: boolean;
	isLoading?: boolean;
}) {
	return (
		<Card
			shadow="sm"
			className="border-1 border-default-200 cursor-pointer hover:border-primary-300 transition-colors"
		>
			<CardBody className="gap-3">
				<div className="flex items-center gap-2 text-sm">
					{topic.resolved ? (
						<Chip size="sm" color="success" variant="flat">
							Resuelto
						</Chip>
					) : null}
					{topic.myTopic && (
						<Chip size="sm" variant="flat" color="default">
							Propio
						</Chip>
					)}
					{edited && (
						<Chip size="sm" variant="flat" color="primary">
							Editado
						</Chip>
					)}
					<Chip size="sm" variant="flat" color="secondary">
						{topic.subject}
					</Chip>
					<div className="ml-auto flex items-center gap-3">
						<Tooltip
							content={topic.pinned ? 'Desfijar foro' : 'Fijar foro'}
							color="warning"
							placement="bottom"
						>
							<Button
								isIconOnly
								variant="flat"
								size="sm"
								aria-label={topic.pinned ? 'Desfijar foro' : 'Fijar foro'}
								className="rounded-medium"
								color={topic.pinned ? 'primary' : 'default'}
								onPress={() => onTogglePinned(topic.id)}
								onClick={(e) => e.stopPropagation()}
								isDisabled={isLoading}
							>
								<Pin
									size={16}
									className={topic.pinned ? 'text-primary' : undefined}
								/>
							</Button>
						</Tooltip>

						<div className="flex items-center gap-2">
							<Tooltip content="Editar foro" color="default" placement="bottom">
								<Button
									isIconOnly
									variant="flat"
									size="sm"
									aria-label="Editar foro"
									className="rounded-medium"
									onPress={() => onEditTopic(topic.id)}
									onClick={(e) => e.stopPropagation()}
									isDisabled={isLoading}
								>
									<Pencil size={16} />
								</Button>
							</Tooltip>
							{topic.resolved ? (
								<Tooltip
									content="Reabrir foro"
									color="warning"
									placement="bottom"
								>
									<Button
										isIconOnly
										variant="flat"
										size="sm"
										color="warning"
										aria-label="Reabrir foro"
										className="rounded-medium"
										onPress={() => onToggleResolved(topic.id)}
										onClick={(e) => e.stopPropagation()}
										isDisabled={isLoading}
									>
										<RotateCcw size={16} />
									</Button>
								</Tooltip>
							) : (
								<Tooltip
									content="Cerrar foro"
									color="success"
									placement="bottom"
								>
									<Button
										isIconOnly
										variant="flat"
										size="sm"
										color="success"
										aria-label="Cerrar foro"
										className="rounded-medium"
										onPress={() => onToggleResolved(topic.id)}
										onClick={(e) => e.stopPropagation()}
										isDisabled={isLoading}
									>
										<CheckCircle2 size={16} />
									</Button>
								</Tooltip>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-lg font-semibold text-foreground">
						{topic.title}
					</h3>
					<p className="text-default-600 text-sm">{topic.excerpt}</p>
				</div>

				<div className="text-xs text-default-500">
					Por {topic.author} · {topic.timeAgo}
				</div>

				<Divider className="my-1" />

				<div className="flex flex-wrap items-center gap-4">
					<button
						type="button"
						className="flex items-center gap-1 text-default-600 text-sm hover:text-primary transition-colors cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							onToggleReplies(topic.id);
						}}
						aria-label="Ver respuestas"
					>
						<MessageCircle size={16} />
						<span>{repliesCount} respuestas</span>
					</button>
					<div className="flex items-center gap-1 text-default-600 text-sm">
						<ThumbsUp size={16} />
						<span>{topic.counts.likes}</span>
					</div>
					<div className="flex items-center gap-1 text-default-600 text-sm">
						<Eye size={16} />
						<span>{topic.counts.views}</span>
					</div>

					<div className="ml-auto flex items-center gap-2">
						<Button
							size="sm"
							color="primary"
							variant="flat"
							startContent={<Plus size={16} />}
							onPress={() => onReply(topic.id)}
							isDisabled={isLoading}
						>
							Crear hilo
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

function GroupChatCard() {
	const [chats, setChats] = useState<ChatGroup[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		loadChats();
	}, [loadChats]);

	const loadChats = async () => {
		setIsLoading(true);
		try {
			const data = await chatsService.getAllGroups();
			setChats(data);
		} catch (error) {
			console.error('Error loading chats:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="border-1 border-default-200" shadow="sm">
			<CardBody className="gap-3">
				<div className="flex items-center justify-between">
					<h3 className="text-medium font-semibold">Chat Grupal</h3>
					<Badge
						color="primary"
						content={chats.length}
						shape="circle"
						size="sm"
					>
						<div />
					</Badge>
				</div>
				<p className="text-sm text-default-500">
					Conecta en tiempo real con otros estudiantes y tutores.
				</p>
				<Button
					color="primary"
					variant="flat"
					isLoading={isLoading}
					onPress={loadChats}
				>
					{isLoading ? 'Cargando...' : 'Abrir chat'}
				</Button>
			</CardBody>
		</Card>
	);
}

export function CommunityForums() {
	const [search, setSearch] = useState('');
	const [subject, setSubject] = useState('Todos');
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [selectedMateriaForCreate, setSelectedMateriaForCreate] =
		useState<string>('');
	const MIN_LEN = 15;
	const MAX_LEN = 50;

	// State para materias
	const [materias, setMaterias] = useState<Materia[]>([]);
	const [isLoadingMaterias, setIsLoadingMaterias] = useState(true);

	// State para carga de foros
	const [forums, setForums] = useState<Forum[]>([]);
	const [isLoadingForums, setIsLoadingForums] = useState(true);
	const [forumError, setForumError] = useState<string | null>(null);

	// State para edición y operaciones
	const [pinnedById, setPinnedById] = useState<Record<string, boolean>>({});
	const [editedById, setEditedById] = useState<Record<string, boolean>>({});
	const [isTopicEditOpen, setIsTopicEditOpen] = useState(false);
	const [editingTopicIdModal, setEditingTopicIdModal] = useState<string | null>(
		null,
	);
	const [editTopicTitle, setEditTopicTitle] = useState('');

	// State para hilos y respuestas
	const [threadsByForumId, setThreadsByForumId] = useState<
		Record<string, Thread[]>
	>({});
	const [responsesByThreadId, setResponsesByThreadId] = useState<
		Record<string, Response[]>
	>({});
	const [_creatingThreadForumId, setCreatingThreadForumId] = useState<
		string | null
	>(null);
	const [showThreadsFor, setShowThreadsFor] = useState<string | null>(null);
	const [threadTitle, setThreadTitle] = useState('');
	const [threadContent, setThreadContent] = useState('');
	const [isLoadingThreads, setIsLoadingThreads] = useState(false);

	// State para respuestas a hilos
	const [respondingToThreadId, setRespondingToThreadId] = useState<
		string | null
	>(null);
	const [responseContent, setResponseContent] = useState('');
	const [isLoadingResponses, setIsLoadingResponses] = useState(false);

	// State para respuestas a tópicos (crear threads)
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [showRepliesFor, setShowRepliesFor] = useState<string | null>(null);

	const titleLen = title.trim().length;
	const isTooShort = titleLen > 0 && titleLen < MIN_LEN;
	const isValidTitle = titleLen >= MIN_LEN && titleLen <= MAX_LEN;

	const editTitleLen = editTopicTitle.trim().length;
	const isEditTitleTooShort = editTitleLen > 0 && editTitleLen < MIN_LEN;
	const isEditTitleValid = editTitleLen >= MIN_LEN && editTitleLen <= MAX_LEN;

	const threadTitleLen = threadTitle.trim().length;
	const isThreadTitleValid =
		threadTitleLen >= MIN_LEN && threadTitleLen <= MAX_LEN;
	const threadContentLen = threadContent.trim().length;
	const isThreadContentValid =
		threadContentLen >= MIN_LEN && threadContentLen <= 5000;

	const responseLen = responseContent.trim().length;
	const isResponseValid = responseLen >= 5 && responseLen <= 5000;

	// Cargar foros al montar el componente
	// Cargar foros y materias al montar el componente
	useEffect(() => {
		loadForums();
		loadMaterias();
	}, [loadForums, loadMaterias]);

	// Debug: ver cuando cambia la materia seleccionada
	useEffect(() => {
		console.log(
			'selectedMateriaForCreate changed to:',
			selectedMateriaForCreate,
		);
	}, [selectedMateriaForCreate]);

	const loadMaterias = async () => {
		setIsLoadingMaterias(true);
		try {
			const data = await forumsService.getMaterias();
			console.log('Materias loaded:', data);
			setMaterias(data);
			// Inicializar con la primera materia si no hay ninguna seleccionada
			if (data.length > 0 && !selectedMateriaForCreate) {
				console.log('Setting initial materia:', data[0].codigo);
				setSelectedMateriaForCreate(data[0].codigo);
			}
		} catch (error: any) {
			console.error('Error loading materias:', error);
		} finally {
			setIsLoadingMaterias(false);
		}
	};

	const loadForums = async () => {
		setIsLoadingForums(true);
		setForumError(null);
		try {
			const data = await forumsService.getAllForums();
			setForums(data);
		} catch (error: any) {
			setForumError(error.message || 'Error al cargar los foros');
			console.error('Error loading forums:', error);
		} finally {
			setIsLoadingForums(false);
		}
	};

	// Convertir foros a topics para compatibilidad
	const topics = useMemo(() => {
		const topics: LocalTopic[] = forums.map((forum) => ({
			id: forum.id,
			title: forum.title,
			excerpt: forum.description || '',
			author: forum.creator?.nombre || 'Anónimo',
			timeAgo: formatTimeAgo(forum.created_at),
			subject: forum.materia?.nombre || 'General',
			pinned: pinnedById[forum.id] || false,
			resolved: forum.closed,
			myTopic: false,
			counts: {
				replies: forum.threads?.length || 0,
				likes: forum.likes_count || 0,
				views: forum.views_count || 0,
			},
			forumId: forum.id,
		}));

		// Filtrar por búsqueda
		let filtered = search
			? topics.filter(
					(t) =>
						t.title.toLowerCase().includes(search.toLowerCase()) ||
						t.excerpt.toLowerCase().includes(search.toLowerCase()),
				)
			: topics;

		// Filtrar por materia
		if (subject !== 'Todos') {
			filtered = filtered.filter((t) => t.subject === subject);
		}

		// Ordenar pinneds primero
		return filtered.sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
	}, [forums, search, subject, pinnedById]);

	const togglePinned = async (id: string) => {
		setPinnedById((prev) => ({ ...prev, [id]: !(prev[id] ?? false) }));
	};

	const openEditTopic = (id: string) => {
		const forum = forums.find((f) => f.id === id);
		if (forum) {
			setEditingTopicIdModal(id);
			setEditTopicTitle(forum.title);
			setIsTopicEditOpen(true);
		}
	};

	const saveEditTopic = async () => {
		if (!isEditTitleValid || !editingTopicIdModal) return;

		try {
			await forumsService.editForum(editingTopicIdModal, {
				title: editTopicTitle,
			});
			setEditedById((prev) => ({ ...prev, [editingTopicIdModal]: true }));
			await loadForums();
			setIsTopicEditOpen(false);
			setEditingTopicIdModal(null);
		} catch (error: any) {
			console.error('Error editing forum:', error);
		}
	};

	const createForum = async (onClose: () => void) => {
		if (!isValidTitle) return;

		try {
			const userId = getStorageItem('USER')?.id;

			// Usar la materia seleccionada en el modal o la primera disponible
			const materiaCode = selectedMateriaForCreate || materias[0]?.codigo;

			// Buscar la materia seleccionada por su código
			const selectedMateria = materias.find((m) => m.codigo === materiaCode);
			if (!selectedMateria) {
				console.error('No se ha seleccionado una materia válida');
				alert('Por favor selecciona una materia');
				return;
			}

			console.log('Creating forum with:', {
				title,
				materiaId: selectedMateria.id,
				userId,
				description: description || undefined,
			});

			await forumsService.createForum(
				title,
				selectedMateria.id,
				userId || '',
				description || undefined,
			);
			await loadForums();
			setTitle('');
			setDescription('');
			setSelectedMateriaForCreate('');
			onClose();
		} catch (error: any) {
			console.error('Error creating forum:', error);
			alert(`Error al crear el foro: ${error.message || 'Error desconocido'}`);
		}
	};

	const loadThreadsForForum = async (forumId: string) => {
		setIsLoadingThreads(true);
		try {
			const forum = await forumsService.getForumById(forumId);
			if (forum.threads) {
				setThreadsByForumId((prev) => ({
					...prev,
					[forumId]: forum.threads || [],
				}));
			}
		} catch (error: any) {
			console.error('Error loading threads:', error);
		} finally {
			setIsLoadingThreads(false);
		}
	};

	const createThread = async (forumId: string) => {
		if (!isThreadTitleValid || !isThreadContentValid) return;

		try {
			const userId = getStorageItem('USER')?.id || 'anonymous';
			const newThread = await forumsService.createThread(
				forumId,
				threadTitle,
				threadContent,
				userId,
			);

			setThreadsByForumId((prev) => ({
				...prev,
				[forumId]: [...(prev[forumId] || []), newThread],
			}));

			setThreadTitle('');
			setThreadContent('');
			setCreatingThreadForumId(null);
			setShowThreadsFor(forumId);
		} catch (error: any) {
			console.error('Error creating thread:', error);
		}
	};

	const loadResponsesForThread = async (threadId: string) => {
		setIsLoadingResponses(true);
		try {
			const thread = await forumsService.getThreadById(threadId);
			if (thread.responses) {
				setResponsesByThreadId((prev) => ({
					...prev,
					[threadId]: thread.responses || [],
				}));
			}
		} catch (error: any) {
			console.error('Error loading responses:', error);
		} finally {
			setIsLoadingResponses(false);
		}
	};

	const createResponse = async (threadId: string) => {
		if (!isResponseValid) return;

		try {
			const userId = getStorageItem('USER')?.id || 'anonymous';
			const newResponse = await forumsService.createResponse(
				threadId,
				responseContent,
				userId,
			);

			setResponsesByThreadId((prev) => ({
				...prev,
				[threadId]: [...(prev[threadId] || []), newResponse],
			}));

			setResponseContent('');
			setRespondingToThreadId(null);
		} catch (error: any) {
			console.error('Error creating response:', error);
		}
	};

	if (isLoadingForums) {
		return (
			<div className="flex items-center justify-center h-96">
				<Spinner label="Cargando foros..." />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-bold text-foreground">
					Comunidad ECIWISE+
				</h1>
				<p className="text-default-500">
					Conecta, colabora y aprende con otros estudiantes y tutores
				</p>
			</div>

			{forumError && (
				<Card className="border-1 border-danger-200 bg-danger-50">
					<CardBody className="flex-row gap-3 items-center">
						<AlertCircle className="text-danger" />
						<p className="text-danger text-sm">{forumError}</p>
						<Button
							size="sm"
							variant="flat"
							color="danger"
							className="ml-auto"
							onPress={loadForums}
						>
							Reintentar
						</Button>
					</CardBody>
				</Card>
			)}

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
				<div className="xl:col-span-3 space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<Input
							className="max-w-[520px] flex-1 min-w-[240px]"
							placeholder="Busca en los foros..."
							value={search}
							onValueChange={setSearch}
						/>
						<Select
							aria-label="Filtrar por materia"
							selectedKeys={[subject]}
							className="w-[220px]"
							onSelectionChange={(keys) => {
								const key = Array.from(keys)[0] as string | undefined;
								if (key) setSubject(key);
							}}
						>
							{SUBJECTS.map((s) => (
								<SelectItem key={s}>{s}</SelectItem>
							))}
						</Select>
						<Button
							color="primary"
							startContent={<Plus size={16} />}
							onPress={() => setIsOpen(true)}
						>
							Nuevo foro
						</Button>
					</div>

					{topics.length === 0 ? (
						<Card className="border-1 border-default-200">
							<CardBody className="flex items-center justify-center h-40">
								<p className="text-default-500">No hay foros disponibles</p>
							</CardBody>
						</Card>
					) : (
						<div className="space-y-3">
							{topics.map((t) => (
								<div key={t.id} className="space-y-3">
									<TopicCard
										topic={t}
										onReply={(id) =>
											setReplyingTo((curr) => (curr === id ? null : id))
										}
										onToggleReplies={(id) => {
											if (showRepliesFor === id) {
												setShowRepliesFor(null);
											} else {
												setShowRepliesFor(id);
												loadThreadsForForum(id);
											}
										}}
										onToggleResolved={() => {}}
										onEditTopic={openEditTopic}
										onTogglePinned={togglePinned}
										repliesCount={
											threadsByForumId[t.id]?.length || t.counts.replies
										}
										edited={!!editedById[t.id]}
									/>
									{replyingTo === t.id && (
										<Card
											className="border-1 border-primary-200 bg-primary-50/30"
											shadow="sm"
										>
											<CardHeader className="pb-0">
												<p className="text-small text-default-600">
													Crear nuevo hilo
												</p>
											</CardHeader>
											<CardBody className="gap-4">
												<Input
													label="Título del hilo"
													placeholder="Escribe el título del hilo..."
													value={threadTitle}
													onValueChange={setThreadTitle}
													isInvalid={threadTitleLen > 0 && !isThreadTitleValid}
													errorMessage={
														threadTitleLen > 0 && !isThreadTitleValid
															? `El título debe tener entre ${MIN_LEN} y ${MAX_LEN} caracteres`
															: undefined
													}
												/>
												<Textarea
													label="Contenido"
													placeholder="Describe tu pregunta o idea..."
													value={threadContent}
													onValueChange={setThreadContent}
													minRows={4}
													isInvalid={
														threadContentLen > 0 && !isThreadContentValid
													}
													errorMessage={
														threadContentLen > 0 && !isThreadContentValid
															? 'El contenido debe tener entre 15 y 5000 caracteres'
															: undefined
													}
												/>
												<div className="flex justify-end gap-2">
													<Button
														variant="light"
														onPress={() => {
															setReplyingTo(null);
															setThreadTitle('');
															setThreadContent('');
														}}
													>
														Cancelar
													</Button>
													<Button
														color="primary"
														onPress={() => createThread(t.id)}
														isDisabled={
															!isThreadTitleValid || !isThreadContentValid
														}
														isLoading={isLoadingThreads}
													>
														Publicar hilo
													</Button>
												</div>
											</CardBody>
										</Card>
									)}

									{showRepliesFor === t.id && (
										<Card className="border-1 border-default-200" shadow="sm">
											<CardHeader className="pb-0">
												<p className="text-small text-default-600">
													Hilos del foro ({threadsByForumId[t.id]?.length || 0})
												</p>
											</CardHeader>
											<CardBody className="gap-3">
												{isLoadingThreads ? (
													<div className="flex justify-center py-4">
														<Spinner size="sm" />
													</div>
												) : (threadsByForumId[t.id] ?? []).length === 0 ? (
													<p className="text-default-400 text-sm text-center">
														No hay hilos aún
													</p>
												) : (
													(threadsByForumId[t.id] ?? []).map((thread) => (
														<div
															key={thread.id}
															className="rounded-medium border-1 border-default-200 p-4 space-y-3"
														>
															<div className="flex items-start justify-between">
																<div className="flex-1">
																	<p className="font-medium text-default-700">
																		{thread.title}
																	</p>
																	<div className="flex items-center gap-2 text-xs text-default-500 mt-1">
																		<span>
																			{thread.author?.nombre || 'Anónimo'}
																		</span>
																		<span>•</span>
																		<span>
																			{thread.created_at
																				? new Date(
																						thread.created_at,
																					).toLocaleDateString()
																				: 'Recientemente'}
																		</span>
																	</div>
																</div>
																<Button
																	isIconOnly
																	variant="light"
																	size="sm"
																	onPress={() =>
																		loadResponsesForThread(thread.id)
																	}
																>
																	<ChevronDown
																		size={16}
																		className={`transition-transform ${
																			showThreadsFor === thread.id
																				? 'rotate-180'
																				: ''
																		}`}
																	/>
																</Button>
															</div>
															<p className="text-default-600 text-sm">
																{thread.content}
															</p>
															{showThreadsFor === thread.id && (
																<div className="mt-3 pt-3 border-t border-default-200 space-y-3">
																	<div className="space-y-2">
																		{(responsesByThreadId[thread.id] ?? []).map(
																			(response) => (
																				<div
																					key={response.id}
																					className="rounded-small bg-default-100 p-3 ml-4"
																				>
																					<div className="flex items-center gap-2 text-xs text-default-500 mb-1">
																						<span className="font-medium">
																							{response.author?.nombre ||
																								'Anónimo'}
																						</span>
																						<span>•</span>
																						<span>
																							{response.created_at
																								? new Date(
																										response.created_at,
																									).toLocaleDateString()
																								: 'Recientemente'}
																						</span>
																					</div>
																					<p className="text-default-600 text-xs">
																						{response.content}
																					</p>
																				</div>
																			),
																		)}
																	</div>
																	{isLoadingResponses ? (
																		<div className="flex justify-center py-2">
																			<Spinner size="sm" />
																		</div>
																	) : null}
																	<div className="mt-2 pt-2 border-t border-default-200">
																		<Button
																			size="sm"
																			variant="light"
																			onPress={() => {
																				setRespondingToThreadId(
																					respondingToThreadId === thread.id
																						? null
																						: thread.id,
																				);
																			}}
																		>
																			Responder
																		</Button>
																		{respondingToThreadId === thread.id && (
																			<div className="mt-2 space-y-2">
																				<Textarea
																					placeholder="Escribe tu respuesta..."
																					value={responseContent}
																					onValueChange={setResponseContent}
																					minRows={2}
																					isInvalid={
																						responseContentLen > 0 &&
																						!isResponseValid
																					}
																					errorMessage={
																						responseContentLen > 0 &&
																						!isResponseValid
																							? 'La respuesta debe tener entre 5 y 5000 caracteres'
																							: undefined
																					}
																				/>
																				<div className="flex justify-end gap-2">
																					<Button
																						size="sm"
																						variant="light"
																						onPress={() => {
																							setRespondingToThreadId(null);
																							setResponseContent('');
																						}}
																					>
																						Cancelar
																					</Button>
																					<Button
																						size="sm"
																						color="primary"
																						onPress={() =>
																							createResponse(thread.id)
																						}
																						isDisabled={!isResponseValid}
																						isLoading={isLoadingResponses}
																					>
																						Publicar
																					</Button>
																				</div>
																			</div>
																		)}
																	</div>
																</div>
															)}
														</div>
													))
												)}
											</CardBody>
										</Card>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				<div className="xl:col-span-1">
					<GroupChatCard />
				</div>
			</div>

			{/* Modal para crear nuevo foro */}
			<Modal isOpen={isOpen} onOpenChange={setIsOpen} size="lg">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span className="text-large font-semibold">Nuevo foro</span>
								<span className="text-small text-default-500">
									Crea un espacio de comunicación temático para discutir sobre
									una materia
								</span>
							</ModalHeader>
							<ModalBody className="gap-4">
								<Input
									label="Nombre del Foro"
									placeholder="ej: Dudas de Álgebra Lineal"
									value={title}
									onValueChange={setTitle}
									isInvalid={isTooShort}
									errorMessage={
										isTooShort
											? `El nombre debe tener al menos ${MIN_LEN} caracteres`
											: undefined
									}
									description={
										isValidTitle ? (
											<span className="text-success flex items-center gap-1">
												<CheckCircle2 size={14} /> Nombre válido ({MIN_LEN}/
												{MAX_LEN})
											</span>
										) : (
											<span className="text-default-400">
												Mínimo requerido: {MIN_LEN} caracteres.
											</span>
										)
									}
									maxLength={MAX_LEN}
									isClearable
								/>
								<Progress
									aria-label="Progreso mínimo de caracteres"
									size="sm"
									value={Math.min(titleLen, MIN_LEN) * (100 / MIN_LEN)}
									color={isValidTitle ? 'success' : 'warning'}
									className="mt-[-8px]"
								/>
								<Select
									label="Materia"
									selectedKeys={
										selectedMateriaForCreate
											? new Set([selectedMateriaForCreate])
											: new Set()
									}
									onSelectionChange={(keys) => {
										console.log('Selection changed, keys:', keys);
										const selected = Array.from(keys)[0] as string;
										console.log('Selected materia:', selected);
										if (selected) setSelectedMateriaForCreate(selected);
									}}
									isLoading={isLoadingMaterias}
									isRequired
									isDisabled={materias.length === 0}
								>
									{materias.map((materia) => (
										<SelectItem
											key={materia.codigo}
											textValue={`${materia.codigo} - ${materia.nombre}`}
										>
											{materia.codigo} - {materia.nombre}
										</SelectItem>
									))}
								</Select>
								<Input
									label="Descripción"
									placeholder="Describe tu duda o comparte tu idea"
									variant="bordered"
									value={description}
									onValueChange={setDescription}
								/>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Cancelar
								</Button>
								<Button
									color="primary"
									onPress={() => createForum(onClose)}
									isDisabled={!isValidTitle}
								>
									Publicar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de edición de foro */}
			<Modal
				isOpen={isTopicEditOpen}
				onOpenChange={setIsTopicEditOpen}
				size="lg"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<span className="text-large font-semibold">Editar foro</span>
							</ModalHeader>
							<ModalBody className="gap-4">
								<Input
									label="Título"
									placeholder="Escribe el título del foro"
									value={editTopicTitle}
									onValueChange={setEditTopicTitle}
									isInvalid={isEditTitleTooShort}
									errorMessage={
										isEditTitleTooShort
											? `El título debe tener al menos ${MIN_LEN} caracteres`
											: undefined
									}
									description={
										isEditTitleValid ? (
											<span className="text-success flex items-center gap-1">
												<CheckCircle2 size={14} /> Nombre válido ({MIN_LEN}/
												{MAX_LEN})
											</span>
										) : (
											<span className="text-default-400">
												Mínimo requerido: {MIN_LEN} caracteres.
											</span>
										)
									}
									maxLength={MAX_LEN}
									isClearable
								/>
								<Progress
									aria-label="Progreso mínimo de caracteres"
									size="sm"
									value={Math.min(editTitleLen, MIN_LEN) * (100 / MIN_LEN)}
									color={isEditTitleValid ? 'success' : 'warning'}
									className="mt-[-8px]"
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									variant="light"
									onPress={() => {
										setIsTopicEditOpen(false);
										setEditingTopicIdModal(null);
										onClose();
									}}
								>
									Cancelar
								</Button>
								<Button
									color="primary"
									onPress={() => {
										saveEditTopic();
										onClose();
									}}
									isDisabled={!isEditTitleValid}
								>
									Guardar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}

/**
 * Utilidad para formatear tiempo relativo
 */
function formatTimeAgo(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return 'Ahora';
	if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)}m`;
	if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)}h`;
	if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)}d`;
	return date.toLocaleDateString();
}

export default CommunityForums;
