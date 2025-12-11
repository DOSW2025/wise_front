import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
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
	Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '~/contexts/auth-context';
import { useCompleteSession } from './hooks/useCompleteSession';
import { useConfirmedSessions } from './hooks/useConfirmedSessions';

interface AvailabilitySlot {
	day: string;
	startTime: string;
	endTime: string;
	isAvailable: boolean;
}

const DAYS = [
	{ key: 'monday', label: 'Lunes' },
	{ key: 'tuesday', label: 'Martes' },
	{ key: 'wednesday', label: 'Miércoles' },
	{ key: 'thursday', label: 'Jueves' },
	{ key: 'friday', label: 'Viernes' },
	{ key: 'saturday', label: 'Sábado' },
];

// Generar horarios automáticamente
const generateTimeSlots = () => {
	const slots: AvailabilitySlot[] = [];

	DAYS.forEach((day) => {
		const endHour = day.key === 'saturday' ? 13 : 19; // Sábado hasta 1pm, otros hasta 7pm

		for (let hour = 7; hour < endHour; hour += 1.5) {
			const startHour = Math.floor(hour);
			const startMinutes = (hour % 1) * 60;
			const endHour = Math.floor(hour + 1.5);
			const endMinutes = ((hour + 1.5) % 1) * 60;

			const startTime = `${startHour.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
			const endTime = `${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

			slots.push({
				day: day.key,
				startTime,
				endTime,
				isAvailable: false,
			});
		}
	});

	return slots;
};

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

	const [availabilitySlots, setAvailabilitySlots] = useState<
		AvailabilitySlot[]
	>(generateTimeSlots());

	const toggleSlotAvailability = (day: string, startTime: string) => {
		setAvailabilitySlots((prev) =>
			prev.map((slot) =>
				slot.day === day && slot.startTime === startTime
					? { ...slot, isAvailable: !slot.isAvailable }
					: slot,
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
						<p className="text-sm text-default-500">
							Haz clic en los horarios para cambiar tu disponibilidad
						</p>
					</div>

					{/* Horarios por día */}
					<div className="space-y-4">
						{DAYS.map((day) => {
							const daySlots = availabilitySlots.filter(
								(slot) => slot.day === day.key,
							);
							const availableCount = daySlots.filter(
								(slot) => slot.isAvailable,
							).length;

							return (
								<Card key={day.key}>
									<CardHeader className="pb-3">
										<div className="flex items-center gap-3">
											<h3 className="text-lg font-semibold min-w-[100px]">
												{day.label}
											</h3>
											<Chip
												size="sm"
												variant="flat"
												color={availableCount > 0 ? 'success' : 'default'}
											>
												{availableCount} disponibles
											</Chip>
										</div>
									</CardHeader>
									<CardBody className="pt-0">
										<div className="flex flex-wrap gap-2">
											{daySlots.map((slot) => (
												<button
													type="button"
													key={`${slot.day}-${slot.startTime}`}
													onClick={() =>
														toggleSlotAvailability(slot.day, slot.startTime)
													}
													className={`
														p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
														min-w-[100px] text-center
														${
															slot.isAvailable
																? 'bg-green-100 border-green-300 hover:bg-green-200'
																: 'bg-red-50 border-red-200 hover:bg-red-100'
														}
													`}
												>
													<div className="text-xs font-medium text-gray-600 mb-1">
														{slot.startTime} - {slot.endTime}
													</div>
													<div
														className={`text-xs font-semibold ${
															slot.isAvailable
																? 'text-green-800'
																: 'text-red-600'
														}`}
													>
														{slot.isAvailable ? 'Disponible' : 'Ocupado'}
													</div>
												</button>
											))}
										</div>
									</CardBody>
								</Card>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
