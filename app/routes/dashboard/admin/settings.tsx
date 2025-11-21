import { PageHeader } from '~/components/page-header';

export default function AdminSettings() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Configuración"
				description="Configura los parámetros generales de la plataforma"
			/>

			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-default-500 text-lg">
					Página de configuración - Contenido por implementar
				</p>
			</div>
		</div>
	);
}
