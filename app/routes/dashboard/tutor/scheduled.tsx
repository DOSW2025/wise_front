import { Card, CardBody } from '@heroui/react';

export default function TutorScheduled() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Sesiones Programadas
				</h1>
				<p className="text-default-500">
					Gestiona tus próximas sesiones de tutoría.
				</p>
			</div>

			<Card>
				<CardBody>
					<p className="text-center text-default-500 py-8">
						Próximamente: Vista de sesiones programadas
					</p>
				</CardBody>
			</Card>
		</div>
	);
}
