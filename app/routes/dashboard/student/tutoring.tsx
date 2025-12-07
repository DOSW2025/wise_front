import { Button, Card, CardBody, Input, Spinner } from '@heroui/react';
import { BookOpen, Search } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { PageHeader } from '~/components/page-header';
import ScheduledTutoringsModal, {
	type ScheduledTutoring,
} from '~/components/scheduled-tutorings-modal';
import TutorCard from '~/components/tutor-card';
import TutorFilter from '~/components/tutor-filter';
import TutorScheduleModal from '~/components/tutor-schedule-modal';
import { useTutores } from '~/lib/hooks/useTutores';
import type { TutorProfile } from '~/lib/types/tutoria.types';

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
	timeSlots?: string[];
}

interface TutorFilters {
	materia: string;
	calificacion: string;
	disponibilidad: string;
}

/**
 * Transforma un TutorProfile del backend al formato Tutor del componente
 */
const transformTutorProfileToTutor = (profile: TutorProfile): Tutor => {
	// Validar que disponibilidad exista
	const disponibilidad = profile.disponibilidad || {
		monday: [],
		tuesday: [],
		wednesday: [],
		thursday: [],
		friday: [],
		saturday: [],
		sunday: [],
	};

	// Obtener los slots de disponibilidad de todos los días con tipado explícito
	const allSlots = Object.entries(disponibilidad).flatMap(([day, slots]) =>
		slots.map(
			(slot: {
				start: string;
				end: string;
				modalidad: string;
				lugar: string;
			}) => ({
				day,
				...slot,
			}),
		),
	);

	// Calcular disponibilidad en formato legible
	const daysWithAvailability = Object.entries(disponibilidad)
		.filter(([_, slots]) => slots.length > 0)
		.map(([day]) => day);

	const availability =
		daysWithAvailability.length > 0
			? `Disponible: ${daysWithAvailability.join(', ')}`
			: 'Sin disponibilidad';

	// Verificar si está disponible hoy
	const today = new Date()
		.toLocaleDateString('en-US', { weekday: 'long' })
		.toLowerCase();
	const isAvailableToday =
		(disponibilidad[today as keyof typeof disponibilidad] || []).length > 0;

	// Generar timeSlots en formato legible
	const timeSlots = allSlots.map(
		(slot) => `${slot.day} ${slot.start} - ${slot.end}`,
	);

	// Generar iniciales
	const avatarInitials =
		`${profile.nombre.charAt(0)}${profile.apellido.charAt(0)}`.toUpperCase();

	// Colores aleatorios para avatar (basado en el ID)
	const colors = ['#b81d24', '#008000', '#0073e6', '#f59e0b', '#8b5cf6'];
	const avatarColor =
		colors[Number.parseInt(profile.id.slice(-1), 16) % colors.length];

	return {
		id:
			Number.parseInt(profile.id.replace(/\D/g, '').slice(0, 8)) ||
			Math.floor(Math.random() * 100000),
		name: `${profile.nombre} ${profile.apellido}`,
		title: `Tutor - Semestre ${profile.semestre}`,
		department: profile.rol.nombre,
		avatarInitials,
		avatarColor,
		rating: 4.5, // TODO: Implementar sistema de calificaciones
		reviews: 0, // TODO: Implementar sistema de reseñas
		tags: allSlots
			.map((slot) => slot.modalidad)
			.filter((v, i, a) => a.indexOf(v) === i),
		availability,
		isAvailableToday,
		timeSlots,
	};
};

// Mock de tutorías agendadas (simulación de datos desde API)
const mockScheduledTutorings: ScheduledTutoring[] = [
	{
		id: 'sched-1',
		tutorId: 1,
		tutorName: 'Dr. María García',
		subject: 'Cálculo Diferencial',
		date: 'Viernes 10 de Diciembre',
		time: '15:00 - 16:00',
		modality: 'virtual',
		meetLink: 'https://meet.google.com/abc-defg-hij',
		studentNotes: 'Repasar límites y continuidad',
	},
	{
		id: 'sched-2',
		tutorId: 2,
		tutorName: 'Ing. Carlos Rodríguez',
		subject: 'React Avanzado',
		date: 'Sábado 11 de Diciembre',
		time: '10:00 - 11:30',
		modality: 'presencial',
		location: 'Biblioteca Central, Sala 3',
		studentNotes: 'Dudas sobre hooks personalizados y context',
	},
];

const StudentTutoringPage: React.FC = () => {
	// Obtener tutores desde el backend
	const { data: tutoresData, isLoading, error } = useTutores();

	// Transformar los datos del backend al formato del componente
	const tutors = tutoresData
		? tutoresData.map(transformTutorProfileToTutor)
		: [];

	const [searchValue, setSearchValue] = useState('');
	const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
	const [isScheduleOpen, setIsScheduleOpen] = useState(false);
	const [scheduledTutorings, setScheduledTutorings] = useState<
		ScheduledTutoring[]
	>(mockScheduledTutorings);
	const [isMyTutoringsOpen, setIsMyTutoringsOpen] = useState(false);

	// Recibe la función del contexto para abrir el chat
	const { onOpenChat } = useOutletContext<{
		onOpenChat: (tutor: Tutor) => void;
	}>();

	const handleSearch = (_filters: TutorFilters) => {
		// Lógica de filtrado simulada (reemplazar con Axios/Zustand después)
	};

	const handleScheduleTutoring = (data: {
		tutorId: number;
		name: string;
		email: string;
		slot: string;
		notes?: string;
	}) => {
		console.log('Nueva tutoría agendada:', data);
		// En producción: guardar en API y actualizar lista
		const newTutoring: ScheduledTutoring = {
			id: `sched-${Date.now()}`,
			tutorId: data.tutorId,
			tutorName: selectedTutor?.name || 'Tutor',
			subject: selectedTutor?.tags[0] || 'Sin tema',
			date: data.slot,
			time: data.slot.split(' ').slice(1).join(' ') || '00:00',
			modality: 'virtual',
			studentNotes: data.notes,
		};
		setScheduledTutorings([...scheduledTutorings, newTutoring]);
	};

	const handleCancelTutoring = (id: string) => {
		console.log('Cancelando tutoría:', id);
		setScheduledTutorings(scheduledTutorings.filter((t) => t.id !== id));
	};

	// Mostrar spinner mientras carga
	if (isLoading) {
		return (
			<div className="space-y-6 p-4 md:p-6">
				<PageHeader title="Tutorías" description="Panel de Estudiante" />
				<div className="flex justify-center items-center min-h-[400px]">
					<Spinner size="lg" label="Cargando tutores..." />
				</div>
			</div>
		);
	}

	// Mostrar error si falla la petición
	if (error) {
		return (
			<div className="space-y-6 p-4 md:p-6">
				<PageHeader title="Tutorías" description="Panel de Estudiante" />
				<Card>
					<CardBody className="p-6 text-center">
						<p className="text-danger text-lg">Error al cargar tutores</p>
						<p className="text-default-500 mt-2">{error.message}</p>
					</CardBody>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-4 md:p-6">
			{/* PageHeader */}
			<PageHeader title="Tutorías" description="Panel de Estudiante" />
			{/* Buscador y Filtros */}
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
			{/* Resultados y Botón Ver Calendario */}
			{/* Resultados */}
			<div className="flex justify-between items-center pt-2 border-t border-default-200">
				<p className="text-default-600">{tutors.length} tutores encontrados</p>
				<Button
					color="primary"
					startContent={<BookOpen className="w-4 h-4" />}
					onPress={() => setIsMyTutoringsOpen(true)}
				>
					Mis Tutorías ({scheduledTutorings.length})
				</Button>
			</div>{' '}
			{/* Grid de Tarjetas de Tutores */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{tutors.map((tutor) => (
					<TutorCard
						key={tutor.id}
						tutor={tutor}
						onOpenChat={onOpenChat}
						onOpen={(t) => {
							setSelectedTutor(t);
							setIsScheduleOpen(true);
						}}
					/>
				))}
			</div>
			{/* Modal de agendar tutoría */}
			<TutorScheduleModal
				tutor={selectedTutor}
				isOpen={isScheduleOpen}
				onClose={() => setIsScheduleOpen(false)}
				onSchedule={handleScheduleTutoring}
			/>
			{/* Modal de mis tutorías agendadas */}
			<ScheduledTutoringsModal
				tutorings={scheduledTutorings}
				isOpen={isMyTutoringsOpen}
				onClose={() => setIsMyTutoringsOpen(false)}
				onCancel={handleCancelTutoring}
			/>
		</div>
	);
};

export default StudentTutoringPage;
