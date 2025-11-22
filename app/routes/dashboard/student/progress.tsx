import { EmptyState } from '~/components/empty-state';

export default function StudentProgress() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">
					Mi Progreso Académico
				</h1>
				<p className="text-default-500">
					Seguimiento de tu rendimiento y avance en las materias
				</p>
			</div>

			<EmptyState
				title="Próximamente: Seguimiento de Progreso"
				description="Esta funcionalidad estará disponible pronto"
			/>
		</div>
	);
}
