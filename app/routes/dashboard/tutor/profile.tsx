import { Card, CardBody } from '@heroui/react';

export default function TutorProfile() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Perfil</h1>
				<p className="text-default-500">
					Gestiona tu información personal y configuración.
				</p>
			</div>

			<Card>
				<CardBody>
					<p className="text-center text-default-500 py-8">
						Próximamente: Gestión de perfil del tutor
					</p>
				</CardBody>
			</Card>
		</div>
	);
}
