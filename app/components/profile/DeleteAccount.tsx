import {
	Button,
	Card,
	CardBody,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@heroui/react';
import { Trash2 } from 'lucide-react';

interface DeleteAccountProps {
	onDelete: () => Promise<void> | void;
}

export function DeleteAccount({ onDelete }: DeleteAccountProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleConfirm = async () => {
		await onDelete();
		onClose();
	};

	return (
		<>
			<Card>
				<CardBody className="gap-4">
					<div className="flex justify-end">
						<Button
							color="primary"
							variant="flat"
							startContent={<Trash2 className="w-4 h-4" />}
							onPress={onOpen}
						>
							Eliminar mi Cuenta
						</Button>
					</div>
				</CardBody>
			</Card>

			<Modal isOpen={isOpen} onClose={onClose} backdrop="opaque">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<span>Eliminar Cuenta</span>
					</ModalHeader>
					<ModalBody>
						<p className="text-default-600">
							¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es
							irreversible.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Cancelar
						</Button>
						<Button
							color="primary"
							onPress={handleConfirm}
							startContent={<Trash2 className="w-4 h-4" />}
						>
							Eliminar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
