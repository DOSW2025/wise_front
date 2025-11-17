import { Card, CardBody } from '@heroui/react';

export default function TutorMaterials() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Banco de Materiales
				</h1>
				<p className="text-default-500">
					Gestiona y comparte materiales educativos.
				</p>
			</div>

			<Card>
				<CardBody>
					<p className="text-center text-default-500 py-8">
						Próximamente: Gestión de materiales
					</p>
				</CardBody>
			</Card>
		</div>
	);
}
