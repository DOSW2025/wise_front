import {
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
	Select,
	SelectItem,
	useDisclosure,
} from '@heroui/react';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface TimeSlot {
	id: string;
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

const TIME_OPTIONS = [
	'07:00',
	'08:00',
	'09:00',
	'10:00',
	'11:00',
	'12:00',
	'13:00',
	'14:00',
	'15:00',
	'16:00',
	'17:00',
	'18:00',
	'19:00',
];

export default function TutorScheduled() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
		{
			id: '1',
			day: 'monday',
			startTime: '09:00',
			endTime: '11:00',
			isAvailable: true,
		},
		{
			id: '2',
			day: 'tuesday',
			startTime: '14:00',
			endTime: '16:00',
			isAvailable: true,
		},
		{
			id: '3',
			day: 'wednesday',
			startTime: '10:00',
			endTime: '12:00',
			isAvailable: false,
		},
	]);
	const [newSlot, setNewSlot] = useState({
		day: '',
		startTime: '',
		endTime: '',
	});

	const addTimeSlot = () => {
		if (newSlot.day && newSlot.startTime && newSlot.endTime) {
			const slot: TimeSlot = {
				id: Date.now().toString(),
				day: newSlot.day,
				startTime: newSlot.startTime,
				endTime: newSlot.endTime,
				isAvailable: true,
			};
			setTimeSlots([...timeSlots, slot]);
			setNewSlot({ day: '', startTime: '', endTime: '' });
			onClose();
		}
	};

	const removeTimeSlot = (id: string) => {
		setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
	};

	const toggleAvailability = (id: string) => {
		setTimeSlots(
			timeSlots.map((slot) =>
				slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot,
			),
		);
	};

	const getDayLabel = (dayKey: string) => {
		return DAYS.find((day) => day.key === dayKey)?.label || dayKey;
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Gestión de Disponibilidad
					</h1>
					<p className="text-default-500">
						Configura tus horarios disponibles para tutorías.
					</p>
				</div>
				<Button
					color="primary"
					startContent={<Plus className="w-4 h-4" />}
					onPress={onOpen}
				>
					Agregar Horario
				</Button>
			</div>

			{/* Horarios por día */}
			<div className="grid gap-4">
				{DAYS.map((day) => {
					const daySlots = timeSlots.filter((slot) => slot.day === day.key);
					return (
						<Card key={day.key}>
							<CardHeader className="pb-3">
								<div className="flex items-center gap-2">
									<Calendar className="w-5 h-5 text-primary" />
									<h3 className="text-lg font-semibold">{day.label}</h3>
									<Chip
										size="sm"
										variant="flat"
										color={daySlots.length > 0 ? 'success' : 'default'}
									>
										{daySlots.length} horarios
									</Chip>
								</div>
							</CardHeader>
							<CardBody className="pt-0">
								{daySlots.length > 0 ? (
									<div className="flex flex-wrap gap-2">
										{daySlots.map((slot) => (
											<div
												key={slot.id}
												className="flex items-center gap-2 p-2 bg-default-100 rounded-lg"
											>
												<Clock className="w-4 h-4 text-default-500" />
												<span className="text-sm font-medium">
													{slot.startTime} - {slot.endTime}
												</span>
												<Chip
													size="sm"
													color={slot.isAvailable ? 'success' : 'warning'}
													variant="flat"
													className="cursor-pointer"
													onClick={() => toggleAvailability(slot.id)}
												>
													{slot.isAvailable ? 'Disponible' : 'Ocupado'}
												</Chip>
												<Button
													isIconOnly
													size="sm"
													variant="light"
													color="danger"
													onPress={() => removeTimeSlot(slot.id)}
												>
													<X className="w-3 h-3" />
												</Button>
											</div>
										))}
									</div>
								) : (
									<p className="text-default-400 text-sm">
										Sin horarios configurados
									</p>
								)}
							</CardBody>
						</Card>
					);
				})}
			</div>

			{/* Modal para agregar horario */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalContent>
					<ModalHeader>Agregar Nuevo Horario</ModalHeader>
					<ModalBody>
						<div className="space-y-4">
							<Select
								label="Día de la semana"
								placeholder="Selecciona un día"
								selectedKeys={newSlot.day ? [newSlot.day] : []}
								onSelectionChange={(keys) => {
									const selectedDay = Array.from(keys)[0] as string;
									setNewSlot({ ...newSlot, day: selectedDay });
								}}
							>
								{DAYS.map((day) => (
									<SelectItem key={day.key} value={day.key}>
										{day.label}
									</SelectItem>
								))}
							</Select>
							<Select
								label="Hora de inicio"
								placeholder="Selecciona hora de inicio"
								selectedKeys={newSlot.startTime ? [newSlot.startTime] : []}
								onSelectionChange={(keys) => {
									const selectedTime = Array.from(keys)[0] as string;
									setNewSlot({ ...newSlot, startTime: selectedTime });
								}}
							>
								{TIME_OPTIONS.map((time) => (
									<SelectItem key={time} value={time}>
										{time}
									</SelectItem>
								))}
							</Select>
							<Select
								label="Hora de fin"
								placeholder="Selecciona hora de fin"
								selectedKeys={newSlot.endTime ? [newSlot.endTime] : []}
								onSelectionChange={(keys) => {
									const selectedTime = Array.from(keys)[0] as string;
									setNewSlot({ ...newSlot, endTime: selectedTime });
								}}
							>
								{TIME_OPTIONS.map((time) => (
									<SelectItem key={time} value={time}>
										{time}
									</SelectItem>
								))}
							</Select>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Cancelar
						</Button>
						<Button color="primary" onPress={addTimeSlot}>
							Agregar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
