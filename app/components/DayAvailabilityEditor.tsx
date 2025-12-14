import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Select,
	SelectItem,
} from '@nextui-org/react';
import { Plus, Trash2 } from 'lucide-react';
import type { DisponibilidadSlot } from '~/lib/types/tutoria.types';

interface DayAvailabilityEditorProps {
	dayLabel: string;
	dayKey: string;
	slots: DisponibilidadSlot[];
	onAddSlot: () => void;
	onRemoveSlot: (index: number) => void;
	onUpdateSlot: (
		index: number,
		field: keyof DisponibilidadSlot,
		value: string,
	) => void;
}

export function DayAvailabilityEditor({
	dayLabel,
	slots,
	onAddSlot,
	onRemoveSlot,
	onUpdateSlot,
}: DayAvailabilityEditorProps) {
	const validateTimeSlot = (slot: DisponibilidadSlot) => {
		if (!slot.start || !slot.end) return null;
		if (slot.start >= slot.end) {
			return 'La hora de fin debe ser mayor que la hora de inicio';
		}
		return null;
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between w-full">
					<h3 className="text-lg font-semibold">{dayLabel}</h3>
					<Button
						size="sm"
						color="primary"
						variant="flat"
						startContent={<Plus className="w-4 h-4" />}
						onPress={onAddSlot}
					>
						Agregar bloque
					</Button>
				</div>
			</CardHeader>
			<CardBody className="pt-0 space-y-3">
				{slots.length === 0 ? (
					<p className="text-sm text-default-400 text-center py-4">
						No hay bloques configurados
					</p>
				) : (
					slots.map((slot, index) => {
						const error = validateTimeSlot(slot);
						return (
							<div
								key={index}
								className="flex flex-col sm:flex-row gap-2 p-3 bg-default-50 rounded-lg"
							>
								<Input
									type="time"
									label="Hora Inicio"
									value={slot.start}
									onChange={(e) => onUpdateSlot(index, 'start', e.target.value)}
									size="sm"
									isInvalid={!!error}
									classNames={{ base: 'flex-1' }}
								/>
								<Input
									type="time"
									label="Hora Fin"
									value={slot.end}
									onChange={(e) => onUpdateSlot(index, 'end', e.target.value)}
									size="sm"
									isInvalid={!!error}
									errorMessage={error}
									classNames={{ base: 'flex-1' }}
								/>
								<Select
									label="Modalidad"
									selectedKeys={[slot.modalidad]}
									onChange={(e) =>
										onUpdateSlot(index, 'modalidad', e.target.value)
									}
									size="sm"
									classNames={{ base: 'flex-1' }}
								>
									<SelectItem key="VIRTUAL" value="VIRTUAL">
										Virtual
									</SelectItem>
									<SelectItem key="PRESENCIAL" value="PRESENCIAL">
										Presencial
									</SelectItem>
								</Select>
								<Input
									label="Lugar"
									placeholder={
										slot.modalidad === 'VIRTUAL'
											? 'https://meet.google.com/...'
											: 'Biblioteca - Sala 3'
									}
									value={slot.lugar}
									onChange={(e) => onUpdateSlot(index, 'lugar', e.target.value)}
									size="sm"
									isInvalid={!slot.lugar.trim()}
									errorMessage={!slot.lugar.trim() ? 'Campo obligatorio' : ''}
									classNames={{ base: 'flex-[2]' }}
								/>
								<Button
									isIconOnly
									size="sm"
									color="danger"
									variant="flat"
									onPress={() => onRemoveSlot(index)}
									className="self-end"
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						);
					})
				)}
			</CardBody>
		</Card>
	);
}
