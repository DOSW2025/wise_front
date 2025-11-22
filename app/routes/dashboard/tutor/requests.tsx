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

interface SessionRequest {
	id: string;
	studentName: string;
	studentAvatar?: string;
	subject: string;
	topic: string;
	date: string;
	time: string;
	duration: number;
	modality: 'presencial' | 'virtual';
	location?: string;
	description: string;
	status: 'pending' | 'confirmed' | 'cancelled';
	createdAt: string;
}

export default function TutorRequests() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedRequest, setSelectedRequest] = useState<SessionRequest | null>(
		null,
	);
	const [actionType, setActionType] = useState<'confirm' | 'cancel'>('confirm');
	const [responseMessage, setResponseMessage] = useState('');

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const [requests, setRequests] = useState<SessionRequest[]>([
		{
			id: '-1',
			studentName: 'Estudiante Ejemplo (Sin conexión)',
			subject: 'Sin datos de API',
			topic: 'Esperando conexión',
			date: '1900-01-01',
			time: '00:00',
			duration: -1,
			modality: 'virtual',
			description:
				'Este es un ejemplo con valores negativos. Conectar con API.',
			status: 'pending',
			createdAt: '1900-01-01',
		},
	]);

	const handleAction = (
		request: SessionRequest,
		action: 'confirm' | 'cancel',
	) => {
		setSelectedRequest(request);
		setActionType(action);
		setResponseMessage('');
		onOpen();
	};

	const confirmAction = () => {
		if (selectedRequest) {
			setRequests(
				requests.map((req) =>
					req.id === selectedRequest.id
						? {
								...req,
								status: actionType === 'confirm' ? 'confirmed' : 'cancelled',
							}
						: req,
				),
			);
			onClose();
		}
	};

	const pendingRequests = requests.filter((req) => req.status === 'pending');

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
							{pendingRequests.length}
						</div>
						<div className="text-sm text-default-500">Pendientes</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody className="text-center">
						<div className="text-2xl font-bold text-success">
							{requests.filter((r) => r.status === 'confirmed').length}
						</div>
						<div className="text-sm text-default-500">Confirmadas</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody className="text-center">
						<div className="text-2xl font-bold text-danger">
							{requests.filter((r) => r.status === 'cancelled').length}
						</div>
						<div className="text-sm text-default-500">Canceladas</div>
					</CardBody>
				</Card>
			</div>

			{/* Lista de solicitudes */}
			<div className="space-y-4">
				{pendingRequests.length > 0 ? (
					pendingRequests.map((request) => (
						<Card
							key={request.id}
							className="hover:shadow-md transition-shadow"
						>
							<CardHeader className="pb-2">
								<div className="flex items-start justify-between w-full">
									<div className="flex items-center gap-3">
										<Avatar
											src={request.studentAvatar}
											name={request.studentName}
											size="md"
											showFallback
										/>
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
												<span className="font-medium">{request.subject}</span>
											</div>
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4 text-default-500" />
												<span className="text-sm">
													{new Date(request.date).toLocaleDateString()} a las{' '}
													{request.time}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="w-4 h-4 text-default-500" />
												<span className="text-sm">
													{request.duration} minutos
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												{request.modality === 'virtual' ? (
													<Video className="w-4 h-4 text-success" />
												) : (
													<MapPin className="w-4 h-4 text-primary" />
												)}
												<span className="text-sm capitalize">
													{request.modality}
												</span>
												{request.location && (
													<span className="text-sm text-default-500">
														- {request.location}
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Tema y descripción */}
									<div className="space-y-2">
										<div>
											<span className="font-medium text-sm">Tema: </span>
											<span className="text-sm">{request.topic}</span>
										</div>
										<div>
											<span className="font-medium text-sm">Descripción: </span>
											<p className="text-sm text-default-600 mt-1">
												{request.description}
											</p>
										</div>
									</div>

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
					<Card>
						<CardBody className="text-center py-12">
							<CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">¡Todo al día!</h3>
							<p className="text-default-500">
								No tienes solicitudes pendientes por revisar.
							</p>
						</CardBody>
					</Card>
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
										{selectedRequest.subject} - {selectedRequest.topic}
									</p>
									<p className="text-sm text-default-500">
										{new Date(selectedRequest.date).toLocaleDateString()} a las{' '}
										{selectedRequest.time}
									</p>
								</div>
								<Textarea
									label={
										actionType === 'confirm'
											? 'Mensaje de confirmación (opcional)'
											: 'Motivo del rechazo'
									}
									placeholder={
										actionType === 'confirm'
											? 'Mensaje para el estudiante...'
											: 'Explica brevemente el motivo del rechazo...'
									}
									value={responseMessage}
									onValueChange={setResponseMessage}
									minRows={3}
								/>
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Cancelar
						</Button>
						<Button
							color={actionType === 'confirm' ? 'success' : 'danger'}
							onPress={confirmAction}
						>
							{actionType === 'confirm'
								? 'Confirmar Tutoría'
								: 'Rechazar Solicitud'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
