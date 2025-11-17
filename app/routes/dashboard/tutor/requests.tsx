import { Card, CardBody } from '@heroui/react';

export default function TutorRequests() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Solicitudes Pendientes
				</h1>
				<p className="text-default-500">
					Revisa y gestiona las solicitudes de tutoría.
				</p>
			</div>

			<Card>
				<CardBody>
					<p className="text-center text-default-500 py-8">
						Próximamente: Vista de solicitudes pendientes
					</p>
				</CardBody>
			</Card>
		</div>
	);
}
