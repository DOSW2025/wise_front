import { Card, CardBody, CardHeader, Chip } from '@heroui/react';

interface PieChartData {
	label: string;
	value: number;
	color: string;
	percentage: number;
}

interface PieChartProps {
	title: string;
	data: PieChartData[];
	size?: number;
}

// Mapeo de colores semánticos (referencia para futuros usos)
const _semanticColors = {
	danger: '#ef4444', // Rojo
	success: '#10b981', // Verde
	warning: '#f59e0b', // Naranja
	primary: '#3b82f6', // Azul
	secondary: '#8b5cf6', // Púrpura
};

export function PieChart({ title, data, size = 200 }: PieChartProps) {
	const radius = size / 2;

	// Calcular los segmentos del pastel
	let currentAngle = -90; // Empezar en la parte superior
	const segments = data.map((item) => {
		const sliceAngle = (item.percentage / 100) * 360;
		const startAngle = currentAngle;
		const endAngle = currentAngle + sliceAngle;

		const start = polarToCartesian(radius, radius, radius - 5, startAngle);
		const end = polarToCartesian(radius, radius, radius - 5, endAngle);
		const largeArc = sliceAngle > 180 ? 1 : 0;

		const pathData = [
			`M ${radius} ${radius}`,
			`L ${start.x} ${start.y}`,
			`A ${radius - 5} ${radius - 5} 0 ${largeArc} 1 ${end.x} ${end.y}`,
			'Z',
		].join(' ');

		currentAngle = endAngle;

		return {
			pathData,
			color: item.color,
			label: item.label,
			percentage: item.percentage,
			value: item.value,
		};
	});

	return (
		<Card className="w-full border border-default-200 bg-white shadow-sm">
			<CardHeader className="flex justify-between items-center px-6 py-5 border-b border-default-100">
				<h3 className="text-lg font-bold text-foreground tracking-tight">
					{title}
				</h3>
			</CardHeader>
			<CardBody className="flex flex-col md:flex-row items-center justify-center gap-8 p-8">
				{/* SVG Pie Chart */}
				<div className="flex justify-center">
					<svg
						width={size}
						height={size}
						viewBox={`0 0 ${size} ${size}`}
						className="drop-shadow-md"
					>
						{segments.map((segment, index) => (
							<path
								key={index}
								d={segment.pathData}
								fill={segment.color}
								stroke="white"
								strokeWidth="2.5"
								className="transition-all duration-300 hover:opacity-80 cursor-pointer hover:drop-shadow-lg"
							/>
						))}
					</svg>
				</div>

				{/* Leyenda mejorada */}
				<div className="flex flex-col gap-3">
					{data.map((item, index) => {
						// Mapear colores a nombres semánticos para los chips
						const colorMap: Record<
							string,
							'danger' | 'success' | 'warning' | 'primary' | 'default'
						> = {
							'#ef4444': 'danger',
							'#10b981': 'success',
							'#f59e0b': 'warning',
							'#3b82f6': 'primary',
							'#8b5cf6': 'default',
						};

						const chipColor = colorMap[item.color] || 'default';

						return (
							<div key={index} className="flex items-center gap-3">
								<Chip
									size="sm"
									color={chipColor}
									variant="flat"
									className="font-medium"
									startContent={
										<div
											className="w-2.5 h-2.5 rounded-full"
											style={{ backgroundColor: item.color }}
										/>
									}
								>
									{item.label}
								</Chip>
								<div className="flex flex-col gap-1">
									<span className="text-xs text-default-500 font-medium">
										{item.value}
									</span>
									<span className="text-sm font-bold text-default-700">
										{item.percentage}%
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</CardBody>
		</Card>
	);
}

// Helper function para convertir coordenadas polares a cartesianas
function polarToCartesian(
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number,
) {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
}
