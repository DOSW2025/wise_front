import { PageHeader } from '~/components/page-header';

export default function AdminHelp() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Centro de Ayuda"
				description="Encuentra respuestas a las preguntas más frecuentes"
			/>

			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-default-500 text-lg">
					Página de centro de ayuda - Contenido por implementar
				</p>
			</div>
		</div>
	);
}
