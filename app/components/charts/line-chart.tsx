import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { useState } from 'react';

interface LineChartData {
	month: string;
	value: number;
}

interface LineChartProps {
	title: string;
	data: LineChartData[];
	tabs?: { label: string; value: string }[];
	activeTab?: string;
	onTabChange?: (tab: string) => void;
	color?: string;
	yAxisLabel?: string;
	semanticColor?: 'primary' | 'danger' | 'success' | 'warning';
}

export function LineChart({
	title,
	data,
	tabs,
	activeTab = tabs?.[0]?.value || 'default',
	onTabChange,
	color,
	semanticColor = 'primary',
}: LineChartProps) {
	const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

	// Mapear colores semánticos a valores hex
	const colorMap = {
		primary: '#3b82f6', // Azul
		danger: '#ef4444', // Rojo
		success: '#10b981', // Verde
		warning: '#f59e0b', // Naranja
	};

	const finalColor = color || colorMap[semanticColor];

	const chartHeight = 320;
	const chartWidth = 800;
	const paddingTop = 40;
	const paddingRight = 40;
	const paddingBottom = 60;
	const paddingLeft = 60;

	// Encontrar valores mín y máx
	const values = data.map((d) => d.value);
	const maxVal = Math.max(...values);
	const minVal = Math.min(...values);

	// Calcular rango con margen para mejor visualización
	let minValue = minVal;
	let maxValue = maxVal;
	const range = maxVal - minVal;

	// Si el rango es muy pequeño, expandir para mejor visualización
	if (range < 1) {
		const padding = Math.max(0.5, range * 0.2);
		minValue = Math.max(0, minVal - padding);
		maxValue = maxVal + padding;
	} else if (range === 0) {
		minValue = Math.max(0, maxVal - 1);
		maxValue = maxVal + 1;
	}

	const yRange = maxValue - minValue || 1;

	// Dimensiones del gráfico
	const graphWidth = chartWidth - paddingLeft - paddingRight;
	const graphHeight = chartHeight - paddingTop - paddingBottom;

	// Crear puntos SVG
	const points = data.map((d, i) => {
		const x = paddingLeft + (i / Math.max(data.length - 1, 1)) * graphWidth;
		const y =
			paddingTop + graphHeight - ((d.value - minValue) / yRange) * graphHeight;
		return { x, y, value: d.value, month: d.month };
	});

	// Y-axis labels (8 divisiones)
	const yLabels: number[] = [];
	for (let i = 0; i <= 8; i++) {
		const val = minValue + (yRange / 8) * i;
		// Si el rango es muy pequeño (como en calificaciones), mostrar decimales
		yLabels.push(yRange < 2 ? Math.round(val * 10) / 10 : Math.round(val));
	}

	return (
		<Card className="w-full border border-default-200 bg-white shadow-sm">
			<CardHeader className="flex justify-between items-center px-6 py-5 border-b border-default-100">
				<h3 className="text-lg font-bold text-foreground tracking-tight">
					{title}
				</h3>
				{tabs && (
					<div className="flex gap-3">
						{tabs.map((tab, index) => {
							const isActive = activeTab === tab.value;
							const tabColors: (
								| 'primary'
								| 'danger'
								| 'success'
								| 'warning'
							)[] = ['primary', 'danger'];
							const selectedColor = tabColors[index] || 'default';
							return (
								<Button
									key={tab.value}
									size="sm"
									onPress={() => onTabChange?.(tab.value)}
									color={isActive ? selectedColor : 'default'}
									variant={isActive ? 'solid' : 'bordered'}
									className={`font-medium ${isActive ? '' : 'border-default-300'}`}
								>
									{tab.label}
								</Button>
							);
						})}
					</div>
				)}
			</CardHeader>
			<CardBody className="px-8 py-6" style={{ minHeight: `${chartHeight}px` }}>
				<svg
					viewBox={`0 0 ${chartWidth} ${chartHeight}`}
					className="w-full"
					preserveAspectRatio="xMidYMid meet"
				>
					{/* Grid lines horizontales */}
					{yLabels.map((val, i) => {
						const y = paddingTop + (i / 8) * graphHeight;
						return (
							<g key={`grid-${i}`}>
								<line
									x1={paddingLeft}
									y1={y}
									x2={chartWidth - paddingRight}
									y2={y}
									stroke="#f3f4f6"
									strokeWidth="1"
									strokeDasharray="4"
								/>
								<text
									x={paddingLeft - 15}
									y={y + 5}
									textAnchor="end"
									fontSize="12"
									fill="#9ca3af"
									fontWeight="500"
								>
									{val}
								</text>
							</g>
						);
					})}

					{/* Y-axis línea */}
					<line
						x1={paddingLeft}
						y1={paddingTop}
						x2={paddingLeft}
						y2={chartHeight - paddingBottom}
						stroke="#d1d5db"
						strokeWidth="2"
					/>

					{/* X-axis línea */}
					<line
						x1={paddingLeft}
						y1={chartHeight - paddingBottom}
						x2={chartWidth - paddingRight}
						y2={chartHeight - paddingBottom}
						stroke="#d1d5db"
						strokeWidth="2"
					/>

					{/* X-axis labels */}
					{points.map((p, i) => (
						<text
							key={`label-${i}`}
							x={p.x}
							y={chartHeight - paddingBottom + 25}
							textAnchor="middle"
							fontSize="12"
							fill="#6b7280"
							fontWeight="500"
						>
							{p.month}
						</text>
					))}

					{/* Línea principal */}
					<path
						d={points
							.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
							.join(' ')}
						fill="none"
						stroke={finalColor}
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Puntos */}
					{points.map((p, i) => (
						<g key={`point-${i}`}>
							<circle
								cx={p.x}
								cy={p.y}
								r="5"
								fill={finalColor}
								className="cursor-pointer hover:opacity-80 transition-opacity"
								onMouseEnter={() => setHoveredPoint(i)}
								onMouseLeave={() => setHoveredPoint(null)}
							/>
							{/* Área invisible para mejor interactividad */}
							<circle
								cx={p.x}
								cy={p.y}
								r="12"
								fill="transparent"
								className="cursor-pointer"
								onMouseEnter={() => setHoveredPoint(i)}
								onMouseLeave={() => setHoveredPoint(null)}
							/>
							{/* Tooltip */}
							{hoveredPoint === i && (
								<g>
									<rect
										x={p.x - 45}
										y={p.y - 40}
										width="90"
										height="35"
										fill="white"
										stroke={finalColor}
										strokeWidth="2"
										rx="4"
										filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
									/>
									<text
										x={p.x}
										y={p.y - 24}
										textAnchor="middle"
										fontSize="12"
										fontWeight="600"
										fill={finalColor}
									>
										{p.month}
									</text>
									<text
										x={p.x}
										y={p.y - 8}
										textAnchor="middle"
										fontSize="14"
										fontWeight="700"
										fill="#1f2937"
									>
										{semanticColor === 'danger' ? 'sesiones' : 'calificación'}
										{': '}
										{p.value}
									</text>
								</g>
							)}
						</g>
					))}
				</svg>
			</CardBody>
		</Card>
	);
}
