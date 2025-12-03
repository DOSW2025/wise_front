import { Button, Card, CardBody, CardFooter, Chip } from '@heroui/react';
import { Download, Eye, FileText, MessageSquare, Star } from 'lucide-react';
import type { Material } from './types';
import { fileTypeColors } from './types';

interface MaterialCardProps {
	material: Material;
	viewMode: 'grid' | 'list';
	onPreview: (material: Material) => void;
	onDownload: (materialId: string) => void;
	onRate: (material: Material) => void;
	onComment: (material: Material) => void;
}

export default function MaterialCard({
	material,
	viewMode,
	onPreview,
	onDownload,
	onRate,
	onComment,
}: MaterialCardProps) {
	if (viewMode === 'grid') {
		return (
			<Card className="hover:shadow-lg transition-shadow border">
				<CardBody className="p-6">
					<div className="flex items-start justify-between mb-4">
						<div
							className={`p-4 rounded-lg ${fileTypeColors[material.fileType]}`}
						>
							<FileText size={32} />
						</div>
						<Chip size="sm" variant="flat" className="bg-[#8B1A1A] text-white">
							{material.fileType}
						</Chip>
					</div>

					<h3 className="font-semibold text-lg mb-2 line-clamp-2">
						{material.title}
					</h3>

					<div className="space-y-1 text-sm text-gray-600 mb-4">
						<p>{material.author}</p>
						<p>
							{material.subject} • {material.semester}
						</p>
						<p>{material.date}</p>
					</div>

					<div className="flex items-center gap-4 text-sm mb-4">
						<div className="flex items-center gap-1">
							<Star size={16} className="text-yellow-500 fill-yellow-500" />
							<span className="font-medium">{material.rating}</span>
							<span className="text-gray-500">({material.ratingsCount})</span>
						</div>
						<div className="flex items-center gap-1 text-gray-600">
							<Download size={16} />
							<span>{material.downloads}</span>
						</div>
						<div className="flex items-center gap-1 text-gray-600">
							<MessageSquare size={16} />
							<span>{material.comments}</span>
						</div>
					</div>
				</CardBody>

				<CardFooter className="border-t p-4 gap-2 flex-col">
					<div className="flex gap-2 w-full mb-2">
						<Button
							variant="flat"
							className="flex-1"
							startContent={<Eye size={18} />}
							onClick={() => onPreview(material)}
							type="button"
						>
							Vista previa
						</Button>
						<Button
							className="flex-1 bg-[#8B1A1A] text-white"
							startContent={<Download size={18} />}
							onClick={() => onDownload(material.id)}
							type="button"
						>
							Descargar
						</Button>
					</div>

					<div className="flex gap-2 w-full">
						<Button
							variant="light"
							className="flex-1"
							startContent={<Star size={16} />}
							onClick={() => onRate(material)}
							type="button"
						>
							Valorar
						</Button>
						<Button
							variant="light"
							className="flex-1"
							startContent={<MessageSquare size={16} />}
							onClick={() => onComment(material)}
							type="button"
						>
							Comentar
						</Button>
					</div>
				</CardFooter>
			</Card>
		);
	}

	// Vista lista
	return (
		<Card className="hover:shadow-md transition-shadow border">
			<CardBody className="p-6">
				<div className="flex items-center gap-6">
					<div
						className={`p-4 rounded-lg ${fileTypeColors[material.fileType]}`}
					>
						<FileText size={24} />
					</div>

					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-lg mb-1">{material.title}</h3>
						<div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
							<span>{material.author}</span>
							<span>•</span>
							<span>{material.subject}</span>
							<span>•</span>
							<span>{material.semester}</span>
							<span>•</span>
							<span>{material.date}</span>
						</div>

						<div className="flex items-center gap-4 text-sm">
							<div className="flex items-center gap-1">
								<Star size={16} className="text-yellow-500 fill-yellow-500" />
								<span className="font-medium">{material.rating}</span>
								<span className="text-gray-500">({material.ratingsCount})</span>
							</div>
							<div className="flex items-center gap-1 text-gray-600">
								<Download size={16} />
								<span>{material.downloads}</span>
							</div>
							<div className="flex items-center gap-1 text-gray-600">
								<MessageSquare size={16} />
								<span>{material.comments}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="light"
							startContent={<Star size={16} />}
							onClick={() => onRate(material)}
						>
							Valorar
						</Button>
						<Button
							variant="light"
							startContent={<MessageSquare size={16} />}
							onClick={() => onComment(material)}
						>
							Comentar
						</Button>
						<Button
							variant="flat"
							startContent={<Eye size={16} />}
							onClick={() => onPreview(material)}
						>
							Vista previa
						</Button>
						<Button
							className="bg-[#8B1A1A] text-white"
							size="sm"
							startContent={<Download size={16} />}
							onClick={() => onDownload(material.id)}
						>
							Descargar
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
