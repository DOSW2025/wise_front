import {
	Card,
	CardBody,
	CardHeader,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';

interface SubjectDetailData {
	subject: string;
	sessions: number;
	totalHours: string;
	averageDuration: string;
}

interface SubjectDetailTableProps {
	title?: string;
	data: SubjectDetailData[];
}

export function SubjectDetailTable({
	title = 'Detalle por Materia',
	data,
}: SubjectDetailTableProps) {
	return (
		<Card className="w-full">
			<CardHeader className="flex items-center px-6 py-4 border-b border-default-100">
				<h3 className="text-lg font-semibold text-foreground">{title}</h3>
			</CardHeader>
			<CardBody className="p-0">
				<Table
					aria-label="Tabla de detalles por materia"
					className="w-full"
					classNames={{
						wrapper: 'shadow-none',
						th: 'bg-default-100 text-default-900 font-semibold',
						td: 'py-4 px-6',
					}}
				>
					<TableHeader>
						<TableColumn className="text-default-700 font-semibold">
							Materia
						</TableColumn>
						<TableColumn
							align="center"
							className="text-default-700 font-semibold"
						>
							Sesiones
						</TableColumn>
						<TableColumn
							align="center"
							className="text-default-700 font-semibold"
						>
							Horas Totales
						</TableColumn>
						<TableColumn
							align="center"
							className="text-default-700 font-semibold"
						>
							Promedio
						</TableColumn>
					</TableHeader>
					<TableBody>
						{data.map((row) => (
							<TableRow
								key={row.subject}
								className="border-b border-default-100 hover:bg-default-50 transition-colors"
							>
								<TableCell className="font-medium text-default-900">
									{row.subject}
								</TableCell>
								<TableCell align="center" className="text-default-700">
									{row.sessions}
								</TableCell>
								<TableCell align="center" className="text-default-700">
									{row.totalHours}
								</TableCell>
								<TableCell align="center">
									<Chip
										className="capitalize"
										color="success"
										size="sm"
										variant="flat"
										startContent={
											<svg
												className="w-3 h-3"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										}
									>
										{row.averageDuration}
									</Chip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	);
}
