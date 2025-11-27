import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

interface PeriodCalendarProps {
	selectedDate?: Date;
	onDateChange?: (date: Date) => void;
}

const MONTHS = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
];

const WEEKDAYS = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];

function getDaysInMonth(date: Date): number {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(date: Date): number {
	return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function PeriodCalendar({
	selectedDate,
	onDateChange,
}: PeriodCalendarProps) {
	const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
	const [displayDate, setDisplayDate] = useState(selectedDate || new Date());

	const daysInMonth = getDaysInMonth(displayDate);
	const firstDay = getFirstDayOfMonth(displayDate);
	const days: (number | null)[] = [];

	// Agregar días vacíos del mes anterior
	for (let i = 0; i < firstDay; i++) {
		days.push(null);
	}

	// Agregar días del mes actual
	for (let i = 1; i <= daysInMonth; i++) {
		days.push(i);
	}

	const handlePreviousMonth = () => {
		setDisplayDate(
			new Date(displayDate.getFullYear(), displayDate.getMonth() - 1),
		);
	};

	const handleNextMonth = () => {
		setDisplayDate(
			new Date(displayDate.getFullYear(), displayDate.getMonth() + 1),
		);
	};

	const handleSelectDay = (day: number) => {
		const newDate = new Date(
			displayDate.getFullYear(),
			displayDate.getMonth(),
			day,
		);
		setCurrentDate(newDate);
		onDateChange?.(newDate);
	};

	const formatDate = (date: Date) => {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	};

	return (
		<Popover placement="bottom">
			<PopoverTrigger asChild>
				<Button
					startContent={<Calendar className="w-4 h-4" />}
					variant="bordered"
					className="border-default-300"
					size="sm"
				>
					{formatDate(currentDate)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="px-4 py-3 space-y-4">
					{/* Header con mes y año */}
					<div className="flex justify-between items-center">
						<Button
							isIconOnly
							size="sm"
							variant="light"
							onPress={handlePreviousMonth}
						>
							↑
						</Button>
						<h3 className="text-sm font-semibold text-center">
							{MONTHS[displayDate.getMonth()]} de {displayDate.getFullYear()}
						</h3>
						<Button
							isIconOnly
							size="sm"
							variant="light"
							onPress={handleNextMonth}
						>
							↓
						</Button>
					</div>

					{/* Días de la semana */}
					<div className="grid grid-cols-7 gap-1 text-center">
						{WEEKDAYS.map((day) => (
							<div
								key={day}
								className="text-xs font-semibold text-default-500 py-1"
							>
								{day}
							</div>
						))}
					</div>

					{/* Días del mes */}
					<div className="grid grid-cols-7 gap-1">
						{days.map((day, idx) => {
							const isSelected =
								day &&
								day === currentDate.getDate() &&
								displayDate.getMonth() === currentDate.getMonth() &&
								displayDate.getFullYear() === currentDate.getFullYear();

							const isToday =
								day &&
								day === new Date().getDate() &&
								displayDate.getMonth() === new Date().getMonth() &&
								displayDate.getFullYear() === new Date().getFullYear();

							return (
								<button
									key={idx}
									type="button"
									onClick={() => day && handleSelectDay(day)}
									className={`
										h-8 w-8 rounded text-sm font-medium transition-colors
										${day === null ? 'text-default-200 cursor-default' : ''}
										${isSelected ? 'bg-primary-500 text-white' : ''}
										${isToday && !isSelected ? 'border-2 border-primary-500 text-primary-600' : ''}
										${
											day &&
											!isSelected &&
											!isToday &&
											'text-default-700 hover:bg-default-100 cursor-pointer'
										}
									`}
									disabled={day === null}
								>
									{day}
								</button>
							);
						})}
					</div>

					{/* Botones de navegación */}
					<div className="flex gap-2 pt-2">
						<Button
							size="sm"
							variant="light"
							className="text-primary-500 text-xs"
							onPress={() => {
								setDisplayDate(new Date());
								setCurrentDate(new Date());
								onDateChange?.(new Date());
							}}
						>
							Hoy
						</Button>
						<Button
							size="sm"
							variant="light"
							className="text-default-600 text-xs ml-auto"
						>
							Borrar
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
