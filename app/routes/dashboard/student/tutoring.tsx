import { Avatar, Button, Card, CardBody, Chip, Input } from '@heroui/react';
import { Calendar, Clock, MapPin, Search, Video } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { PageHeader } from '~/components/page-header';
import TutorCard from '~/components/tutor-card';
import TutorFilter from '~/components/tutor-filter';

interface Tutor {
	id: number;
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
}

interface TutorFilters {
	materia: string;
	calificacion: string;
	disponibilidad: string;
}

interface StudentSession {
	id: string;
	tutorName: string;
	subject: string;
	topic: string;
	date: string;
	time: string;
	duration: number;
	modality: 'presencial' | 'virtual';
	location?: string;
	status: 'confirmada' | 'pendiente' | 'cancelada';
}

// TODO: Reemplazar estos tutores mock con datos reales de backend cuando haya conexion.
const mockTutors: Tutor[] = [
	{
		id: 1,
		name: 'Dr. María García',
		title: 'Profesora de Matemáticas',
		department: 'Ciencias Exactas',
		avatarInitials: 'MG',
		avatarColor: '#b81d24',
		rating: 4.9,
		reviews: 127,
		tags: ['Cálculo', 'Álgebra', 'Geometría'],
		availability: 'Lun-Vie 9:00-17:00',
		isAvailableToday: true,
	},
	{
		id: 2,
		name: 'Ing. Carlos Rodríguez',
		title: 'Tutor de Programación',
		department: 'Ingeniería',
		avatarInitials: 'CR',
		avatarColor: '#008000',
		rating: 4.8,
		reviews: 89,
		tags: ['React', 'TypeScript', 'Node.js'],
		availability: 'Mar-Sáb 14:00-20:00',
		isAvailableToday: false,
	},
];

// TODO: Reemplazar estas sesiones mock con datos reales de backend cuando haya conexion.
const mockSessions: StudentSession[] = [
	{
		id: '101',
		tutorName: 'Dra. Paula Reyes',
		subject: 'Calculo I',
		topic: 'Repaso de integrales definidas',
		date: '2024-09-12',
		time: '10:30',
		duration: 60,
		modality: 'presencial',
		location: 'Aula 204 - Ciencias',
		status: 'confirmada',
	},
	{
		id: '102',
		tutorName: 'Ing. Javier Lopez',
		subject: 'Estructuras de Datos',
		topic: 'Arboles AVL y complejidad',
		date: '2024-09-14',
		time: '18:00',
		duration: 45,
		modality: 'virtual',
		status: 'pendiente',
	},
	{
		id: '103',
		tutorName: 'Lic. Sofia Mendez',
		subject: 'Ingles B2',
		topic: 'Preparacion oral para presentaciones',
		date: '2024-09-09',
		time: '08:00',
		duration: 30,
		modality: 'virtual',
		status: 'confirmada',
	},
	{
		id: '104',
		tutorName: 'Mtro. Daniel Perez',
		subject: 'Fisica II',
		topic: 'Circuitos RLC y resonancia',
		date: '2024-09-07',
		time: '16:15',
		duration: 50,
		modality: 'virtual',
		status: 'cancelada',
	},
	{
		id: '105',
		tutorName: 'Dra. Elena Torres',
		subject: 'Quimica Organica',
		topic: 'Reaccion de Friedel-Crafts',
		date: '2024-09-18',
		time: '12:00',
		duration: 55,
		modality: 'presencial',
		location: 'Lab 3 - Quimica',
		status: 'confirmada',
	},
	{
		id: '106',
		tutorName: 'Dr. Miguel Soto',
		subject: 'Algebra Lineal',
		topic: 'Diagonalizacion y autovalores',
		date: '2024-09-20',
		time: '09:30',
		duration: 40,
		modality: 'virtual',
		status: 'pendiente',
	},
	{
		id: '107',
		tutorName: 'Lic. Ana Valdez',
		subject: 'Redaccion Academica',
		topic: 'Estructura de articulos de investigacion',
		date: '2024-09-05',
		time: '19:15',
		duration: 35,
		modality: 'virtual',
		status: 'cancelada',
	},
];

const StudentTutoringPage: React.FC = () => {
	const [tutors] = useState<Tutor[]>(mockTutors);
	const [searchValue, setSearchValue] = useState('');
	const [activeTab, setActiveTab] = useState<'search' | 'my-sessions'>(
		'search',
	);
	// TODO: Reemplazar estado inicial de sesiones con datos del backend.
	const [sessions, setSessions] = useState<StudentSession[]>(mockSessions);

	const { onOpenChat } = useOutletContext<{
		onOpenChat: (tutor: Tutor) => void;
	}>();

	// TODO: Conectar filtros y busqueda a la API de tutores.
	const handleSearch = (_filters: TutorFilters) => {};

	const handleCancelSession = (id: string) => {
		setSessions((prev) =>
			prev.map((s) => (s.id === id ? { ...s, status: 'cancelada' } : s)),
		);
	};

	return (
		<div className="space-y-6 p-4 md:p-6">
			<PageHeader
				title="Mis Tutorias"
				description="Agenda nuevas tutorias y revisa tus sesiones programadas."
			/>

			<div className="flex gap-2">
				<Button
					variant={activeTab === 'search' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setActiveTab('search')}
				>
					Agendar tutoria
				</Button>
				<Button
					variant={activeTab === 'my-sessions' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setActiveTab('my-sessions')}
				>
					Mis tutorias
				</Button>
			</div>

			{activeTab === 'search' && (
				<>
					<Card>
						<CardBody className="p-4">
							<div className="mb-4">
								<Input
									type="text"
									placeholder="Buscar por nombre, materia o tema..."
									value={searchValue}
									onValueChange={setSearchValue}
									startContent={<Search className="w-5 h-5 text-default-400" />}
									isClearable
									onClear={() => setSearchValue('')}
									variant="bordered"
									fullWidth
								/>
							</div>
							<TutorFilter onApplyFilters={handleSearch} />
						</CardBody>
					</Card>

					<div className="flex justify-between items-center pt-2 border-t border-default-200">
						<p className="text-default-600">
							{tutors.length} tutores encontrados
						</p>
						<Button
							variant="light"
							color="danger"
							startContent={<Calendar className="w-5 h-5" />}
						>
							Ver calendario
						</Button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{tutors.map((tutor) => (
							<TutorCard key={tutor.id} tutor={tutor} onOpenChat={onOpenChat} />
						))}
					</div>
				</>
			)}

			{activeTab === 'my-sessions' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Sesiones programadas</h2>
					</div>

					{sessions.length === 0 ? (
						<Card>
							<CardBody className="text-center py-12">
								<Calendar className="w-12 h-12 text-default-300 mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2">
									No tienes tutorías programadas
								</h3>
								<p className="text-default-500 mb-4">
									Cuando confirmes una tutoría aparecerá aquí.
								</p>
								<Button color="primary" onPress={() => setActiveTab('search')}>
									Agendar tutoría
								</Button>
							</CardBody>
						</Card>
					) : (
						<div className="grid gap-4">
							{sessions.map((session) => (
								<Card key={session.id}>
									<CardBody>
										<div className="flex items-start justify-between">
											<div className="space-y-2">
												<div className="flex items-center gap-3">
													<Avatar
														name={session.tutorName}
														size="sm"
														showFallback
													/>
													<div>
														<h3 className="font-semibold">
															{session.tutorName}
														</h3>
														<div className="flex gap-2 mt-1">
															<Chip size="sm" color="primary" variant="flat">
																{session.subject}
															</Chip>
															<Chip
																size="sm"
																color={
																	session.status === 'confirmada'
																		? 'success'
																		: session.status === 'pendiente'
																			? 'warning'
																			: 'danger'
																}
																variant="flat"
															>
																{session.status}
															</Chip>
														</div>
													</div>
												</div>
												<p className="text-default-600 ml-11">
													{session.topic}
												</p>
												<div className="flex flex-wrap gap-4 text-sm text-default-500 ml-11">
													<div className="flex items-center gap-1">
														<Calendar className="w-4 h-4" />
														{new Date(session.date).toLocaleDateString()}
													</div>
													<div className="flex items-center gap-1">
														<Clock className="w-4 h-4" />
														{session.time} ({session.duration} min)
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
															<span> - {session.location}</span>
														)}
													</div>
												</div>
											</div>
											<div className="flex gap-2">
												<Button size="sm" color="primary" variant="flat">
													Ver detalles
												</Button>
												<Button
													size="sm"
													variant="light"
													color="danger"
													isDisabled={session.status === 'cancelada'}
													onPress={() => handleCancelSession(session.id)}
												>
													{session.status === 'cancelada'
														? 'Cancelada'
														: 'Cancelar'}
												</Button>
											</div>
										</div>
									</CardBody>
								</Card>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default StudentTutoringPage;
