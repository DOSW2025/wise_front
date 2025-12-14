import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from '@heroui/react';
import { Download, FileText, Flag, MessageSquare, Share2 } from 'lucide-react';
import { useState } from 'react';
import CommentsSection from './CommentsSection';
import RatingStars from './ratingStars';
import type { Material } from './types';

interface PreviewModalProps {
	material: Material | null;
	isOpen: boolean;
	userRating: number;
	onClose: () => void;
	onDownload: (materialId: string) => void;
	onShare: (material: Material) => void;
	onReport: (material: Material) => void;
	onRate: (material: Material, rating: number) => void;
	onComment: (material: Material) => void;
	onRatingChange: (rating: number) => void;
	onAddComment: (materialId: string, content: string) => void;
}

export default function PreviewModal({
	material,
	isOpen,
	userRating,
	onClose,
	onDownload,
	onShare,
	onReport,
	onRate,
	onRatingChange,
	onAddComment,
}: PreviewModalProps) {
	const [showComments, setShowComments] = useState(false);

	if (!material) return null;

	const handleAddComment = (content: string) => {
		onAddComment(material.id, content);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
			<ModalContent>
				<ModalHeader className="border-b">
					<div className="flex items-center gap-4">
						<div className={`p-3 rounded-lg bg-red-50 text-red-600`}>
							<FileText size={32} />
						</div>
						<div className="flex-1">
							<h2 className="text-xl font-bold">{material.title}</h2>
							<p className="text-sm text-gray-600">
								{material.author} • {material.subject} • {material.semester} •{' '}
								{material.date}
							</p>
						</div>
					</div>
				</ModalHeader>

				<ModalBody className="p-6">
					{/* Tags del material */}
					{material.tags && material.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 mb-4">
							{material.tags.map((tag) => (
								<Chip key={tag} size="sm" variant="flat" color="primary">
									{tag}
								</Chip>
							))}
						</div>
					)}

					{/* Información del archivo */}
					<div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Chip
									size="sm"
									variant="flat"
									className="bg-[#8B1A1A] text-white"
								>
									{material.fileType}
								</Chip>
								<span className="text-sm text-gray-600">Documento</span>
							</div>

							<div className="flex items-center gap-4 text-sm">
								<div className="flex items-center gap-1">
									<RatingStars rating={material.rating} size={16} />
									<span className="font-medium ml-2">{material.rating}</span>
									<span className="text-gray-500">
										({material.ratingsCount})
									</span>
								</div>
								<div className="flex items-center gap-1 text-gray-600">
									<Download size={16} />
									<span>{material.downloads} descargas</span>
								</div>
								<div className="flex items-center gap-1 text-gray-600">
									<MessageSquare size={16} />
									<span>{material.comments} comentarios</span>
								</div>
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<Share2 size={16} />}
								onClick={() => onShare(material)}
								type="button"
							>
								Compartir
							</Button>
							<Button
								className="bg-[#8B1A1A] text-white"
								startContent={<Download size={16} />}
								onClick={() => onDownload(material.id)}
								type="button"
							>
								Descargar
							</Button>
						</div>
					</div>

					{/* Área de vista previa */}
					{material && (
						<div className="border rounded-lg overflow-hidden mb-6 bg-gray-50">
							{material.fileType === 'PDF' && (
								<div className="space-y-2">
									{/* Viewer alternativo con Google Docs */}
									<div className="relative w-full bg-white">
										<iframe
											src={`https://docs.google.com/gview?url=${encodeURIComponent(material.fileUrl || '')}&embedded=true`}
											className="w-full h-96 border-0"
											title={`Vista previa de ${material.title}`}
											sandbox="allow-same-origin allow-scripts allow-popups"
										/>
									</div>
									<div className="p-4 text-center text-sm text-gray-600">
										<p className="mb-2">
											Vista previa del documento. Descarga para ver en mejor
											calidad.
										</p>
									</div>
								</div>
							)}
							{material.fileType !== 'PDF' && (
								<div className="p-8 text-center">
									<FileText size={64} className="mx-auto mb-4 text-gray-400" />
									<h3 className="text-lg font-semibold mb-2">
										{material.fileType} • {material.title}
									</h3>
									<p className="text-gray-600 mb-4">
										Vista previa no disponible para este tipo de archivo.
									</p>
									<Button
										className="bg-[#8B1A1A] text-white"
										startContent={<Download size={16} />}
										onClick={() => onDownload(material.id)}
										type="button"
									>
										Descargar {material.fileType}
									</Button>
								</div>
							)}
						</div>
					)}
					{/* Descripción */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-3">Descripción</h3>
						<p className="text-gray-700">{material.description}</p>
					</div>

					{/* Valoración */}
					<div className="border-t pt-6">
						<h3 className="text-lg font-semibold mb-4">
							Valorar este material
						</h3>
						<div className="flex items-center gap-4 mb-4">
							<RatingStars
								rating={userRating}
								onRatingChange={onRatingChange}
							/>
							<span className="text-sm text-gray-600">
								{userRating > 0
									? `Tu valoración: ${userRating} estrellas`
									: 'Selecciona tu valoración'}
							</span>
						</div>

						<div className="flex gap-2">
							<Button
								className="bg-[#8B1A1A] text-white"
								isDisabled={userRating === 0}
								onClick={() => onRate(material, userRating)}
								type="button"
							>
								Enviar valoración
							</Button>
							<Button
								variant="flat"
								startContent={<MessageSquare size={16} />}
								onClick={() => setShowComments(!showComments)}
								type="button"
							>
								{showComments ? 'Ocultar comentarios' : 'Ver comentarios'}
							</Button>
							<Button
								variant="light"
								startContent={<Flag size={16} />}
								onClick={() => onReport(material)}
								type="button"
							>
								Reportar
							</Button>
						</div>
					</div>

					{/*  SECCIÓN: Comentarios */}
					<CommentsSection
						comments={material.commentsList}
						onAddComment={handleAddComment}
						isOpen={showComments}
						onClose={() => setShowComments(false)}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
