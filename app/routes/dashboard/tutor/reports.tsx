import { Card, CardBody } from '@heroui/react';

export default function TutorReports() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Reportes y Métricas
				</h1>
				<p className="text-default-500">Analiza tu desempeño y estadísticas.</p>
			</div>

			<Card>
				<CardBody>
					<p className="text-center text-default-500 py-8">
						Próximamente: Reportes y métricas detalladas
					</p>
				</CardBody>
			</Card>
		</div>
	);
}
