import {
	Avatar,
	Button,
	Card,
	CardBody,
	Chip,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import {
	AlertCircle,
	Calendar,
	Clock,
	MapPin,
	Trash2,
	Video,
} from 'lucide-react';
import { useState } from 'react';

export interface ScheduledTutoring {
	id: string;
	tutorId: number;
	tutorName: string;
	tutorAvatar?: string;
	subject: string;
	date: string;
	time: string;
	modality: 'presencial' | 'virtual';
	location?: string;
	meetLink?: string;
	studentNotes?: string;
}

interface Props {
	tutorings: ScheduledTutoring[];
	isOpen: boolean;
	onClose: () => void;
	onCancel: (id: string) => void;
}

export default function ScheduledTutoringsModal({
	tutorings,
	isOpen,
	onClose,
	onCancel,
}: Readonly<Props>) {
	const [cancellingId, setCancellingId] = useState<string | null>(null);

	const handleCancelClick = (id: string) => {
		setCancellingId(id);
	};

	const handleConfirmCancel = () => {
		if (cancellingId) {
			onCancel(cancellingId);
			setCancellingId(null);
		}
	};

	const handleCancelDismiss = () => {
		setCancellingId(null);
	};

	if (tutorings.length === 0) {
		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					<ModalHeader>Mis Tutorías Agendadas</ModalHeader>
					<ModalBody>
						<div className="flex flex-col items-center justify-center py-8 gap-3">
							<div className="text-5xl text-default-300">📅</div>
							<p className="text-default-500 text-center">
								No tienes tutorías agendadas aún.
							</p>
							<p className="text-sm text-default-400 text-center">
								Haz click en una tarjeta de tutor para agendar tu primera
								tutoría.
							</p>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onPress={onClose}>
							Cerrar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	}

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalContent>
					<ModalHeader>Mis Tutorías Agendadas</ModalHeader>
					<ModalBody>
						<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
							{tutorings.map((tutoring) => {
								const isVirtual = tutoring.modality === 'virtual';
								return (
									<Card key={tutoring.id} className="border border-default-200">
										<CardBody className="p-4">
											{/* Tutor info */}
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-center gap-3">
													<Avatar
														name={tutoring.tutorName}
														size="md"
														className="bg-primary text-white"
													/>
													<div>
														<div className="font-semibold text-foreground">
															{tutoring.tutorName}
														</div>
														<div className="text-sm text-default-500">
															{tutoring.subject}
														</div>
													</div>
												</div>
												<Chip
													variant="flat"
													color={isVirtual ? 'primary' : 'secondary'}
												>
													{isVirtual ? 'Virtual' : 'Presencial'}
												</Chip>
											</div>

											<Divider className="my-2" />

											{/* Fecha y hora */}
											<div className="space-y-2 text-sm">
												<div className="flex items-center gap-2 text-default-600">
													<Calendar className="w-4 h-4" />
													<span>{tutoring.date}</span>
												</div>
												<div className="flex items-center gap-2 text-default-600">
													<Clock className="w-4 h-4" />
													<span>{tutoring.time}</span>
												</div>

												{/* Ubicación o link según modalidad */}
												{tutoring.modality === 'virtual' &&
													tutoring.meetLink && (
														<div className="flex items-center gap-2 text-default-600">
															<Video className="w-4 h-4" />
															<a
																href={tutoring.meetLink}
																target="_blank"
																rel="noopener noreferrer"
																className="text-primary hover:underline text-xs"
															>
																Unirse a la videollamada
															</a>
														</div>
													)}
												{tutoring.modality === 'presencial' &&
													tutoring.location && (
														<div className="flex items-center gap-2 text-default-600">
															<MapPin className="w-4 h-4" />
															<span>{tutoring.location}</span>
														</div>
													)}
											</div>

											{/* Notas del estudiante */}
											{tutoring.studentNotes && (
												<>
													<Divider className="my-2" />
													<div>
														<p className="text-xs font-medium text-default-500 mb-1">
															Notas:
														</p>
														<p className="text-sm text-default-600">
															{tutoring.studentNotes}
														</p>
													</div>
												</>
											)}

											{/* Botón cancelar */}
											<div className="flex justify-end mt-3">
												<Button
													isIconOnly
													variant="light"
													color="danger"
													size="sm"
													onPress={() => handleCancelClick(tutoring.id)}
													aria-label="Cancelar tutoría"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</CardBody>
									</Card>
								);
							})}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onPress={onClose}>
							Cerrar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* Modal de confirmación de cancelación */}
			<Modal isOpen={cancellingId !== null} onClose={handleCancelDismiss}>
				<ModalContent>
					<ModalHeader className="flex items-center gap-2">
						<AlertCircle className="w-5 h-5 text-danger" />
						Cancelar Tutoría
					</ModalHeader>
					<ModalBody>
						<p className="text-default-600">
							¿Estás seguro de que deseas cancelar esta tutoría?
						</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={handleCancelDismiss}>
							No, mantenerla
						</Button>
						<Button color="danger" onPress={handleConfirmCancel}>
							Sí, cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
