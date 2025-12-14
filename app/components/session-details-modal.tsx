/**
 * SessionDetailsModal Component
 * Modal compartido para mostrar los detalles de una sesión de tutoría
 */

import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { Calendar, Clock } from 'lucide-react';
import React from 'react';
import type { UpcomingSession } from '~/lib/types/tutoria.types';

interface SessionDetailsModalProps {
	session: UpcomingSession | null;
	isOpen: boolean;
	onClose: () => void;
	showCancelButton?: boolean;
	onRequestCancel?: () => void;
}

const getAvatarBg = (name: string): string => {
	// Generar un color basado en el nombre
	const colors = [
		'bg-red-500',
		'bg-orange-500',
		'bg-purple-500',
		'bg-green-500',
		'bg-blue-500',
	];
	const index = (name.codePointAt(0) ?? 0) % colors.length;
	return colors[index];
};

const getInitials = (name: string): string => {
	const parts = name.split(' ').filter(Boolean);
	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
};

const getDayLabel = (day: string): string => {
	const days: Record<string, string> = {
		monday: 'Lunes',
		tuesday: 'Martes',
		wednesday: 'Miércoles',
		thursday: 'Jueves',
		friday: 'Viernes',
		saturday: 'Sábado',
		sunday: 'Domingo',
	};
	return days[day.toLowerCase()] ?? day;
};

export function SessionDetailsModal({
	session,
	isOpen,
	onClose,
	showCancelButton = false,
	onRequestCancel,
}: SessionDetailsModalProps) {
	if (!session) return null;

	const sessionDate = new Date(session.date);
	const dateLabel = sessionDate.toLocaleDateString('en-US', {
		month: 'numeric',
		day: 'numeric',
		year: 'numeric',
	});

	const dayLabel = getDayLabel(session.day);
	const initials = getInitials(session.tutorName);
	const avatarBg = getAvatarBg(session.tutorName);

	// Calcular duración y endTime (asumiendo 1 hora por defecto)
	const [startHours, startMinutes] = session.startTime.split(':').map(Number);
	const endTime = `${String(startHours + 1).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;
	const duration = 60;

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
			size="lg"
		>
			<ModalContent>
				{(onCloseModal) => {
					const handleClose = () => {
						onClose();
						onCloseModal();
					};

					return (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<span>Detalle de tutoría</span>
								<span className="text-sm text-default-500">
									{session.subjectName}
								</span>
							</ModalHeader>
							<ModalBody className="space-y-4">
								{/* Header con avatar y info del tutor */}
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<div className="flex items-center gap-3">
											<div
												className={`${avatarBg} w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold`}
											>
												{initials}
											</div>
											<div>
												<h3 className="font-semibold">{session.tutorName}</h3>
												<div className="flex gap-2 mt-1 flex-wrap">
													<Chip size="sm" color="primary" variant="flat">
														{session.subjectName}
													</Chip>
												</div>
												<p className="text-sm text-default-700 mt-1">
													{session.studentName}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Información de fecha y hora */}
								<div className="flex flex-wrap gap-4 text-sm text-default-700 ml-11">
									<div className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										{dateLabel} ({dayLabel})
									</div>
									<div className="flex items-center gap-1">
										<Clock className="w-4 h-4" />
										{session.startTime} - {endTime} ({duration} min)
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button variant="light" onPress={handleClose}>
									Cerrar
								</Button>
								{showCancelButton && onRequestCancel && (
									<Button
										color="danger"
										variant="flat"
										onPress={() => {
											onRequestCancel();
											handleClose();
										}}
									>
										Cancelar tutoría
									</Button>
								)}
							</ModalFooter>
						</>
					);
				}}
			</ModalContent>
		</Modal>
	);
}
