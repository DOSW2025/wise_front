import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react';

interface PasswordData {
	current: string;
	new: string;
	confirm: string;
}

interface PasswordErrors {
	current?: string;
	new?: string;
	confirm?: string;
}

interface PasswordChangeModalProps {
	isOpen: boolean;
	onClose: () => void;
	passwordData: PasswordData;
	passwordErrors: PasswordErrors;
	onPasswordDataChange: (data: PasswordData) => void;
	onSave: () => void;
}

export function PasswordChangeModal({
	isOpen,
	onClose,
	passwordData,
	passwordErrors,
	onPasswordDataChange,
	onSave,
}: PasswordChangeModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md">
			<ModalContent>
				<ModalHeader>Cambiar Contraseña</ModalHeader>
				<ModalBody>
					<div className="space-y-4">
						<Input
							label="Contraseña Actual"
							type="password"
							value={passwordData.current}
							onValueChange={(value) =>
								onPasswordDataChange({ ...passwordData, current: value })
							}
							isInvalid={!!passwordErrors.current}
							errorMessage={passwordErrors.current}
							isRequired
						/>
						<Input
							label="Nueva Contraseña"
							type="password"
							value={passwordData.new}
							onValueChange={(value) =>
								onPasswordDataChange({ ...passwordData, new: value })
							}
							isInvalid={!!passwordErrors.new}
							errorMessage={passwordErrors.new}
							description="Mínimo 8 caracteres"
							isRequired
						/>
						<Input
							label="Confirmar Nueva Contraseña"
							type="password"
							value={passwordData.confirm}
							onValueChange={(value) =>
								onPasswordDataChange({ ...passwordData, confirm: value })
							}
							isInvalid={!!passwordErrors.confirm}
							errorMessage={passwordErrors.confirm}
							isRequired
						/>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant="flat" onPress={onClose}>
						Cancelar
					</Button>
					<Button color="primary" onPress={onSave}>
						Guardar Cambios
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
