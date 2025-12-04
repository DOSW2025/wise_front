import {
	Avatar,
	Button,
	Card,
	CardBody,
	Chip,
	Input,
} from '@heroui/react';
import {
	Calendar,
	Clock,
	MapPin,
	Search,
	Video,
} from 'lucide-react';
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

// TODO: Conectar con API - Ejemplo con valores negativos / datos dummy para referencia
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

// TODO: Conectar con API - Sesiones del estudiante (dummy)
const mockSessions: StudentSession[] = [
	{
		id: '-1',
		tutorName: 'Prof. Ejemplo (Sin conexión)',
		subject: 'Sin datos de API',
		topic: 'Esperando conexión',
		date: '1900-01-01',
		time: '00:00',
		duration: -1,
		modality: 'virtual',
		status: 'pendiente',
	},
];

const StudentTutoringPage: React.FC = () => {
	const [tutors] = useState<Tutor[]>(mockTutors);
	const [searchValue, setSearchValue] = useState('');
	const [activeTab, setActiveTab] = useState<'search' | 'my-sessions'>(
		'search',
	);
	const [sessions, setSessions] = useState<StudentSession[]>(mockSessions);

	// Recibe la función del contexto para abrir el chat
	const { onOpenChat } = useOutletContext<{
		onOpenChat: (tutor: Tutor) => void;
	}>();

	const handleSearch = (_filters: TutorFilters) => {
		// Lógica de filtrado simulada (reemplazar con Axios/Zustand después)
	};

	const handleCancelSession = (id: string) => {
		// Por ahora solo marcamos como cancelada en memoria
		setSessions((prev) =>
			prev.map((s) =>
				s.id === id ? { ...s, status: 'cancelada' } : s,
			),
		);
	};

	return (
		<div className="space-y-6 p-4 md:p-6">
			{/* Header */}
			<PageHeader
				title="Mis Tutorías"
				description="Agenda nuevas tutorías y revisa tus sesiones programadas."
			/>

			{/* Tabs: Agendar / Mis tutorías */}
			<div className="flex gap-2">
				<Button
					variant={activeTab === 'search' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setActiveTab('search')}
				>
					Agendar tutoría
				</Button>
				<Button
					variant={activeTab === 'my-sessions' ? 'solid' : 'light'}
					color="primary"
					onPress={() => setActiveTab('my-sessions')}
				>
					Mis tutorías
				</Button>
			</div>

			{/* TAB 1: Agendar tutoría (buscar tutores) */}
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
									startContent={
										<Search className="w-5 h-5 text-default-400" />
									}
									isClearable
									onClear={() => setSearchValue('')}
									variant="bordered"
									fullWidth
								/>
							</div>
							<TutorFilter onApplyFilters={handleSearch} />
						</CardBody>
					</Card>

					{/* Resultados y Botón Ver Calendario */}
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

					{/* Grid de Tarjetas de Tutores */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{tutors.map((tutor) => (
							<TutorCard
								key={tutor.id}
								tutor={tutor}
								onOpenChat={onOpenChat}
								// Aquí podrías pasar también un onSchedule si lo agregas al TutorCard
							/>
						))}
					</div>
				</>
			)}

			{/* TAB 2: Mis tutorías (sesiones del estudiante) */}
			{activeTab === 'my-sessions' && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">
							Sesiones programadas
						</h2>
						<Button
							variant="light"
							color="primary"
							onPress={() => setActiveTab('search')}
						>
							Agendar nueva tutoría
						</Button>
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
								<Button
									color="primary"
									onPress={() => setActiveTab('search')}
								>
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
															<Chip
																size="sm"
																color="primary"
																variant="flat"
															>
																{session.subject}
															</Chip>
															<Chip
																size="sm"
																color={
																	session.status === 'confirmada'
																		? 'success'
																		: session.status ===
																				'pendiente'
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
														{new Date(
															session.date,
														).toLocaleDateString()}
													</div>
													<div className="flex items-center gap-1">
														<Clock className="w-4 h-4" />
														{session.time}{' '}
														({session.duration} min)
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
															<span>
																{' '}
																- {session.location}
															</span>
														)}
													</div>
												</div>
											</div>
											<div className="flex gap-2">
												<Button
													size="sm"
													color="primary"
													variant="flat"
												>
													Ver detalles
												</Button>
												<Button
													size="sm"
													variant="light"
													color="danger"
													isDisabled={
														session.status === 'cancelada'
													}
													onPress={() =>
														handleCancelSession(session.id)
													}
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
