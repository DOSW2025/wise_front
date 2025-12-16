import {
	Avatar,
	Button,
	Card,
	CardBody,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	MapPin,
	Save,
	Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { DayAvailabilityEditor } from '~/components/DayAvailabilityEditor';
import { useAuth } from '~/contexts/auth-context';
import type {
	DisponibilidadSemanal,
	DisponibilidadSlot,
} from '~/lib/types/tutoria.types';
import { useAvailability } from './hooks/useAvailability';
import { useCompleteSession } from './hooks/useCompleteSession';
import { useConfirmedSessions } from './hooks/useConfirmedSessions';
import { useUpdateAvailability } from './hooks/useUpdateAvailability';

const DAYS = [
	{ key: 'monday', label: 'Lunes' },
	{ key: 'tuesday', label: 'Martes' },
	{ key: 'wednesday', label: 'Miércoles' },
	{ key: 'thursday', label: 'Jueves' },
	{ key: 'friday', label: 'Viernes' },
	{ key: 'saturday', label: 'Sábado' },
] as const;

export default function TutorScheduled() {
	const { user } = useAuth();
	const [searchParams] = useSearchParams();
	const [activeTab, setActiveTab] = useState<'scheduled' | 'availability'>(
		'scheduled',
	);

	// Modal para completar sesión
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedSession, setSelectedSession] = useState<string | null>(null);
	const [comentarios, setComentarios] = useState('');

	// Obtener sesiones confirmadas usando React Query
	const {
		data: confirmedSessions = [],
		isLoading,
		isError,
		error,
	} = useConfirmedSessions(user?.id);

	// Hook para completar sesión
	const completeSessionMutation = useCompleteSession();

	// Disponibilidad: React Query hooks
	const {
		data: availabilityData,
		isLoading: isLoadingAvailability,
		isError: isErrorAvailability,
	} = useAvailability(user?.id);

	const updateAvailabilityMutation = useUpdateAvailability(user?.id);

	// Estado local para el formulario de disponibilidad
	const [availability, setAvailability] = useState<DisponibilidadSemanal>({
		monday: [],
		tuesday: [],
		wednesday: [],
		thursday: [],
		friday: [],
		saturday: [],
		sunday: [],
	});

	// Cargar disponibilidad cuando lleguen los datos
	useEffect(() => {
		if (availabilityData) {
			setAvailability(availabilityData);
		}
	}, [availabilityData]);

	const handleCompleteSession = (sessionId: string) => {
		setSelectedSession(sessionId);
		setComentarios('');
		onOpen();
	};

	const handleConfirmComplete = () => {
		if (!selectedSession || !user?.id) return;

		completeSessionMutation.mutate(
			{
				sessionId: selectedSession,
				data: {
					tutorId: user.id,
					comentarios: comentarios.trim() || undefined,
				},
			},
			{
				onSuccess: () => {
					onClose();
					setSelectedSession(null);
					setComentarios('');
				},
			},
		);
	};

	// Detectar parámetro tab en la URL
	useEffect(() => {
		const tabParam = searchParams.get('tab');
		if (tabParam === 'availability') {
			setActiveTab('availability');
		}
	}, [searchParams]);

	// Funciones para manejar disponibilidad
	const addTimeSlot = (day: keyof DisponibilidadSemanal) => {
		setAvailability((prev) => ({
			...prev,
			[day]: [
				...prev[day],
				{
					start: '',
					end: '',
					modalidad: 'VIRTUAL',
					lugar: '',
				} as DisponibilidadSlot,
			],
		}));
	};

	const removeTimeSlot = (day: keyof DisponibilidadSemanal, index: number) => {
		setAvailability((prev) => ({
			...prev,
			[day]: prev[day].filter((_, i) => i !== index),
		}));
	};

	const updateTimeSlot = (
		day: keyof DisponibilidadSemanal,
		index: number,
		field: keyof DisponibilidadSlot,
		value: string,
	) => {
		setAvailability((prev) => ({
			...prev,
			[day]: prev[day].map((slot, i) =>
				i === index ? { ...slot, [field]: value } : slot,
			),
		}));
	};

	const handleSaveAvailability = () => {
		if (!user?.id) return;

		updateAvailabilityMutation.mutate(
			{ disponibilidad: availability },
			{
				onSuccess: () => {
					// Success feedback handled by mutation
				},
			},
		);
	};

	// Validar si el formulario tiene errores
	const hasAvailabilityErrors = () => {
		return Object.values(availability).some((daySlots) =>
			daySlots.some(
				(slot) =>
					!slot.start ||
					!slot.end ||
					!slot.lugar.trim() ||
					slot.start >= slot.end,
			),
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Sesiones y Disponibilidad
					</h1>
					<p className="text-default-500">
						Gestiona tus sesiones programadas y configura tu disponibilidad.
					</p>
				</div>

				{/* Tabs */}
				<div className="flex gap-2">
					<Button
						variant={activeTab === 'scheduled' ? 'solid' : 'light'}
						color="primary"
						onPress={() => setActiveTab('scheduled')}
					>
						Sesiones Programadas
					</Button>
					<Button
						variant={activeTab === 'availability' ? 'solid' : 'light'}
						color="primary"
						onPress={() => setActiveTab('availability')}
					>
						Configurar Disponibilidad
					</Button>
				</div>
			</div>

			{/* Contenido de Sesiones Programadas */}
			{activeTab === 'scheduled' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Próximas Sesiones</h2>
						{!isLoading && !isError && (
							<Chip color="success" variant="flat">
								{confirmedSessions.length} sesiones
							</Chip>
						)}
					</div>

					{/* Loading State */}
					{isLoading && (
						<Card>
							<CardBody className="text-center py-12">
								<Spinner size="lg" />
								<p className="text-default-500 mt-4">Cargando sesiones...</p>
							</CardBody>
						</Card>
					)}

					{/* Error State */}
					{isError && (
						<Card>
							<CardBody className="text-center py-12">
								<AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2 text-danger">
									Error al cargar sesiones
								</h3>
								<p className="text-default-500">
									{error?.message || 'Ocurrió un error inesperado'}
								</p>
							</CardBody>
						</Card>
					)}

					{/* Sesiones disponibles */}
					{!isLoading && !isError && confirmedSessions.length > 0 && (
						<div className="grid gap-4">
							{confirmedSessions.map((session) => {
								const sessionDate = new Date(session.scheduledAt);
								const isVirtual = session.mode === 'VIRTUAL';

								return (
									<Card key={session.sessionId}>
										<CardBody>
											<div className="flex items-start justify-between">
												<div className="space-y-2">
													<div className="flex items-center gap-3">
														<Avatar
															name={session.studentName}
															size="sm"
															showFallback
														/>
														<div>
															<h3 className="font-semibold">
																{session.studentName}
															</h3>
															<Chip size="sm" color="primary" variant="flat">
																{session.subjectCode} - {session.subjectName}
															</Chip>
														</div>
													</div>

													{session.comentarios && (
														<p className="text-default-600 ml-11 text-sm">
															{session.comentarios}
														</p>
													)}

													<div className="flex items-center gap-4 text-sm text-default-500 ml-11">
														<div className="flex items-center gap-1">
															<Calendar className="w-4 h-4" />
															{sessionDate.toLocaleDateString('es-CO', {
																weekday: 'long',
																year: 'numeric',
																month: 'long',
																day: 'numeric',
															})}
														</div>
														<div className="flex items-center gap-1">
															<Clock className="w-4 h-4" />
															{session.startTime} - {session.endTime}
														</div>
														<div className="flex items-center gap-1">
															{isVirtual ? (
																<Video className="w-4 h-4" />
															) : (
																<MapPin className="w-4 h-4" />
															)}
															<span className="capitalize">{session.mode}</span>
															{isVirtual && session.linkConexion && (
																<span>- Virtual</span>
															)}
															{!isVirtual && session.lugar && (
																<span>- {session.lugar}</span>
															)}
														</div>
													</div>
												</div>

												<div className="flex gap-2">
													{isVirtual && session.linkConexion && (
														<Button
															as="a"
															href={session.linkConexion}
															target="_blank"
															rel="noopener noreferrer"
															size="sm"
															color="primary"
															variant="flat"
														>
															Unirse
														</Button>
													)}
													<Button
														size="sm"
														color="success"
														variant="flat"
														startContent={<CheckCircle className="w-4 h-4" />}
														onPress={() =>
															handleCompleteSession(session.sessionId)
														}
													>
														Completar
													</Button>
												</div>
											</div>
										</CardBody>
									</Card>
								);
							})}
						</div>
					)}

					{/* Empty State */}
					{!isLoading && !isError && confirmedSessions.length === 0 && (
						<Card>
							<CardBody className="text-center py-12">
								<Calendar className="w-12 h-12 text-default-300 mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2">
									Sin sesiones programadas
								</h3>
								<p className="text-default-500">
									Las sesiones confirmadas aparecerán aquí.
								</p>
							</CardBody>
						</Card>
					)}
				</div>
			)}

			{/* Modal para completar sesión */}
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalContent>
					<ModalHeader>
						<h3 className="text-lg font-semibold">Completar Sesión</h3>
					</ModalHeader>
					<ModalBody>
						{completeSessionMutation.isError && (
							<Card className="bg-danger-50 border-danger-200">
								<CardBody className="flex flex-row items-center gap-2">
									<AlertCircle className="w-5 h-5 text-danger" />
									<p className="text-sm text-danger">
										{completeSessionMutation.error?.message ||
											'Error al completar la sesión'}
									</p>
								</CardBody>
							</Card>
						)}

						<p className="text-default-600">
							¿Estás seguro de marcar esta sesión como completada?
						</p>

						<Textarea
							label="Comentarios (opcional)"
							placeholder="Agrega comentarios sobre la sesión..."
							value={comentarios}
							onValueChange={setComentarios}
							minRows={3}
							maxRows={5}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="light"
							onPress={onClose}
							isDisabled={completeSessionMutation.isPending}
						>
							Cancelar
						</Button>
						<Button
							color="success"
							onPress={handleConfirmComplete}
							isLoading={completeSessionMutation.isPending}
							startContent={
								!completeSessionMutation.isPending && (
									<CheckCircle className="w-4 h-4" />
								)
							}
						>
							Confirmar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Contenido de Disponibilidad */}
			{activeTab === 'availability' && (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Configurar Disponibilidad</h2>
						<Button
							color="success"
							startContent={<Save className="w-4 h-4" />}
							onPress={handleSaveAvailability}
							isLoading={updateAvailabilityMutation.isPending}
							isDisabled={
								hasAvailabilityErrors() || updateAvailabilityMutation.isPending
							}
						>
							Guardar Disponibilidad
						</Button>
					</div>

					{/* Feedback de éxito o error */}
					{updateAvailabilityMutation.isSuccess && (
						<Card className="bg-success-50 border-success-200">
							<CardBody className="flex flex-row items-center gap-2">
								<CheckCircle className="w-5 h-5 text-success" />
								<p className="text-sm text-success">
									Disponibilidad actualizada exitosamente
								</p>
							</CardBody>
						</Card>
					)}

					{updateAvailabilityMutation.isError && (
						<Card className="bg-danger-50 border-danger-200">
							<CardBody className="flex flex-row items-center gap-2">
								<AlertCircle className="w-5 h-5 text-danger" />
								<p className="text-sm text-danger">
									{updateAvailabilityMutation.error?.message ||
										'Error al actualizar disponibilidad'}
								</p>
							</CardBody>
						</Card>
					)}

					{/* Loading State */}
					{isLoadingAvailability && (
						<Card>
							<CardBody className="text-center py-12">
								<Spinner size="lg" />
								<p className="text-default-500 mt-4">
									Cargando disponibilidad...
								</p>
							</CardBody>
						</Card>
					)}

					{/* Error State */}
					{isErrorAvailability && (
						<Card>
							<CardBody className="text-center py-12">
								<AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2 text-danger">
									Error al cargar disponibilidad
								</h3>
								<p className="text-default-500">
									No se pudo cargar tu disponibilidad actual
								</p>
							</CardBody>
						</Card>
					)}

					{/* Formulario de disponibilidad */}
					{!isLoadingAvailability && !isErrorAvailability && (
						<div className="space-y-4">
							{DAYS.map((day) => (
								<DayAvailabilityEditor
									key={day.key}
									dayLabel={day.label}
									dayKey={day.key}
									slots={availability[day.key as keyof DisponibilidadSemanal]}
									onAddSlot={() =>
										addTimeSlot(day.key as keyof DisponibilidadSemanal)
									}
									onRemoveSlot={(index) =>
										removeTimeSlot(
											day.key as keyof DisponibilidadSemanal,
											index,
										)
									}
									onUpdateSlot={(index, field, value) =>
										updateTimeSlot(
											day.key as keyof DisponibilidadSemanal,
											index,
											field,
											value,
										)
									}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
