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
	Calendar,
	CheckCircle,
	Clock,
	MapPin,
	User,
	Video,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState, FeedbackModal } from '~/components';
import { useAuth } from '~/contexts/auth-context';
import { usePendingSessions } from '~/lib/hooks/usePendingSessions';
import { useTutoriaStats } from '~/lib/hooks/useTutoriaStats';
import type { PendingSession } from '~/lib/types/tutoria.types';
import { getErrorMessage } from '~/lib/utils/error-messages';
import { useConfirmSession } from '~/routes/dashboard/tutor/hooks/useConfirmSession';
import { useRejectSession } from '~/routes/dashboard/tutor/hooks/useRejectSession';

const DAY_LABELS: Record<string, string> = {
	monday: 'Lunes',
	tuesday: 'Martes',
	wednesday: 'Miércoles',
	thursday: 'Jueves',
	friday: 'Viernes',
	saturday: 'Sábado',
	sunday: 'Domingo',
};

export default function TutorRequests() {
	const { user } = useAuth();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedRequest, setSelectedRequest] = useState<PendingSession | null>(
		null,
	);
	const [actionType, setActionType] = useState<'confirm' | 'cancel'>('confirm');
	const [responseMessage, setResponseMessage] = useState('');
	const [feedback, setFeedback] = useState<{
		isOpen: boolean;
		type: 'success' | 'error';
		message: string;
	}>({
		isOpen: false,
		type: 'success',
		message: '',
	});

	const {
		data: pendingSessions = [],
		isLoading,
		isError,
	} = usePendingSessions(user?.id || '', !!user?.id);

	const { data: stats } = useTutoriaStats(user?.id || '', !!user?.id);

	const { mutate: confirmSession, isPending: isConfirming } =
		useConfirmSession();

	const { mutate: rejectSession, isPending: isRejecting } = useRejectSession();

	const handleAction = (
		request: PendingSession,
		action: 'confirm' | 'cancel',
	) => {
		setSelectedRequest(request);
		setActionType(action);
		setResponseMessage('');
		onOpen();
	};

	const confirmAction = () => {
		if (!selectedRequest || !user?.id) return;

		if (actionType === 'confirm') {
			confirmSession(
				{
					sessionId: selectedRequest.sessionId,
					tutorId: user.id,
				},
				{
					onSuccess: () => {
						onClose();
						setFeedback({
							isOpen: true,
							type: 'success',
							message: `Tutoría con ${selectedRequest.studentName} confirmada exitosamente`,
						});
					},
					onError: (error) => {
						setFeedback({
							isOpen: true,
							type: 'error',
							message: getErrorMessage(error),
						});
					},
				},
			);
		} else {
			// Validar que se haya ingresado una razón
			if (!responseMessage.trim()) {
				setFeedback({
					isOpen: true,
					type: 'error',
					message: 'Debes proporcionar una razón para rechazar la solicitud',
				});
				return;
			}

			rejectSession(
				{
					sessionId: selectedRequest.sessionId,
					tutorId: user.id,
					razon: responseMessage.trim(),
				},
				{
					onSuccess: () => {
						onClose();
						setResponseMessage('');
						setFeedback({
							isOpen: true,
							type: 'success',
							message: `Solicitud de ${selectedRequest.studentName} rechazada`,
						});
					},
					onError: (error) => {
						setFeedback({
							isOpen: true,
							type: 'error',
							message: getErrorMessage(error),
						});
					},
				},
			);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Spinner size="lg" label="Cargando solicitudes..." />
			</div>
		);
	}

	if (isError) {
		return (
			<EmptyState
				title="Error al cargar solicitudes"
				description="No se pudieron obtener las solicitudes pendientes. Intenta recargar la página."
				icon={<X className="w-12 h-12" />}
			/>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Solicitudes Pendientes
				</h1>
				<p className="text-default-500">
					Revisa y gestiona las solicitudes de tutoría de los estudiantes.
				</p>
			</div>

			{/* Estadísticas rápidas */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardBody className="text-center">
						<div className="text-2xl font-bold text-warning">
							{stats?.sesionesPendientes ?? 0}
						</div>
						<div className="text-sm text-default-500">Pendientes</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody className="text-center">
						<div className="text-2xl font-bold text-success">
							{stats?.sesionesConfirmadas ?? 0}
						</div>
						<div className="text-sm text-default-500">Confirmadas</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody className="text-center">
						<div className="text-2xl font-bold text-danger">
							{stats?.sesionesRechazadas ?? 0}
						</div>
						<div className="text-sm text-default-500">Rechazadas</div>
					</CardBody>
				</Card>
			</div>

			{/* Lista de solicitudes */}
			<div className="space-y-4">
				{pendingSessions.length > 0 ? (
					pendingSessions.map((request) => (
						<Card
							key={request.sessionId}
							className="hover:shadow-md transition-shadow"
						>
							<CardHeader className="pb-2">
								<div className="flex items-start justify-between w-full">
									<div className="flex items-center gap-3">
										<Avatar name={request.studentName} size="md" showFallback />
										<div>
											<h3 className="font-semibold text-lg">
												{request.studentName}
											</h3>
											<p className="text-default-500 text-sm">
												Solicitud del{' '}
												{new Date(request.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									<Chip color="warning" variant="flat" size="sm">
										Pendiente
									</Chip>
								</div>
							</CardHeader>
							<CardBody className="pt-0">
								<div className="space-y-4">
									{/* Información de la sesión */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<User className="w-4 h-4 text-primary" />
												<span className="font-medium">
													{request.subjectCode} - {request.subjectName}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4 text-default-500" />
												<span className="text-sm">
													{DAY_LABELS[request.day]} -{' '}
													{new Date(request.scheduledAt).toLocaleDateString(
														'es-ES',
														{
															day: '2-digit',
															month: 'short',
															year: 'numeric',
														},
													)}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="w-4 h-4 text-default-500" />
												<span className="text-sm">
													{request.startTime} - {request.endTime}
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												{request.mode === 'VIRTUAL' ? (
													<Video className="w-4 h-4 text-success" />
												) : (
													<MapPin className="w-4 h-4 text-primary" />
												)}
												<span className="text-sm">
													{request.mode === 'VIRTUAL'
														? 'Virtual'
														: 'Presencial'}
												</span>
											</div>
										</div>
									</div>

									{/* Comentarios del estudiante */}
									{request.comentarios && (
										<div className="bg-default-100 rounded-lg p-3">
											<p className="text-sm font-medium mb-1">
												Comentarios del estudiante:
											</p>
											<p className="text-sm text-default-600">
												{request.comentarios}
											</p>
										</div>
									)}

									{/* Botones de acción */}
									<div className="flex gap-2 pt-2">
										<Button
											color="success"
											variant="flat"
											startContent={<CheckCircle className="w-4 h-4" />}
											onPress={() => handleAction(request, 'confirm')}
										>
											Confirmar
										</Button>
										<Button
											color="danger"
											variant="flat"
											startContent={<X className="w-4 h-4" />}
											onPress={() => handleAction(request, 'cancel')}
										>
											Rechazar
										</Button>
									</div>
								</div>
							</CardBody>
						</Card>
					))
				) : (
					<EmptyState
						title="¡Todo al día!"
						description="No tienes solicitudes pendientes por revisar."
						icon={<CheckCircle className="w-12 h-12" />}
					/>
				)}
			</div>

			{/* Modal de confirmación */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					<ModalHeader>
						{actionType === 'confirm'
							? 'Confirmar Tutoría'
							: 'Rechazar Solicitud'}
					</ModalHeader>
					<ModalBody>
						{selectedRequest && (
							<div className="space-y-4">
								<div className="p-3 bg-default-100 rounded-lg">
									<p className="font-medium">{selectedRequest.studentName}</p>
									<p className="text-sm text-default-600">
										{selectedRequest.subjectCode} -{' '}
										{selectedRequest.subjectName}
									</p>
									<p className="text-sm text-default-500">
										{DAY_LABELS[selectedRequest.day]} -{' '}
										{new Date(selectedRequest.scheduledAt).toLocaleDateString(
											'es-ES',
											{
												day: '2-digit',
												month: 'short',
												year: 'numeric',
											},
										)}{' '}
										- {selectedRequest.startTime} a {selectedRequest.endTime}
									</p>
								</div>
								{actionType === 'cancel' && (
									<Textarea
										label="Motivo del rechazo"
										placeholder="Explica brevemente el motivo del rechazo..."
										value={responseMessage}
										onValueChange={setResponseMessage}
										minRows={3}
									/>
								)}
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							variant="light"
							onPress={onClose}
							isDisabled={isConfirming || isRejecting}
						>
							Cancelar
						</Button>
						<Button
							color={actionType === 'confirm' ? 'success' : 'danger'}
							onPress={confirmAction}
							isLoading={isConfirming || isRejecting}
							isDisabled={isConfirming || isRejecting}
						>
							{actionType === 'confirm'
								? 'Confirmar Tutoría'
								: 'Rechazar Solicitud'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Modal de Feedback */}
			<FeedbackModal
				isOpen={feedback.isOpen}
				onClose={() => setFeedback({ ...feedback, isOpen: false })}
				type={feedback.type}
				message={feedback.message}
			/>
		</div>
	);
}
