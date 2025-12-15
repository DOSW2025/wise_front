import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
	isOpen: boolean;
	onClose: () => void;
	type: 'success' | 'error';
	title?: string;
	message: string;
}

/**
 * Modal de feedback profesional para mostrar mensajes de éxito o error
 * Reemplaza los alert() nativos con una UI elegante
 */
export default function FeedbackModal({
	isOpen,
	onClose,
	type,
	title,
	message,
}: Readonly<FeedbackModalProps>) {
	const isSuccess = type === 'success';

	const defaultTitle = isSuccess ? '¡Agendado!' : 'No se pudo agendar';
	const displayTitle = title || defaultTitle;

	const iconColor = isSuccess ? 'text-success' : 'text-danger';
	const iconBgColor = isSuccess ? 'bg-success-50' : 'bg-danger-50';

	const Icon = isSuccess ? CheckCircle : AlertCircle;

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
			<ModalContent>
				{(onCloseModal) => (
					<>
						<ModalHeader className="flex flex-col gap-1 items-center pt-6">
							<div
								className={`${iconBgColor} ${iconColor} rounded-full p-3 mb-2`}
							>
								<Icon className="w-8 h-8" strokeWidth={2.5} />
							</div>
							<h3 className="text-xl font-semibold">{displayTitle}</h3>
						</ModalHeader>
						<ModalBody className="text-center pb-2">
							<p className="text-default-600">{message}</p>
						</ModalBody>
						<ModalFooter className="justify-center pb-6">
							<Button
								color={isSuccess ? 'success' : 'danger'}
								variant="flat"
								onPress={onCloseModal}
								className="min-w-32"
							>
								Entendido
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
