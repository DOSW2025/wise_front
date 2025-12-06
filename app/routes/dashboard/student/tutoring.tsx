import { Button, Card, CardBody, Input } from '@heroui/react';
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

// TODO: Conectar con API - Ejemplo con valores negativos para referencia
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
		timeSlots: ['Lun 09:00', 'Lun 10:00', 'Mar 11:00', 'Mie 14:00'],
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
		timeSlots: ['Mar 14:00', 'Jue 16:00', 'Sab 10:00'],
	},
];

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
	const [tutors] = useState<Tutor[]>(mockTutors);
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
