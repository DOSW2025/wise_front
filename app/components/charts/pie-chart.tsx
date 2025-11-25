import { Card, CardBody, CardHeader } from '@heroui/react';

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

export function PieChart({ title, data, size = 200 }: PieChartProps) {
	const radius = size / 2;
	const circumference = 2 * Math.PI * radius;

	// Calcular los segmentos del pastel
	let currentAngle = -90; // Empezar en la parte superior
	const segments = data.map((item, index) => {
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
		};
	});

	return (
		<Card className="w-full">
			<CardHeader className="flex justify-between items-center px-6 py-4 border-b border-default-100">
				<h3 className="text-lg font-semibold text-foreground">{title}</h3>
			</CardHeader>
			<CardBody className="flex flex-col md:flex-row items-center justify-center gap-8 p-8">
				{/* SVG Pie Chart */}
				<div className="flex justify-center">
					<svg
						width={size}
						height={size}
						viewBox={`0 0 ${size} ${size}`}
						className="drop-shadow-sm"
					>
						{segments.map((segment, index) => (
							<path
								key={index}
								d={segment.pathData}
								fill={segment.color}
								stroke="white"
								strokeWidth="2"
								className="transition-opacity duration-300 hover:opacity-80 cursor-pointer"
							/>
						))}
					</svg>
				</div>

				{/* Leyenda */}
				<div className="flex flex-col gap-3">
					{data.map((item, index) => (
						<div key={index} className="flex items-center gap-2">
							<div
								className="w-4 h-4 rounded"
								style={{ backgroundColor: item.color }}
							/>
							<span className="text-sm text-default-700">
								{item.label}: {item.percentage}%
							</span>
						</div>
					))}
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
