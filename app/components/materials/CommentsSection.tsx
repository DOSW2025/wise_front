import { Avatar, Button, Textarea } from '@heroui/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import type { Comment } from './types';

interface CommentsSectionProps {
	comments: Comment[];
	onAddComment: (content: string) => void;
	isOpen: boolean;
	onClose: () => void;
}

export default function CommentsSection({
	comments,
	onAddComment,
	isOpen,
	onClose,
}: CommentsSectionProps) {
	const [newComment, setNewComment] = useState('');

	const handleSubmitComment = () => {
		if (newComment.trim()) {
			onAddComment(newComment.trim());
			setNewComment('');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="border-t mt-6 pt-6">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-semibold">
					Comentarios ({comments.length})
				</h3>
				<Button variant="light" size="sm" onClick={onClose}>
					Cerrar
				</Button>
			</div>

			{/* Formulario para nuevo comentario */}
			<div className="mb-6 p-4 bg-gray-50 rounded-lg">
				<Textarea
					placeholder="Escribe un comentario..."
					value={newComment}
					onValueChange={setNewComment}
					minRows={3}
					className="mb-3"
				/>
				<div className="flex justify-end">
					<Button
						className="bg-[#8B1A1A] text-white"
						startContent={<Send size={16} />}
						onClick={handleSubmitComment}
						isDisabled={!newComment.trim()}
						type="button"
					>
						Publicar comentario
					</Button>
				</div>
			</div>

			{/* Lista de comentarios existentes */}
			<div className="space-y-4">
				{comments.length === 0 ? (
					<p className="text-gray-500 text-center py-4">
						No hay comentarios aún. Sé el primero en comentar.
					</p>
				) : (
					comments.map((comment) => (
						<div key={comment.id} className="border-b pb-4 last:border-b-0">
							<div className="flex items-start gap-3">
								<Avatar
									name={comment.userName}
									className="flex-shrink-0"
									size="sm"
								/>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="font-semibold text-sm">
											{comment.userName}
										</span>
										<span className="text-gray-500 text-xs">
											{comment.date}
										</span>
									</div>
									<p className="text-gray-700 text-sm">{comment.content}</p>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
