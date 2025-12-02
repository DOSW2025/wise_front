import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from '@heroui/react';
import { X } from 'lucide-react';
import CommentsSection from './CommentsSection';
import type { Material } from './types';

interface CommentsModalProps {
	material: Material | null;
	isOpen: boolean;
	onClose: () => void;
	onAddComment: (materialId: string, content: string) => void;
}

export default function CommentsModal({
	material,
	isOpen,
	onClose,
	onAddComment,
}: CommentsModalProps) {
	if (!material) return null;

	const handleAddComment = (content: string) => {
		onAddComment(material.id, content);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
			<ModalContent>
				<ModalHeader className="flex items-center justify-between border-b">
					<div>
						<h2 className="text-xl font-bold">
							Comentarios - {material.title}
						</h2>
						<p className="text-sm text-gray-600">
							{material.author} • {material.comments} comentarios
						</p>
					</div>
					<Button
						isIconOnly
						variant="light"
						size="sm"
						onClick={onClose}
						type="button"
					>
						<X size={20} />
					</Button>
				</ModalHeader>

				<ModalBody className="p-0">
					<CommentsSection
						comments={material.commentsList}
						onAddComment={handleAddComment}
						isOpen={true}
						onClose={onClose}
					/>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
