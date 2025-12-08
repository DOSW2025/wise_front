import {
	Avatar,
	Badge,
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Textarea,
} from '@heroui/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCreateSession } from '~/lib/hooks/useCreateSession';
import { useTutorMaterias } from '~/lib/hooks/useTutorMaterias';
import type {
	CreateSessionRequest,
	DisponibilidadSlot,
	WeekDay,
} from '~/lib/types/tutoria.types';

interface Tutor {
	id: number;
	tutorId?: string;
	name: string;
	title: string;
	department: string;
	avatarInitials: string;
	avatarColor?: string;
	rating: number;
	reviews: number;
	tags: string[];
	availability: string;
	isAvailableToday: boolean;
	timeSlots?: string[];
	disponibilidad?: Record<WeekDay, DisponibilidadSlot[]>;
}

interface ScheduleSlot {
	day: WeekDay;
	dayLabel: string;
	startTime: string;
	endTime: string;
	mode: 'VIRTUAL' | 'PRESENCIAL' | 'HIBRIDA';
	lugar: string;
}

interface Props {
	tutor: Tutor | null;
	isOpen: boolean;
	onClose: () => void;
	studentId: string;
	onSuccess?: () => void;
}

const DAY_LABELS: Record<WeekDay, string> = {
	monday: 'Lunes',
	tuesday: 'Martes',
	wednesday: 'Miércoles',
	thursday: 'Jueves',
	friday: 'Viernes',
	saturday: 'Sábado',
	sunday: 'Domingo',
};

const MODE_COLORS: Record<string, 'success' | 'primary' | 'warning'> = {
	VIRTUAL: 'primary',
	PRESENCIAL: 'success',
	HIBRIDA: 'warning',
};

export default function TutorScheduleModal({
	tutor,
	isOpen,
	onClose,
	studentId,
	onSuccess,
}: Props) {
	const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
	const [comentarios, setComentarios] = useState('');
	const [codigoMateria, setCodigoMateria] = useState('');

	const { mutate: createSession, isPending } = useCreateSession();
	const { data: materiasData, isLoading: isLoadingMaterias } = useTutorMaterias(
		tutor?.tutorId,
		isOpen,
	);

	useEffect(() => {
		if (isOpen && tutor) {
			setSelectedSlot(null);
			setComentarios('');
			setCodigoMateria('');
		}
	}, [isOpen, tutor]);

	const handleConfirm = () => {
		if (!tutor?.tutorId || !selectedSlot) {
			alert('Por favor selecciona un horario disponible.');
			return;
		}

		if (!codigoMateria.trim()) {
			alert('Por favor selecciona la materia de la tutoría.');
			return;
		}

		// Construir scheduledAt en formato ISO
		const now = new Date();
		const [hours, minutes] = selectedSlot.startTime.split(':').map(Number);

		// Calcular la fecha de la próxima ocurrencia del día seleccionado
		const dayIndex = [
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
		].indexOf(selectedSlot.day);
		const currentDay = now.getDay();
		const daysUntilTarget = (dayIndex - currentDay + 7) % 7 || 7;

		const targetDate = new Date(now);
		targetDate.setDate(now.getDate() + daysUntilTarget);
		targetDate.setHours(hours, minutes, 0, 0);

		const request: CreateSessionRequest = {
			tutorId: tutor.tutorId,
			studentId,
			codigoMateria,
			scheduledAt: targetDate.toISOString(),
			day: selectedSlot.day,
			startTime: selectedSlot.startTime,
			endTime: selectedSlot.endTime,
			mode: selectedSlot.mode as 'VIRTUAL' | 'PRESENCIAL',
			comentarios: comentarios || undefined,
		};

		createSession(request, {
			onSuccess: () => {
				alert(`¡Tutoría agendada exitosamente con ${tutor.name}!`);
				onSuccess?.();
				onClose();
			},
			onError: (error) => {
				alert(`Error al agendar: ${error.message}`);
			},
		});
	};

	if (!tutor) return null;

	// Convertir disponibilidad a slots organizados
	const scheduleSlots: ScheduleSlot[] = [];
	if (tutor.disponibilidad) {
		Object.entries(tutor.disponibilidad).forEach(([day, slots]) => {
			slots.forEach((slot) => {
				scheduleSlots.push({
					day: day as WeekDay,
					dayLabel: DAY_LABELS[day as WeekDay],
					startTime: slot.start,
					endTime: slot.end,
					mode: slot.modalidad,
					lugar: slot.lugar,
				});
			});
		});
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="2xl">
			<ModalContent>
				<ModalHeader>
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center gap-3">
							<Avatar name={tutor.avatarInitials} size="md" />
							<div>
								<div className="text-lg font-semibold">{tutor.name}</div>
								<div className="text-sm text-default-500">{tutor.title}</div>
							</div>
						</div>
						<button
							type="button"
							aria-label="Cerrar"
							onClick={onClose}
							className="text-default-400"
						>
							<X />
						</button>
					</div>
				</ModalHeader>
				<ModalBody>
					<div className="space-y-4">
						{/* Tags de modalidad y materias */}
						<div>
							<h4 className="font-medium mb-2 text-sm text-default-600">
								Modalidades disponibles
							</h4>
							<div className="flex gap-2 flex-wrap mb-3">
								{tutor.tags.map((t) => (
									<Chip key={t} variant="flat" color="primary" size="sm">
										{t}
									</Chip>
								))}
							</div>

							<h4 className="font-medium mb-2 text-sm text-default-600">
								Materias que puede dictar
							</h4>
							<div className="flex gap-2 flex-wrap">
								{(() => {
									if (isLoadingMaterias) {
										return (
											<span className="text-sm text-default-400">
												Cargando materias...
											</span>
										);
									}

									if (
										materiasData?.materias &&
										materiasData.materias.length > 0
									) {
										return materiasData.materias.map((materia) => (
											<Chip
												key={materia.codigo}
												variant="flat"
												color="secondary"
												size="sm"
											>
												{materia.codigo}
											</Chip>
										));
									}

									return (
										<span className="text-sm text-default-400">
											No hay materias disponibles
										</span>
									);
								})()}
							</div>
						</div>
						{/* Horarios disponibles */}
						<div>
							<h4 className="font-medium mb-3">Horarios disponibles</h4>
							{scheduleSlots.length === 0 ? (
								<p className="text-sm text-default-500">
									No hay horarios disponibles.
								</p>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
									{scheduleSlots.map((slot, index) => {
										const slotKey = `${slot.day}-${slot.startTime}-${index}`;
										const isSelected =
											selectedSlot?.day === slot.day &&
											selectedSlot?.startTime === slot.startTime &&
											selectedSlot?.endTime === slot.endTime;

										return (
											<button
												key={slotKey}
												type="button"
												onClick={() => setSelectedSlot(slot)}
												className={`p-3 border rounded-lg text-left transition-colors ${
													isSelected
														? 'bg-primary text-white border-primary'
														: 'bg-default-50 border-default-200 hover:border-primary'
												}`}
											>
												<div className="flex items-center justify-between mb-1">
													<span className="font-medium text-sm">
														{slot.dayLabel}
													</span>
													<Badge
														color={MODE_COLORS[slot.mode]}
														variant="flat"
														size="sm"
													>
														{slot.mode}
													</Badge>
												</div>
												<div className="text-xs opacity-90">
													{slot.startTime} - {slot.endTime}
												</div>
											</button>
										);
									})}
								</div>
							)}
						</div>
						{/* Selección de Materia */}
						<div>
							<h4 className="font-medium mb-2">
								Selecciona la materia de la tutoría *
							</h4>
							<Select
								placeholder="Selecciona una materia"
								selectedKeys={codigoMateria ? [codigoMateria] : []}
								onSelectionChange={(keys) => {
									const selected = Array.from(keys)[0] as string;
									setCodigoMateria(selected || '');
								}}
								variant="bordered"
								isRequired
								isLoading={isLoadingMaterias}
								isDisabled={
									isLoadingMaterias || !materiasData?.materias?.length
								}
								description={(() => {
									if (isLoadingMaterias) return 'Cargando materias...';
									if (!materiasData?.materias?.length)
										return 'No hay materias disponibles para este tutor';
									return 'Selecciona la materia para la cual necesitas tutoría';
								})()}
							>
								{(materiasData?.materias || []).map((materia) => (
									<SelectItem key={materia.codigo}>
										{materia.nombre} ({materia.codigo})
									</SelectItem>
								))}
							</Select>
						</div>{' '}
						{/* Comentarios */}
						<div>
							<h4 className="font-medium mb-2">Comentarios (opcional)</h4>
							<Textarea
								placeholder="Describe brevemente el tema o dudas que deseas tratar..."
								value={comentarios}
								onValueChange={setComentarios}
								minRows={3}
								maxRows={5}
							/>
						</div>
					</div>
				</ModalBody>{' '}
				<ModalFooter>
					<div className="flex justify-end gap-2 w-full">
						<Button variant="flat" onPress={onClose} isDisabled={isPending}>
							Cancelar
						</Button>
						<Button
							color="primary"
							onPress={handleConfirm}
							isDisabled={!selectedSlot || !codigoMateria.trim() || isPending}
							isLoading={isPending}
						>
							Agendar tutoría
						</Button>
					</div>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
