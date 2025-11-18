import { EmptyState } from '~/components/empty-state';

export default function StudentMaterials() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Materiales de Estudio
				</h1>
				<p className="text-default-500">
					Explora y descarga materiales compartidos por la comunidad
				</p>
			</div>

			<EmptyState
				title="Próximamente: Banco de Materiales"
				description="Esta funcionalidad estará disponible pronto"
			/>
		</div>
	);
}
