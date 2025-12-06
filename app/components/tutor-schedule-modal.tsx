import {
	Avatar,
	Button,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface Props {
	tutor: Tutor | null;
	isOpen: boolean;
	onClose: () => void;
	onSchedule: (data: {
		tutorId: number;
		name: string;
		email: string;
		slot: string;
		notes?: string;
	}) => void;
}

export default function TutorScheduleModal({
	tutor,
	isOpen,
	onClose,
	onSchedule,
}: Props) {
	const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [notes, setNotes] = useState('');

	useEffect(() => {
		if (isOpen) {
			// reset
			setSelectedSlot(null);
			setName('');
			setEmail('');
			setNotes('');
		}
	}, [isOpen]);

	const handleConfirm = () => {
		if (!tutor) return;
		if (!selectedSlot) return alert('Selecciona un horario disponible.');
		if (!name || !email) return alert('Por favor ingresa tu nombre y correo.');

		// Simular petición a API
		const payload = {
			tutorId: tutor.id,
			name,
			email,
			slot: selectedSlot,
			notes,
		};
		onSchedule(payload);
		alert(`Tutoría agendada con ${tutor.name} el ${selectedSlot}.`);
		onClose();
	};

	if (!tutor) return null;

	const slots =
		tutor.timeSlots && tutor.timeSlots.length > 0 ? tutor.timeSlots : [];

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
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
						<div className="flex gap-2 flex-wrap">
							{tutor.tags.map((t) => (
								<Chip key={t} variant="flat" color="primary">
									{t}
								</Chip>
							))}
						</div>

						<p className="text-sm text-default-500">{tutor.availability}</p>

						<div>
							<h4 className="font-medium mb-2">Horarios disponibles</h4>
							{slots.length === 0 ? (
								<p className="text-sm text-default-500">
									No hay horarios disponibles.
								</p>
							) : (
								<div className="grid grid-cols-2 gap-2">
									{slots.map((slot) => (
										<button
											key={slot}
											type="button"
											onClick={() => setSelectedSlot(slot)}
											className={`px-3 py-2 border rounded-lg text-sm text-left ${selectedSlot === slot ? 'bg-primary text-white border-primary' : 'bg-default-50 border-default-200'}`}
										>
											{slot}
										</button>
									))}
								</div>
							)}
						</div>

						<div>
							<h4 className="font-medium mb-2">Tus datos</h4>
							<div className="grid grid-cols-1 gap-2">
								<Input
									placeholder="Nombre completo"
									value={name}
									onValueChange={setName}
								/>
								<Input
									placeholder="Correo electrónico"
									value={email}
									onValueChange={setEmail}
								/>
								<Input
									placeholder="Notas (opcional)"
									value={notes}
									onValueChange={setNotes}
								/>
							</div>
						</div>
					</div>
				</ModalBody>

				<ModalFooter>
					<div className="flex justify-end gap-2 w-full">
						<Button variant="flat" onPress={onClose}>
							Cancelar
						</Button>
						<Button color="primary" onPress={handleConfirm}>
							Agendar tutoría
						</Button>
					</div>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
