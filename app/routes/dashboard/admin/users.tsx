import { PageHeader } from '~/components/page-header';

export default function AdminUsers() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="Gestión de Usuarios"
				description="Administra los usuarios registrados en la plataforma"
			/>

			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-default-500 text-lg">
					Página de gestión de usuarios - Contenido por implementar
				</p>
			</div>
		</div>
	);
}
