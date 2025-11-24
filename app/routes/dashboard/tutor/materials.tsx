import { Card, CardBody, Chip, Spinner } from '@heroui/react';
import { Download, Eye, Star } from 'lucide-react';
import { useMaterials } from '~/lib/hooks/useMaterials';

export default function TutorMaterials() {
	const { data: materials = [], isLoading, error } = useMaterials();

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

			{/* Estado de carga */}
			{isLoading && (
				<div className="flex justify-center py-12">
					<div className="text-center">
						<Spinner size="lg" color="primary" />
						<p className="mt-4 text-default-600">Cargando...</p>
					</div>
				</div>
			)}

			{/* Sin resultados */}
			{!isLoading && materials.length === 0 && (
				<Card>
					<CardBody>
						<div className="text-center py-12">
							<div className="text-6xl mb-4">📚</div>
							<h3 className="text-xl font-semibold mb-2">Sin resultados</h3>
							<p className="text-default-500">No se encontraron materiales.</p>
						</div>
					</CardBody>
				</Card>
			)}

			{/* Lista de materiales */}
			{!isLoading && materials.length > 0 && (
				<div className="grid gap-4">
					{materials.map((material) => (
						<Card
							key={material.id}
							className="hover:shadow-md transition-shadow"
						>
							<CardBody className="p-6">
								<div className="flex justify-between items-start">
									<div className="flex-1">
										<div className="flex items-start justify-between mb-3">
											<div>
												<h3 className="text-lg font-semibold mb-1">
													{material.nombre}
												</h3>
												<p className="text-sm text-default-600">
													Por: {material.tutor}
												</p>
											</div>
											<div className="flex items-center gap-1">
												<Star className="w-4 h-4 text-yellow-500 fill-current" />
												<span className="text-sm font-medium">
													{material.calificacion.toFixed(1)}
												</span>
											</div>
										</div>
										<div className="flex flex-wrap gap-2 mb-3">
											<Chip size="sm" variant="flat" color="primary">
												{material.materia}
											</Chip>
											<Chip size="sm" variant="flat" color="secondary">
												{material.tipo}
											</Chip>
											<Chip size="sm" variant="flat">
												Semestre {material.semestre}
											</Chip>
										</div>
										<div className="flex items-center gap-4 text-sm text-default-500">
											<div className="flex items-center gap-1">
												<Eye className="w-4 h-4" />
												<span>{material.vistas} vistas</span>
											</div>
											<div className="flex items-center gap-1">
												<Download className="w-4 h-4" />
												<span>{material.descargas} descargas</span>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
