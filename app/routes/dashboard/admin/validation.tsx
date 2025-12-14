import {
	Avatar,
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
	Spacer,
	Textarea,
	Tooltip,
} from '@heroui/react';
import {
	Check,
	CheckCircle2,
	Clock,
	FileText,
	Filter,
	Search,
	ShieldAlert,
	ShieldCheck,
	XCircle,
} from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { PageHeader } from '~/components/page-header';
import { StatsCard } from '~/components/stats-card';

type ValidationStatus = 'pending' | 'approved' | 'rejected';

interface ValidationMaterial {
	id: string;
	title: string;
	author: string;
	email: string;
	subject: string;
	semester: string;
	uploadedAt: string;
	pages: number;
	size: string;
	type: 'PDF' | 'PPT' | 'DOC';
	status: ValidationStatus;
	tags: string[];
	notes?: string;
	previewUrl?: string;
}

// TODO: Reemplazar previewUrl mock por URL real recibida desde backend
const SAMPLE_PDF =
	'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9Db250ZW50cyA0IDAgUi9SZXNvdXJjZXMgNSAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHMgWzEgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvTGVuZ3RoIDQ3Pj4Kc3RyZWFtCkJUClsvSGVsdG8gQWRtaW4gKFNhbXBsZSBQREYpXQplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwvRm9udCA8PC9GMCA2IDAgUj4+Pj4KZW5kb2JqCjYgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvTmFtZS9GMCAvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMCAwMDAwMCBuCjAwMDAwMDA5OSAwMDAwMCBuCjAwMDAwMDE1OCAwMDAwMCBuCjAwMDAwMDE5MyAwMDAwMCBuCjAwMDAwMDI5MCAwMDAwMCBuCjAwMDAwMDM2NyAwMDAwMCBuCjAwMDAwMDQ3NyAwMDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA3L1Jvb3QgMyAwIFIgL0luZm8gNiAwIFIvSUQgWzxjNmU0NTIyZjllYmI0M2E5Mzc3YzY0YTNjM2FmZjA5Zj4gPGM2ZTQ1MjJmOWViYjQzYTkzNzdjNjRhM2MzYWZmMDlmPl0+PgpzdGFydHhyZWYKNTE5CiUlRU9G';
// TODO: Reemplazar datos mock con fetch real desde el backend
const initialQueue: ValidationMaterial[] = [
	{
		id: 'MAT-431',
		title: 'Cálculo II - Integrales impropias (guía completa)',
		author: 'Laura Benítez',
		email: 'laurab@eci.edu',
		subject: 'Cálculo',
		semester: '2024-2',
		uploadedAt: 'Hace 10 min',
		pages: 18,
		size: '3.6 MB',
		type: 'PDF',
		status: 'pending',
		tags: ['Nuevo', 'Incluye ejercicios', 'Auto-subido'],
		previewUrl: SAMPLE_PDF,
	},
	{
		id: 'FIS-118',
		title: 'Laboratorio de Ondas - Procedimiento y resultados',
		author: 'Miguel Torres',
		email: 'm.torres@eci.edu',
		subject: 'Física',
		semester: '2024-2',
		uploadedAt: 'Hace 25 min',
		pages: 9,
		size: '2.1 MB',
		type: 'PDF',
		status: 'pending',
		tags: ['Reporte automático', 'Posible plagio'],
		notes: 'Coincidencias con material ya publicado el semestre pasado.',
		previewUrl: SAMPLE_PDF,
	},
	{
		id: 'PROG-222',
		title: 'Estructuras de Datos - Mapas y Grafos',
		author: 'Camila Rojas',
		email: 'crojas@eci.edu',
		subject: 'Programación',
		semester: '2024-1',
		uploadedAt: 'Hace 1 hora',
		pages: 24,
		size: '5.4 MB',
		type: 'PPT',
		status: 'pending',
		tags: ['Taller', 'Diapositivas'],
		previewUrl: SAMPLE_PDF,
	},
];

const initialHistory: ValidationMaterial[] = [
	{
		id: 'QUI-090',
		title: 'Química Orgánica - Guía de enlaces',
		author: 'Diana Vélez',
		email: 'dvelez@eci.edu',
		subject: 'Química',
		semester: '2024-1',
		uploadedAt: 'Ayer',
		pages: 12,
		size: '1.9 MB',
		type: 'PDF',
		status: 'approved',
		tags: ['Validado'],
		notes: 'Revisado y aprobado por el equipo académico.',
	},
	{
		id: 'EST-301',
		title: 'Estadística - Series de tiempo',
		author: 'Juan Ávila',
		email: 'javilaa@eci.edu',
		subject: 'Estadística',
		semester: '2023-2',
		uploadedAt: 'Hace 3 días',
		pages: 16,
		size: '4.2 MB',
		type: 'PDF',
		status: 'rejected',
		tags: ['Observaciones'],
		notes: 'Faltan referencias y fuentes de los ejemplos.',
	},
];

const statusConfig: Record<
	ValidationStatus,
	{
		label: string;
		color: 'primary' | 'warning' | 'success' | 'danger' | 'default';
		icon: React.JSX.Element;
	}
> = {
	pending: {
		label: 'Pendiente',
		color: 'primary',
		icon: <Clock className="w-4 h-4" />,
	},
	approved: {
		label: 'Aprobado',
		color: 'success',
		icon: <CheckCircle2 className="w-4 h-4" />,
	},
	rejected: {
		label: 'Rechazado',
		color: 'danger',
		icon: <XCircle className="w-4 h-4" />,
	},
};

export default function AdminValidation() {
	const [queue, setQueue] = useState<ValidationMaterial[]>(initialQueue);
	const [history, setHistory] = useState<ValidationMaterial[]>(initialHistory);
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all' | 'recent'>('all');
	const [selectedId, setSelectedId] = useState<string | null>(
		initialQueue[0]?.id || null,
	);
	const [decisionNote, setDecisionNote] = useState('');
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [confirmAction, setConfirmAction] = useState<
		'approved' | 'rejected' | null
	>(null);
	// TODO: Obtener el material seleccionado desde el backend
	const selectedMaterial =
		queue.find((item) => item.id === selectedId) || queue[0] || null;

	const filteredQueue = useMemo(() => {
		const byFilter = queue.filter((item) => {
			if (filter === 'recent') return item.uploadedAt.includes('min');
			return true;
		});

		if (!search) return byFilter;

		return byFilter.filter((item) => {
			const term = search.toLowerCase();
			return (
				item.title.toLowerCase().includes(term) ||
				item.author.toLowerCase().includes(term) ||
				item.subject.toLowerCase().includes(term) ||
				item.id.toLowerCase().includes(term)
			);
		});
	}, [filter, queue, search]);

	const stats = useMemo(() => {
		const pending = queue.length;
		const completed = history.length;
		return { pending, completed };
	}, [history, queue]);

	// TODO: Conectar con backend para enviar decisión de aprobación/rechazo
	const handleDecision = (
		decision: Extract<ValidationStatus, 'approved' | 'rejected'>,
	) => {
		if (!selectedMaterial) return;

		const updated: ValidationMaterial = {
			...selectedMaterial,
			status: decision,
			notes: decisionNote || selectedMaterial.notes,
			uploadedAt: 'Hace un momento',
		};

		const updatedQueue = queue.filter(
			(item) => item.id !== selectedMaterial.id,
		);

		setHistory((prev) => [updated, ...prev]);
		setQueue(updatedQueue);
		setDecisionNote('');
		setSelectedId(updatedQueue[0]?.id || null);
		setConfirmAction(null);
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Validación de Materiales"
				description="Revisa, aprueba o rechaza los materiales compartidos antes de publicarlos"
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<StatsCard
					title="En revisión"
					value={stats.pending}
					icon={<FileText className="w-5 h-5" />}
					color="primary"
					description="Materiales en la cola de aprobación"
				/>
				<StatsCard
					title="Revisados"
					value={stats.completed}
					icon={<ShieldCheck className="w-5 h-5" />}
					color="success"
					description="Aprobados o rechazados recientemente"
				/>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				<Card className="xl:col-span-2">
					<CardHeader className="ml-5 gap-3 mt-3">
						<div className="gap-3">
							<div>
								<h2 className="text-xl font-semibold">Cola de validación</h2>
								<p className="text-sm text-default-500 mb-3 mr-10">
									Selecciona un material para revisar su contenido y aprobarlo o
									rechazarlo.
								</p>
							</div>
							<Chip
								variant="flat"
								color="primary"
								startContent={<Clock className="w-4 h-4" />}
							>
								{queue.length} pendientes
							</Chip>
						</div>

						<div className="flex flex-wrap gap-3">
							<Input
								className="max-w-md"
								placeholder="Buscar por título, autor o código..."
								startContent={<Search className="w-4 h-4 text-default-400" />}
								value={search}
								onValueChange={setSearch}
								size="sm"
							/>
							<div className="flex gap-2">
								<Button
									variant={filter === 'all' ? 'solid' : 'flat'}
									startContent={<Filter className="w-4 h-4" />}
									color="primary"
									size="sm"
									onPress={() => setFilter('all')}
								>
									Todo
								</Button>
								<Button
									variant={filter === 'recent' ? 'solid' : 'flat'}
									color="default"
									size="sm"
									onPress={() => setFilter('recent')}
								>
									Recientes
								</Button>
							</div>
						</div>
					</CardHeader>

					<CardBody className="divide-y divide-default-200 p-0">
						{filteredQueue.length === 0 ? (
							<div className="p-6 text-default-500 text-sm">
								No hay materiales que coincidan con el filtro seleccionado.
							</div>
						) : (
							filteredQueue.map((material) => {
								const selected = material.id === selectedId;
								const status = statusConfig[material.status];
								return (
									<button
										key={material.id}
										className={`w-full text-left transition-colors ${
											selected ? 'bg-primary-50/80' : 'hover:bg-default-100'
										}`}
										onClick={() => setSelectedId(material.id)}
										type="button"
									>
										<div className="flex flex-col gap-2 p-4">
											<div className="flex items-start justify-between gap-3">
												<div className="flex items-center gap-2">
													<Chip
														size="sm"
														color={status.color}
														variant="flat"
														startContent={status.icon}
													>
														{status.label}
													</Chip>
													<span className="text-xs text-default-400">
														{material.id}
													</span>
												</div>
												<span className="text-xs text-default-400">
													{material.uploadedAt}
												</span>
											</div>
											<div className="flex flex-wrap items-start justify-between gap-3">
												<div className="flex flex-col gap-1">
													<p className="font-semibold text-foreground">
														{material.nombre}
													</p>
													<div className="flex flex-wrap items-center gap-2 text-sm text-default-500">
														<span>{material.tutor}</span>
														<span aria-hidden="true">•</span>
														<span>{material.subject}</span>
														<span aria-hidden="true">•</span>
														<span>{material.pages} páginas</span>
														<span aria-hidden="true">•</span>
														<span>{material.size}</span>
													</div>
													<div className="flex flex-wrap gap-2">
														{material.tags.map((tag) => (
															<Chip key={tag} size="sm" variant="flat">
																{tag}
															</Chip>
														))}
													</div>
												</div>
											</div>
											{material.notes && (
												<p className="text-xs text-warning-600 bg-warning-50 rounded-lg px-3 py-2">
													{material.notes}
												</p>
											)}
										</div>
									</button>
								);
							})
						)}
					</CardBody>
				</Card>

				<Card>
					<CardHeader className="flex items-start justify-between gap-3">
						<div>
							<h2 className="text-xl font-semibold">Vista previa</h2>
							<p className="text-sm text-default-500">
								Confirma que el material cumple con los criterios antes de
								publicarlo.
							</p>
						</div>
						{selectedMaterial && (
							<Chip
								color={statusConfig[selectedMaterial.status].color}
								variant="flat"
								startContent={statusConfig[selectedMaterial.status].icon}
							>
								{statusConfig[selectedMaterial.status].label}
							</Chip>
						)}
					</CardHeader>
					<CardBody className="flex flex-col gap-4">
						{!selectedMaterial ? (
							<div className="text-center text-default-500 text-sm p-6">
								Selecciona un material de la cola para revisarlo.
							</div>
						) : (
							<>
								<div className="flex items-center gap-3 p-3 rounded-lg bg-default-100">
									<div className="flex items-center gap-2">
										<FileText className="w-5 h-5 text-default-500" />
										<div className="flex flex-col">
											<span className="font-semibold text-sm">
												{selectedMaterial.title}
											</span>
											<span className="text-xs text-default-500">
												{selectedMaterial.subject} • {selectedMaterial.pages}{' '}
												páginas • {selectedMaterial.type}
											</span>
										</div>
									</div>
									<Spacer x={2} />
								</div>

								<div className="rounded-xl border border-default-200 bg-default-50 p-4 flex items-center justify-between">
									<div className="flex items-center gap-3 text-sm text-default-500">
										<Avatar
											className="bg-danger-100 text-danger"
											name={selectedMaterial.author}
											size="sm"
										/>
										<div className="flex flex-col">
											<span className="text-foreground font-medium">
												{selectedMaterial.author}
											</span>
											<span>{selectedMaterial.email}</span>
										</div>
									</div>
									{selectedMaterial.previewUrl && (
										<div className="flex items-center gap-2">
											<Button
												variant="flat"
												size="sm"
												onPress={() => setIsPreviewOpen(true)}
											>
												Ver vista previa
											</Button>
											<Tooltip content="Abrir en pestaña nueva">
												<Button
													as="a"
													href={selectedMaterial.previewUrl}
													target="_blank"
													rel="noopener noreferrer"
													variant="light"
													size="sm"
												>
													Abrir PDF
												</Button>
											</Tooltip>
										</div>
									)}
								</div>

								<div className="grid grid-cols-2 gap-4 text-sm text-default-600">
									<div className="space-y-1">
										<p className="text-default-400">Tipo</p>
										<p className="font-medium">{selectedMaterial.type}</p>
									</div>
									<div className="space-y-1">
										<p className="text-default-400">Tamaño</p>
										<p className="font-medium">{selectedMaterial.size}</p>
									</div>
									<div className="space-y-1">
										<p className="text-default-400">Semestre</p>
										<p className="font-medium">{selectedMaterial.semester}</p>
									</div>
									<div className="space-y-1">
										<p className="text-default-400">Subido</p>
										<p className="font-medium">{selectedMaterial.uploadedAt}</p>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<ShieldAlert className="w-4 h-4 text-default-500" />
										<span className="text-sm text-default-500">
											Notas u observaciones para este material
										</span>
									</div>
									<Textarea
										placeholder="Añade comentarios sobre el material, razones de aprobación o rechazo..."
										value={decisionNote}
										onValueChange={setDecisionNote}
										minRows={3}
									/>
								</div>

								<div className="flex items-center justify-end gap-3">
									<Button
										variant="flat"
										color="danger"
										startContent={<XCircle className="w-4 h-4" />}
										onPress={() => setConfirmAction('rejected')}
									>
										Rechazar
									</Button>
									<Button
										className="bg-[#8B1A1A] text-white"
										startContent={<Check className="w-4 h-4" />}
										onPress={() => setConfirmAction('approved')}
									>
										Aprobar y publicar
									</Button>
								</div>
							</>
						)}
					</CardBody>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-semibold">Decisiones recientes</h3>
						<p className="text-sm text-default-500">
							Últimos materiales evaluados por el equipo de administración.
						</p>
					</div>
				</CardHeader>
				<CardBody className="divide-y divide-default-200 p-0">
					{history.map((item) => {
						const status = statusConfig[item.status];
						return (
							<div key={item.id} className="p-4 flex flex-col gap-2">
								<div className="flex items-start justify-between gap-3">
									<div className="flex items-center gap-2">
										<Chip
											size="sm"
											color={status.color}
											variant="flat"
											startContent={status.icon}
										>
											{status.label}
										</Chip>
										<span className="text-xs text-default-400">{item.id}</span>
									</div>
									<span className="text-xs text-default-400">
										{item.uploadedAt}
									</span>
								</div>
								<p className="font-medium text-foreground">{item.title}</p>
								<div className="flex flex-wrap items-center gap-2 text-sm text-default-500">
									<span>{item.author}</span>
									<span aria-hidden="true">•</span>
									<span>{item.subject}</span>
									<span aria-hidden="true">•</span>
									<span>{item.pages} páginas</span>
								</div>
								{item.notes && (
									<p className="text-xs text-default-600 bg-default-100 rounded-lg px-3 py-2">
										{item.notes}
									</p>
								)}
							</div>
						);
					})}
				</CardBody>
			</Card>

			<Modal
				isOpen={isPreviewOpen && !!selectedMaterial?.previewUrl}
				onClose={() => setIsPreviewOpen(false)}
				size="5xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span className="text-sm text-default-500">
									Vista previa del material
								</span>
								<p className="text-lg font-semibold text-foreground">
									{selectedMaterial?.title}
								</p>
							</ModalHeader>
							<ModalBody className="p-0">
								<div className="aspect-[4/3] bg-white">
									{selectedMaterial?.previewUrl ? (
										<iframe
											title={`Vista previa de ${selectedMaterial.title}`}
											src={selectedMaterial.previewUrl}
											className="w-full h-full"
											loading="lazy"
										/>
									) : (
										<div className="flex flex-col items-center justify-center h-full text-default-400 text-sm gap-2">
											<FileText className="w-10 h-10" />
											<span>Vista previa no disponible para este formato.</span>
										</div>
									)}
								</div>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Cerrar
								</Button>
								{selectedMaterial?.previewUrl && (
									<Button
										as="a"
										href={selectedMaterial.previewUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="bg-[#8B1A1A] text-white"
									>
										Abrir en nueva pestaña
									</Button>
								)}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			<Modal
				isOpen={!!confirmAction && !!selectedMaterial}
				onClose={() => setConfirmAction(null)}
				size="md"
				backdrop="opaque"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{confirmAction === 'approved'
									? 'Confirmar aprobación'
									: 'Confirmar rechazo'}
							</ModalHeader>
							<ModalBody>
								<p className="text-default-600 text-sm">
									{confirmAction === 'approved'
										? `¿Seguro que deseas aprobar y publicar "${selectedMaterial?.title}"?`
										: `¿Seguro que deseas rechazar "${selectedMaterial?.title}"?`}
								</p>
								{decisionNote && (
									<div className="bg-default-100 rounded-lg p-3 text-xs text-default-500">
										<span className="font-semibold text-default-600">
											Nota:
										</span>{' '}
										{decisionNote}
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={onClose}>
									Cancelar
								</Button>
								<Button
									className="bg-[#8B1A1A] text-white"
									color="default"
									onPress={() => confirmAction && handleDecision(confirmAction)}
								>
									Confirmar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
