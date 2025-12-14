import { Button, Input, Select, SelectItem } from '@heroui/react';
import { TrendingUp } from 'lucide-react';

interface DateRangeFilterProps {
	period: string;
	onPeriodChange: (keys: any) => void;
	customDateStart: string;
	onCustomDateStartChange: (value: string) => void;
	customDateEnd: string;
	onCustomDateEndChange: (value: string) => void;
	onCustomFilter: () => void;
}

export function DateRangeFilter({
	period,
	onPeriodChange,
	customDateStart,
	onCustomDateStartChange,
	customDateEnd,
	onCustomDateEndChange,
	onCustomFilter,
}: DateRangeFilterProps) {
	return (
		<div className="flex flex-wrap gap-2 items-center bg-default-50 p-2 rounded-lg">
			<Select
				label="Periodo"
				className="w-40"
				size="sm"
				selectedKeys={[period]}
				onSelectionChange={onPeriodChange}
			>
				<SelectItem key="last-week">Última semana</SelectItem>
				<SelectItem key="last-month">Último mes</SelectItem>
				<SelectItem key="semester">Semestre actual</SelectItem>
				<SelectItem key="year">Año actual</SelectItem>
				<SelectItem key="custom">Personalizado</SelectItem>
			</Select>

			{period === 'custom' && (
				<div className="flex gap-2 items-center">
					<Input
						type="date"
						label="Desde"
						size="sm"
						value={customDateStart}
						onValueChange={onCustomDateStartChange}
						className="w-32"
					/>
					<Input
						type="date"
						label="Hasta"
						size="sm"
						value={customDateEnd}
						onValueChange={onCustomDateEndChange}
						className="w-32"
					/>
					<Button
						isIconOnly
						size="sm"
						color="primary"
						variant="flat"
						onPress={onCustomFilter}
					>
						<TrendingUp className="w-4 h-4" />
					</Button>
				</div>
			)}
		</div>
	);
}
