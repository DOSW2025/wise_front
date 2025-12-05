import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
} from '@heroui/react';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

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

// Generar horarios automáticamente de 1.5 horas
const generateTimeSlots = (day: string) => {
	const slots = [];
	const endHour = day === 'saturday' ? 13 : 19; // Sábado hasta 1pm, otros hasta 7pm

	for (let hour = 7; hour < endHour; hour += 1.5) {
		const startHour = Math.floor(hour);
		const startMinute = (hour % 1) * 60;
		const endHour = Math.floor(hour + 1.5);
		const endMinute = ((hour + 1.5) % 1) * 60;

		const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
		const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

		slots.push({
			id: `${day}-${startTime}`,
			day,
			startTime,
			endTime,
			isAvailable: false,
		});
	}
	return slots;
};

const generateAllTimeSlots = () => {
	const allSlots = [];
	for (const day of DAYS) {
		allSlots.push(...generateTimeSlots(day.key));
	}
	return allSlots;
};

export default function TutorScheduled() {
	const [searchParams] = useSearchParams();
	const [activeTab, setActiveTab] = useState<'scheduled' | 'availability'>(
		'scheduled',
	);

	// Detectar parámetro de URL para activar tab específico
	useEffect(() => {
		const tab = searchParams.get('tab');
		if (tab === 'availability') {
			setActiveTab('availability');
		}
	}, [searchParams]);

	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() =>
		generateAllTimeSlots(),
	);

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
						<p className="text-sm text-default-500">
							Haz clic en los horarios para cambiar tu disponibilidad
						</p>
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
										<div className="flex gap-2 overflow-x-auto pb-2">
											{daySlots.map((slot) => (
												<Button
													key={slot.id}
													size="sm"
													variant={slot.isAvailable ? 'solid' : 'bordered'}
													color={slot.isAvailable ? 'primary' : 'default'}
													onPress={() => toggleAvailability(slot.id)}
													className={`h-16 flex flex-col justify-center p-2 min-w-24 flex-shrink-0 ${
														slot.isAvailable
															? 'bg-green-100 text-green-800 border-green-300'
															: 'bg-gray-100 text-gray-600 border-gray-300'
													}`}
												>
													<div className="text-xs font-medium">
														{slot.startTime} - {slot.endTime}
													</div>
													<div className="text-xs opacity-80 mt-1">
														{slot.isAvailable ? 'Disponible' : 'Ocupado'}
													</div>
												</Button>
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
