import { Card, CardBody, CardHeader, Link } from '@heroui/react';

interface BarChartData {
	label: string;
	value: number;
	maxValue?: number;
}

interface BarChartProps {
	title: string;
	data: BarChartData[];
	height?: number;
	detailsLink?: string;
	color?: string;
	semanticColor?: 'primary' | 'danger' | 'success' | 'warning';
}

export function BarChart({
	title,
	data,
	height = 420,
	detailsLink,
	color,
	semanticColor = 'primary',
}: BarChartProps) {
	// Mapear colores semánticos a valores hex
	const colorMap = {
		primary: '#3b82f6', // Azul
		danger: '#ef4444', // Rojo
		success: '#10b981', // Verde
		warning: '#f59e0b', // Naranja
	};

	const finalColor = color || colorMap[semanticColor];
	const maxValue = Math.max(...data.map((d) => d.maxValue || d.value));

	// Generar escala en el eje Y (0, 90, 180, 270, 360)
	const yAxisSteps = 4;
	const stepValue = Math.ceil(maxValue / yAxisSteps / 90) * 90;
	const yAxisLabels = Array.from(
		{ length: yAxisSteps + 1 },
		(_, i) => i * stepValue,
	);

	return (
		<Card className="w-full border border-default-200 bg-white shadow-sm">
			<CardHeader className="flex justify-between items-center px-6 py-5 border-b border-default-100">
				<h3 className="text-lg font-bold text-foreground tracking-tight">
					{title}
				</h3>
				{detailsLink && (
					<Link
						href={detailsLink}
						color="primary"
						className="text-xs font-semibold"
					>
						Ver detalles
					</Link>
				)}
			</CardHeader>
			<CardBody className="px-6 py-6" style={{ minHeight: `${height}px` }}>
				<svg
					viewBox="0 0 1200 400"
					className="w-full"
					preserveAspectRatio="xMidYMid meet"
				>
					{/* Y-axis */}
					<line
						x1="60"
						y1="20"
						x2="60"
						y2="360"
						stroke="#e5e7eb"
						strokeWidth="2"
					/>

					{/* Y-axis labels and grid lines */}
					{yAxisLabels.reverse().map((label, idx) => {
						const y = 20 + (idx / yAxisSteps) * 340;
						return (
							<g key={label}>
								{/* Grid line */}
								<line
									x1="60"
									y1={y}
									x2="1180"
									y2={y}
									stroke="#f3f4f6"
									strokeWidth="1"
									strokeDasharray="4,4"
								/>
								{/* Y-axis label */}
								<text
									x="45"
									y={y + 5}
									fontSize="12"
									textAnchor="end"
									fill="#9ca3af"
									fontWeight="500"
								>
									{label}
								</text>
							</g>
						);
					})}

					{/* Bars */}
					{data.map((item, idx) => {
						const barHeight = (item.value / (stepValue * yAxisSteps)) * 340;
						const x = 120 + idx * 200;
						const y = 360 - barHeight;
						const barWidth = 80;

						return (
							<g key={item.label}>
								{/* Bar */}
								<rect
									x={x - barWidth / 2}
									y={y}
									width={barWidth}
									height={barHeight}
									fill={finalColor}
									rx="6"
									className="hover:opacity-80 cursor-pointer transition-opacity"
								/>
								{/* Label */}
								<text
									x={x}
									y="385"
									fontSize="14"
									textAnchor="middle"
									fill="#6b7280"
									fontWeight="600"
									className="font-semibold"
								>
									{item.label}
								</text>
								{/* Value tooltip on hover */}
								<title>{item.value}</title>
							</g>
						);
					})}
				</svg>
			</CardBody>
		</Card>
	);
}
