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
	Select,
	SelectItem,
	useDisclosure,
} from '@heroui/react';
import { Calendar, Clock, MapPin, Plus, Video, X } from 'lucide-react';
import { useState } from 'react';

interface TimeSlot {
	id: string;
	day: string;
	startTime: string;
	endTime: string;
	isAvailable: boolean;
}

interface ConfirmedSession {
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
	const [activeTab, setActiveTab] = useState<'scheduled' | 'availability'>(
		'scheduled',
	);

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
		{
			id: '-1',
			day: 'monday',
			startTime: '00:00',
			endTime: '00:00',
			isAvailable: false,
		},
	]);

	const [newSlot, setNewSlot] = useState({
		day: '',
		startTime: '',
		endTime: '',
	});

	// TODO: Conectar con API - Ejemplo con valores negativos para referencia
	const confirmedSessions: ConfirmedSession[] = [
		{
			id: '-1',
			studentName: 'Estudiante Ejemplo (Sin conexión)',
			subject: 'Sin datos de API',
			topic: 'Esperando conexión',
			date: '1900-01-01',
			time: '00:00',
			duration: -1,
			modality: 'virtual',
		},
	];

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
						<Chip color="success" variant="flat">
							{confirmedSessions.length} sesiones
						</Chip>
					</div>

					{confirmedSessions.length > 0 ? (
						<div className="grid gap-4">
							{confirmedSessions.map((session) => (
								<Card key={session.id}>
									<CardBody>
										<div className="flex items-start justify-between">
											<div className="space-y-2">
												<div className="flex items-center gap-3">
													<Avatar
														src={session.studentAvatar}
														name={session.studentName}
														size="sm"
														showFallback
													/>
													<div>
														<h3 className="font-semibold">
															{session.studentName}
														</h3>
														<Chip size="sm" color="primary" variant="flat">
															{session.subject}
														</Chip>
													</div>
												</div>
												<p className="text-default-600 ml-11">
													{session.topic}
												</p>
												<div className="flex items-center gap-4 text-sm text-default-500 ml-11">
													<div className="flex items-center gap-1">
														<Calendar className="w-4 h-4" />
														{new Date(session.date).toLocaleDateString()}
													</div>
													<div className="flex items-center gap-1">
														<Clock className="w-4 h-4" />
														{session.time} ({session.duration}min)
													</div>
													<div className="flex items-center gap-1">
														{session.modality === 'virtual' ? (
															<Video className="w-4 h-4" />
														) : (
															<MapPin className="w-4 h-4" />
														)}
														<span className="capitalize">
															{session.modality}
														</span>
														{session.location && (
															<span>- {session.location}</span>
														)}
													</div>
												</div>
											</div>
											<div className="flex gap-2">
												<Button size="sm" color="primary" variant="flat">
													Iniciar Sesión
												</Button>
												<Button size="sm" variant="light">
													Detalles
												</Button>
											</div>
										</div>
									</CardBody>
								</Card>
							))}
						</div>
					) : (
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

			{/* Contenido de Disponibilidad */}
			{activeTab === 'availability' && (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Configurar Horarios</h2>
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
				</div>
			)}

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
