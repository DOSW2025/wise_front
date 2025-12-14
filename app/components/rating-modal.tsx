/**
 * Modal de Calificación de Tutoría
 * Permite a los estudiantes calificar sesiones completadas
 */

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from '@heroui/react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useSubmitRating } from '~/lib/hooks/useSubmitRating';
import { StarRating } from './star-rating';

interface RatingModalProps {
	isOpen: boolean;
	onClose: () => void;
	sessionId: string;
	raterId: string;
	tutorName: string;
	subjectName: string;
	onSuccess?: () => void;
}

export interface RatingFormState {
	score: number;
	comment: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
	isOpen,
	onClose,
	sessionId,
	raterId,
	tutorName,
	subjectName,
	onSuccess,
}) => {
	const [formState, setFormState] = useState<RatingFormState>({
		score: 0,
		comment: '',
	});

	const { mutate: submitRating, isPending, isError } = useSubmitRating();

	// Resetear el formulario cuando se abre el modal
	useEffect(() => {
		if (isOpen) {
			setFormState({ score: 0, comment: '' });
		}
	}, [isOpen]);

	const handleSubmit = () => {
		if (formState.score === 0) return;

		submitRating(
			{
				raterId,
				sessionId,
				score: formState.score,
				comment: formState.comment,
			},
			{
				onSuccess: () => {
					onSuccess?.();
					onClose();
				},
			},
		);
	};

	const handleClose = () => {
		if (!isPending) {
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="lg"
			isDismissable={!isPending}
			hideCloseButton={isPending}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<h3 className="text-xl font-semibold">
						Califica tu sesión de tutoría
					</h3>
					<p className="text-sm text-default-500 font-normal">
						{tutorName} - {subjectName}
					</p>
				</ModalHeader>
				<ModalBody className="gap-6">
					{/* Selector de Estrellas */}
					<div className="flex flex-col gap-3">
						<div className="text-sm font-medium text-default-700">
							Calificación <span className="text-danger">*</span>
						</div>
						<div className="flex justify-center">
							<StarRating
								value={formState.score}
								onChange={(score) => setFormState({ ...formState, score })}
								disabled={isPending}
								size={40}
							/>
						</div>
						{formState.score > 0 && (
							<p className="text-center text-sm text-default-500">
								{formState.score === 1 && 'Muy insatisfecho'}
								{formState.score === 2 && 'Insatisfecho'}
								{formState.score === 3 && 'Neutral'}
								{formState.score === 4 && 'Satisfecho'}
								{formState.score === 5 && 'Muy satisfecho'}
							</p>
						)}
					</div>

					{/* Campo de Comentario */}
					<div className="flex flex-col gap-2">
						<div className="text-sm font-medium text-default-700">
							Comentario (opcional)
						</div>
						<Textarea
							placeholder="Cuéntanos sobre tu experiencia..."
							value={formState.comment}
							onValueChange={(comment) =>
								setFormState({ ...formState, comment })
							}
							minRows={4}
							disabled={isPending}
							classNames={{
								input: 'resize-none',
							}}
						/>
					</div>

					{/* Mensaje de Error */}
					{isError && (
						<div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
							<p className="text-sm text-danger">
								No se pudo enviar la calificación. Por favor, intenta
								nuevamente.
							</p>
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						variant="light"
						onPress={handleClose}
						disabled={isPending}
						color="default"
					>
						Cancelar
					</Button>
					<Button
						color="primary"
						onPress={handleSubmit}
						isLoading={isPending}
						disabled={formState.score === 0 || isPending}
					>
						{isPending ? 'Enviando...' : 'Enviar Calificación'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
