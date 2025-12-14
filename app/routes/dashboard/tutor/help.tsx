import { Card, CardBody } from '@heroui/react';

export default function TutorHelp() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Centro de Ayuda</h1>
				<p className="text-default-500">
					Encuentra respuestas y soporte técnico.
				</p>
			</div>

			<Card>
				<CardBody>
					<p className="text-center text-default-500 py-8">
						Próximamente: Centro de ayuda y documentación
					</p>
				</CardBody>
			</Card>
		</div>
	);
}
