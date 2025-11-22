import { PageHeader } from '~/components/page-header';

export default function AdminProfile() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Perfil"
				description="Administra tu información personal y preferencias"
			/>

			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-default-500 text-lg">
					Página de perfil - Contenido por implementar
				</p>
			</div>
		</div>
	);
}
