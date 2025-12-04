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
	Tab,
	Tabs,
	Textarea,
	Tooltip,
} from '@heroui/react';
import {
	CheckCircle2,
	Eye,
	MessageCircle,
	Pencil,
	Pin,
	Plus,
	RotateCcw,
	ThumbsUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Topic = {
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
};

type Reply = {
	id: string;
	author: string; // Nombre visible
	timeAgo: string;
	content: string;
	mine?: boolean; // Si pertenece al usuario actual
};

const SUBJECTS = [
	'Todos',
	'Matemáticas',
	'Programación',
	'Física',
	'Química',
	'Lenguaje',
];

const SAMPLE_TOPICS: Topic[] = [
	{
		id: 't1',
		title: '¿Cómo resolver integrales por sustitución trigonométrica?',
		excerpt:
			'Tengo dudas sobre cuándo aplicar sustitución trigonométrica en integrales. ¿Alguien puede explicar los casos más comunes?',
		author: 'María García',
		timeAgo: 'Hace 5 min',
		subject: 'Matemáticas',
		pinned: true,
		resolved: false,
		counts: { replies: 2, likes: 23, views: 234 },
	},
	{
		id: 't2',
		title: 'Mejores prácticas para estructuras de datos en Python',
		excerpt:
			'¿Qué estructura de datos recomiendan usar para implementar un sistema de caché? Estoy entre diccionarios y OrderedDict…',
		author: 'Carlos Pérez',
		timeAgo: 'Hace 1 h',
		subject: 'Programación',
		resolved: true,
		myTopic: true,
		counts: { replies: 5, likes: 18, views: 517 },
	},
	{
		id: 't3',
		title: 'Duda rápida sobre vectores en Física',
		excerpt:
			'Si tengo dos vectores perpendiculares, ¿la magnitud de la suma siempre es la hipotenusa? ¿Hay contraejemplos?',
		author: 'Ana Torres',
		timeAgo: 'Ayer',
		subject: 'Física',
		counts: { replies: 3, likes: 9, views: 120 },
	},
];

function TopicCard({
	topic,
	onReply,
	onToggleReplies,
	repliesCount,
	onToggleResolved,
	onEditTopic,
	onTogglePinned,
	// onOpenDetails removed
}: {
	topic: Topic;
	onReply: (id: string) => void;
	onToggleReplies: (id: string) => void;
	repliesCount: number;
	onToggleResolved: (id: string) => void;
	onEditTopic: (id: string) => void;
	onTogglePinned: (id: string) => void;
	// onOpenDetails: (topic: Topic) => void;
}) {
	return (
		<Card
			shadow="sm"
			className="border-1 border-default-200 cursor-pointer hover:border-primary-300 transition-colors"
			// onClick={() => onOpenDetails(topic)}
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
	return (
		<Card className="border-1 border-default-200" shadow="sm">
			<CardBody className="gap-3">
				<div className="flex items-center justify-between">
					<h3 className="text-medium font-semibold">Chat Grupal</h3>
					<Badge color="primary" content="9" shape="circle" size="sm">
						<div />
					</Badge>
				</div>
				<p className="text-sm text-default-500">
					Conecta en tiempo real con otros estudiantes y tutores.
				</p>
				<Button color="primary" variant="flat">
					Abrir chat
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
	const MIN_LEN = 15;
	const MAX_LEN = 50;
	const [resolvedById, setResolvedById] = useState<Record<string, boolean>>(
		() => Object.fromEntries(SAMPLE_TOPICS.map((t) => [t.id, !!t.resolved])),
	);
	const [pinnedById, setPinnedById] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(SAMPLE_TOPICS.map((t) => [t.id, !!t.pinned])),
	);
	const [titleById, setTitleById] = useState<Record<string, string>>(() =>
		Object.fromEntries(SAMPLE_TOPICS.map((t) => [t.id, t.title])),
	);
	const [subjectById, setSubjectById] = useState<Record<string, string>>(() =>
		Object.fromEntries(SAMPLE_TOPICS.map((t) => [t.id, t.subject])),
	);

	const [isTopicEditOpen, setIsTopicEditOpen] = useState(false);
	const [editingTopicIdModal, setEditingTopicIdModal] = useState<string | null>(
		null,
	);
	const [editTopicTitle, setEditTopicTitle] = useState('');
	const [editTopicSubject, setEditTopicSubject] = useState('Matemáticas');
	const editTitleLen = editTopicTitle.trim().length;
	const isEditTitleTooShort = editTitleLen > 0 && editTitleLen < MIN_LEN;
	const isEditTitleValid = editTitleLen >= MIN_LEN && editTitleLen <= MAX_LEN;
	const titleLen = title.trim().length;
	const isTooShort = titleLen > 0 && titleLen < MIN_LEN;
	const isValidTitle = titleLen >= MIN_LEN && titleLen <= MAX_LEN;
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [showRepliesFor, setShowRepliesFor] = useState<string | null>(null);
	const [replyType, setReplyType] = useState<'texto' | 'imagen' | 'link'>(
		'texto',
	);
	const [replyText, setReplyText] = useState('');
	const [replyImage, setReplyImage] = useState<File | null>(null);
	const [replyLink, setReplyLink] = useState('');
	// Vista de detalle eliminada en favor de crear hilos directamente

	const initialReplies: Record<string, Reply[]> = useMemo(
		() => ({
			t1: [
				{
					id: 'r1',
					author: 'Tú',
					timeAgo: 'Hace 2 min',
					content: 'Mensaje de ejemplo editable para demostrar el flujo.',
					mine: true,
				},
				{
					id: 'r2',
					author: 'Ana Torres',
					timeAgo: 'Hace 9 min',
					content: 'Respuesta de otra persona para comparar permisos.',
				},
			],
			t2: [],
			t3: [],
		}),
		[],
	);
	const [replies, setReplies] =
		useState<Record<string, Reply[]>>(initialReplies);
	const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
	const [editingText, setEditingText] = useState('');
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);
	const [deleteReplyId, setDeleteReplyId] = useState<string | null>(null);
	const EDIT_MIN = 5;
	const editLen = editingText.trim().length;
	const isEditValid = editLen >= EDIT_MIN;

	const topics = useMemo(() => {
		const base = SAMPLE_TOPICS.map((t) => ({
			...t,
			title: titleById[t.id] ?? t.title,
			subject: subjectById[t.id] ?? t.subject,
			pinned: pinnedById[t.id] ?? t.pinned,
			resolved: resolvedById[t.id] ?? t.resolved,
		}));
		const bySubject =
			SUBJECTS.includes(subject) && subject !== 'Todos'
				? base.filter((t) => t.subject === subject)
				: base;
		const bySearch = search
			? bySubject.filter(
					(t) =>
						t.title.toLowerCase().includes(search.toLowerCase()) ||
						t.excerpt.toLowerCase().includes(search.toLowerCase()),
				)
			: bySubject;
		// Pinned first
		const sorted = [...bySearch].sort(
			(a, b) => Number(!!b.pinned) - Number(!!a.pinned),
		);
		return sorted;
	}, [search, subject, resolvedById, pinnedById, titleById, subjectById]);

	const toggleResolved = (id: string) => {
		setResolvedById((prev) => ({ ...prev, [id]: !(prev[id] ?? false) }));
	};

	const togglePinned = (id: string) => {
		setPinnedById((prev) => ({ ...prev, [id]: !(prev[id] ?? false) }));
	};

	const openEditTopic = (id: string) => {
		const currentTitle =
			titleById[id] ?? SAMPLE_TOPICS.find((t) => t.id === id)?.title ?? '';
		const currentSubject =
			subjectById[id] ??
			SAMPLE_TOPICS.find((t) => t.id === id)?.subject ??
			'Matemáticas';
		setEditingTopicIdModal(id);
		setEditTopicTitle(currentTitle);
		setEditTopicSubject(currentSubject);
		setIsTopicEditOpen(true);
	};

	const saveEditTopic = () => {
		if (!isEditTitleValid) return;
		if (!editingTopicIdModal) return;
		const id = editingTopicIdModal;
		setTitleById((prev) => ({ ...prev, [id]: editTopicTitle }));
		setSubjectById((prev) => ({ ...prev, [id]: editTopicSubject }));
		setIsTopicEditOpen(false);
		setEditingTopicIdModal(null);
	};

	// Detalle de foro desactivado

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
						<div className="ml-auto" />
						<Button
							color="primary"
							startContent={<Plus size={16} />}
							onPress={() => setIsOpen(true)}
						>
							Nuevo foro
						</Button>
					</div>

					<div className="space-y-3">
						{topics.map((t) => (
							<div key={t.id} className="space-y-3">
								<TopicCard
									topic={t}
									onReply={(id) =>
										setReplyingTo((curr) => (curr === id ? null : id))
									}
									onToggleReplies={(id) =>
										setShowRepliesFor((curr) => (curr === id ? null : id))
									}
									onToggleResolved={toggleResolved}
									onEditTopic={openEditTopic}
									onTogglePinned={togglePinned}
									repliesCount={
										(replies[t.id] ?? []).length || t.counts.replies
									}
								/>
								{replyingTo === t.id && (
									<Card
										className="border-1 border-primary-200 bg-primary-50/30"
										shadow="sm"
									>
										<CardHeader className="pb-0">
											<p className="text-small text-default-600">
												Responder al foro seleccionado
											</p>
										</CardHeader>
										<CardBody className="gap-4">
											<Tabs
												selectedKey={replyType}
												onSelectionChange={(k) =>
													setReplyType(k as 'texto' | 'imagen' | 'link')
												}
												aria-label="Tipo de respuesta"
												color="primary"
												variant="underlined"
											>
												<Tab key="texto" title="Texto">
													<Textarea
														label="Mensaje"
														placeholder="Escribe tu respuesta..."
														value={replyText}
														onValueChange={setReplyText}
														minRows={4}
													/>
												</Tab>
												<Tab key="imagen" title="Imagen">
													<Input
														type="file"
														accept="image/*"
														label="Imagen"
														description="Formatos soportados: PNG, JPG, WEBP"
														onChange={(e) =>
															setReplyImage(e.target.files?.[0] ?? null)
														}
													/>
												</Tab>
												<Tab key="link" title="Link">
													<Input
														type="url"
														label="Enlace"
														placeholder="https://..."
														value={replyLink}
														onValueChange={setReplyLink}
													/>
												</Tab>
											</Tabs>

											<div className="flex justify-end gap-2">
												<Button
													variant="light"
													onPress={() => setReplyingTo(null)}
												>
													Cancelar
												</Button>
												<Button
													color="primary"
													onPress={() => {
														if (!replyingTo) return;
														const content =
															replyType === 'texto'
																? replyText.trim()
																: replyType === 'imagen'
																	? `Imagen adjunta${replyImage?.name ? `: ${replyImage.name}` : ''}`
																	: replyLink.trim();

														if (!content) return;

														const newReply: Reply = {
															id: `r-${Date.now()}`,
															author: 'Tú',
															timeAgo: 'Ahora',
															content,
															mine: true,
														};

														setReplies((prev) => ({
															...prev,
															[replyingTo]: [
																...(prev[replyingTo] ?? []),
																newReply,
															],
														}));

														// Abrir listado de respuestas del tema y limpiar el panel
														setShowRepliesFor(replyingTo);
														setReplyText('');
														setReplyImage(null);
														setReplyLink('');
														setReplyingTo(null);
													}}
													isDisabled={
														(replyType === 'texto' &&
															replyText.trim().length < 1) ||
														(replyType === 'imagen' && !replyImage) ||
														(replyType === 'link' &&
															replyLink.trim().length < 1)
													}
												>
													Enviar respuesta
												</Button>
											</div>
										</CardBody>
									</Card>
								)}

								{showRepliesFor === t.id && (
									<Card className="border-1 border-default-200" shadow="sm">
										<CardHeader className="pb-0">
											<p className="text-small text-default-600">
												Foro seleccionado
											</p>
										</CardHeader>
										<CardBody className="gap-3">
											{(replies[t.id] ?? []).map((r) => (
												<div
													key={r.id}
													className="rounded-medium border-1 border-default-200 p-4"
												>
													<div className="flex items-center gap-2 text-xs text-default-500">
														<span className="font-medium text-default-600">
															{r.author}
														</span>
														<span>•</span>
														<span>{r.timeAgo}</span>
														{r.mine && (
															<div className="ml-auto flex items-center gap-4">
																<button
																	type="button"
																	className="text-primary text-sm hover:underline"
																	onClick={() => {
																		setEditingReplyId(r.id);
																		setEditingText(r.content);
																		setEditingTopicId(t.id);
																		setIsEditOpen(true);
																	}}
																>
																	Editar
																</button>
																<button
																	type="button"
																	className="text-danger text-sm hover:underline"
																	onClick={() => {
																		setDeleteTopicId(t.id);
																		setDeleteReplyId(r.id);
																		setIsDeleteOpen(true);
																	}}
																>
																	Eliminar
																</button>
															</div>
														)}
													</div>

													<p className="mt-3 text-default-600 text-sm">
														{r.content}
													</p>
												</div>
											))}
										</CardBody>
									</Card>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="xl:col-span-1">
					<GroupChatCard />
				</div>
			</div>

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
								<Select label="Materia" selectedKeys={['Matemáticas']}>
									{SUBJECTS.filter((s) => s !== 'Todos').map((s) => (
										<SelectItem key={s}>{s}</SelectItem>
									))}
								</Select>
								<Input
									label="Descripción"
									placeholder="Describe tu duda o comparte tu idea"
									variant="bordered"
								/>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Cancelar
								</Button>
								<Button
									color="primary"
									onPress={onClose}
									isDisabled={!isValidTitle}
								>
									Publicar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de edición de respuesta */}
			<Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen} size="lg">
				<ModalContent>
					{(_onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span className="text-large font-semibold">
									Editar respuesta
								</span>
							</ModalHeader>
							<ModalBody className="gap-3">
								<Textarea
									placeholder="Actualiza tu mensaje manteniendo claridad y respeto"
									value={editingText}
									onValueChange={setEditingText}
									minRows={6}
									isInvalid={editingText.trim().length === 0}
									errorMessage={
										editingText.trim().length === 0
											? 'El mensaje no puede estar vacío'
											: undefined
									}
									classNames={
										editingText.trim().length === 0
											? { inputWrapper: 'bg-danger-50' }
											: undefined
									}
								/>
								<div className="flex items-center justify-between text-xs">
									<span className="text-default-400">
										No se guardará si el texto queda vacío.
									</span>
									<span
										className={`flex items-center gap-1 ${isEditValid ? 'text-success' : 'text-danger'}`}
									>
										{isEditValid && <CheckCircle2 size={14} />}
										<span>
											{editLen} / {EDIT_MIN}
										</span>
									</span>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									variant="light"
									onPress={() => {
										setIsEditOpen(false);
										setEditingReplyId(null);
										setEditingTopicId(null);
									}}
								>
									Cancelar
								</Button>
								<Button
									color="primary"
									onPress={() => {
										if (!editingReplyId || !editingTopicId) return;
										setReplies((prev) => {
											const targetTopic = editingTopicId;
											return {
												...prev,
												[targetTopic]: (prev[targetTopic] ?? []).map((x) =>
													x.id === editingReplyId
														? { ...x, content: editingText }
														: x,
												),
											};
										});
										setIsEditOpen(false);
										setEditingReplyId(null);
										setEditingTopicId(null);
									}}
									isDisabled={!isEditValid}
								>
									Guardar cambios
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Modal de confirmación de eliminación */}
			<Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} size="md">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span className="text-large font-semibold">
									Confirmar eliminación
								</span>
							</ModalHeader>
							<ModalBody>
								<p className="text-default-600 text-sm">
									¿Seguro que deseas eliminar esta respuesta? Esta acción no se
									puede deshacer.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									variant="light"
									onPress={() => {
										setIsDeleteOpen(false);
										setDeleteReplyId(null);
										setDeleteTopicId(null);
										onClose();
									}}
								>
									Cancelar
								</Button>
								<Button
									color="primary"
									onPress={() => {
										if (!deleteTopicId || !deleteReplyId) return;
										setReplies((prev) => ({
											...prev,
											[deleteTopicId]: (prev[deleteTopicId] ?? []).filter(
												(x) => x.id !== deleteReplyId,
											),
										}));
										setIsDeleteOpen(false);
										setDeleteReplyId(null);
										setDeleteTopicId(null);
										onClose();
									}}
								>
									Eliminar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			{/* Vista de detalle de foro eliminada por ser redundante */}

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
								<div>
									<Select
										label="Materia"
										selectedKeys={[editTopicSubject]}
										onSelectionChange={(keys) => {
											const key = Array.from(keys)[0] as string | undefined;
											if (key) setEditTopicSubject(key);
										}}
									>
										{SUBJECTS.filter((s) => s !== 'Todos').map((s) => (
											<SelectItem key={s}>{s}</SelectItem>
										))}
									</Select>
								</div>
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

export default CommunityForums;
