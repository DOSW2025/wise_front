import {
	Button,
	Card,
	CardBody,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Spinner,
	Textarea,
} from '@heroui/react';
import { MessageCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '~/contexts/auth-context';
import { useMaterialComments, useRateMaterial } from '~/lib/hooks/useMaterials';
import type { Material, MaterialRating } from '~/lib/types/api.types';
import type { Material as MaterialCardType } from './types';

interface RatingAndCommentsModalProps {
	material: (MaterialCardType & Partial<Material>) | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function RatingAndCommentsModal({
	material,
	isOpen,
	onClose,
}: RatingAndCommentsModalProps) {
	const { user } = useAuth();
	const [userRating, setUserRating] = useState(0);
	const [newComment, setNewComment] = useState('');
	const [hoveredRating, setHoveredRating] = useState(0);

	const { data: comments = [], isLoading: isLoadingComments } =
		useMaterialComments(material?.id || '');
	const rateMaterial = useRateMaterial();

	if (!material) return null;

	const handleSubmitRating = async () => {
		if (userRating > 0 && user?.id && newComment.trim()) {
			try {
				await rateMaterial.mutateAsync({
					id: material.id,
					rating: userRating,
					userId: user.id,
					comentario: newComment.trim(),
				});
				setUserRating(0);
				setNewComment('');
			} catch (error) {
				console.error('Error al calificar:', error);
			}
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<h2 className="text-xl font-semibold">{material.title}</h2>
					<p className="text-sm text-gray-600">
						Valoriza y comenta este material
					</p>
				</ModalHeader>

				<ModalBody className="gap-6 pb-6">
					{/* Sección de Valoración */}
					<div className="border rounded-lg p-4 bg-gray-50">
						<h3 className="font-semibold mb-4 flex items-center gap-2">
							<Star size={18} className="text-yellow-500" />
							Tu Valoración
						</h3>

						<div className="flex gap-4 items-center mb-4">
							<div className="flex gap-2">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										onClick={() => setUserRating(star)}
										onMouseEnter={() => setHoveredRating(star)}
										onMouseLeave={() => setHoveredRating(0)}
										className="transition-all transform hover:scale-110"
										type="button"
									>
										<Star
											size={32}
											className={`${
												star <= (hoveredRating || userRating)
													? 'text-yellow-500 fill-yellow-500'
													: 'text-gray-300'
											}`}
										/>
									</button>
								))}
							</div>
							{userRating > 0 && (
								<span className="text-sm font-medium text-gray-700">
									{userRating} de 5 estrellas
								</span>
							)}
						</div>

						{/* Área de comentario obligatorio */}
						<div className="mb-4">
							<label
								htmlFor="rating-comment"
								className="text-sm text-gray-600 block mb-2"
							>
								Comentario <span className="text-red-500">*</span>
							</label>
							<Textarea
								id="rating-comment"
								placeholder="Comparte tu opinión sobre este material..."
								value={newComment}
								onValueChange={setNewComment}
								minRows={3}
								maxRows={5}
								disabled={userRating === 0}
							/>
						</div>

						<Button
							className="w-full bg-[#8B1A1A] text-white"
							onClick={handleSubmitRating}
							isDisabled={
								userRating === 0 || !newComment.trim() || rateMaterial.isPending
							}
							isLoading={rateMaterial.isPending}
							type="button"
						>
							Enviar valoración y comentario
						</Button>
					</div>

					{/* Sección de Comentarios Existentes */}
					<div className="border rounded-lg p-4">
						<h3 className="font-semibold mb-4 flex items-center gap-2">
							<MessageCircle size={18} />
							Comentarios ({comments?.length || 0})
						</h3>

						{/* Lista de comentarios */}
						{isLoadingComments ? (
							<div className="flex justify-center py-8">
								<Spinner size="lg" />
							</div>
						) : comments && comments.length > 0 ? (
							<div className="space-y-4 max-h-96 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent scrollbar-hide">
								{comments.map((comment: MaterialRating) => (
									<Card key={comment.id} className="shadow-sm">
										<CardBody className="p-4">
											<div className="flex items-start justify-between mb-2">
												<div>
													<p className="font-medium text-gray-900">
														{comment.usuarioNombre || 'Usuario Anónimo'}
													</p>
													<p className="text-sm text-gray-500">
														{new Date(comment.createdAt).toLocaleDateString(
															'es-ES',
														)}
													</p>
												</div>
												<div className="flex items-center gap-1">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															className={`w-4 h-4 ${
																i < comment.calificacion
																	? 'text-yellow-500 fill-current'
																	: 'text-gray-300'
															}`}
														/>
													))}
												</div>
											</div>
											{comment.comentario && (
												<p className="text-gray-700 text-sm">
													{comment.comentario}
												</p>
											)}
										</CardBody>
									</Card>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								<MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
								<p>No hay comentarios aún. Sé el primero en comentar.</p>
							</div>
						)}
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
