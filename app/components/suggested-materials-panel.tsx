import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Download, FileText } from 'lucide-react';

interface SuggestedMaterial {
	id: string;
	title: string;
	subject: string;
	rating: number;
	type: 'PDF' | 'DOC';
	fileUrl?: string;
}

const mockSuggestedMaterials: SuggestedMaterial[] = [
	{
		id: '1',
		title: 'Guía completa de integrales',
		subject: 'Matemáticas',
		rating: 4.8,
		type: 'PDF',
	},
	{
		id: '2',
		title: 'Python para principiantes',
		subject: 'Programación',
		rating: 4.9,
		type: 'DOC',
	},
	{
		id: '3',
		title: 'Física - Leyes de Newton',
		subject: 'Física',
		rating: 4.7,
		type: 'PDF',
	},
];

export function SuggestedMaterialsPanel() {
	const handleDownload = (material: SuggestedMaterial) => {
		// Simulación de descarga
		console.log(`Descargando: ${material.title}`);

		// En producción, reemplazar con la URL real del archivo
		if (material.fileUrl) {
			const link = document.createElement('a');
			link.href = material.fileUrl;
			link.download = `${material.title}.${material.type.toLowerCase()}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}

		// Si no hay URL, mostrar un mensaje de simulación
		alert(`Descargando: ${material.title}`);
	};

	return (
		<Card className="bg-gradient-to-br from-default-50 to-default-100 border border-default-200">
			<CardBody className="gap-4">
				{/* Header */}
				<div className="flex items-center gap-2">
					<div className="p-2 bg-red-100 rounded-lg">
						<FileText className="w-5 h-5 text-red-600" />
					</div>
					<h2 className="text-lg font-semibold text-foreground">
						Materiales Sugeridos
					</h2>
					<Button size="sm" variant="light" color="danger" className="ml-auto">
						Ver más
					</Button>
				</div>

				{/* Materials List */}
				<div className="space-y-3">
					{mockSuggestedMaterials.map((material) => (
						<div
							key={material.id}
							className="flex items-center justify-between p-3 bg-white rounded-lg border border-default-200 hover:shadow-md transition-shadow"
						>
							{/* Left Section - Material Info */}
							<div className="flex items-start gap-3 flex-1">
								{/* Icon */}
								<div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
									<span className="text-xs font-bold text-red-600">
										{material.type}
									</span>
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<p className="font-medium text-sm text-foreground line-clamp-1">
										{material.title}
									</p>
									<div className="flex items-center gap-2 mt-1">
										<span className="text-xs text-default-500">
											{material.subject}
										</span>
										<span className="text-xs text-yellow-500 font-semibold">
											★ {material.rating}
										</span>
									</div>
								</div>
							</div>

							{/* Right Section - Download Button */}
							<Button
								isIconOnly
								size="sm"
								variant="flat"
								color="danger"
								className="flex-shrink-0"
								onPress={() => handleDownload(material)}
								aria-label={`Descargar ${material.title}`}
							>
								<Download className="w-4 h-4" />
							</Button>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
