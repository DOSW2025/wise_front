import { Card, CardBody } from '@heroui/react';

export default function TutorCommunity() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Comunidad</h1>
				<p className="text-default-500">
					Conecta con otros tutores y estudiantes.
				</p>
			</div>

			<Card>
				<CardBody>
					<p className="text-center text-default-500 py-8">
						Próximamente: Funciones de comunidad
					</p>
				</CardBody>
			</Card>
		</div>
	);
}
