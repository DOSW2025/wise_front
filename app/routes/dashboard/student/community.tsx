import { EmptyState } from '~/components/empty-state';

export default function StudentCommunity() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Comunidad ECIWISE+
				</h1>
				<p className="text-default-500">
					Conecta con otros estudiantes y tutores, comparte conocimiento
				</p>
			</div>

			<EmptyState
				title="Próximamente: Comunidad Académica"
				description="Esta funcionalidad estará disponible pronto"
			/>
		</div>
	);
}
