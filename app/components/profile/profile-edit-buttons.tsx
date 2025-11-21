import { Button } from '@heroui/react';

interface ProfileEditButtonsProps {
	isEditing: boolean;
	isSaving: boolean;
	onEdit: () => void;
	onSave: () => void;
	onCancel: () => void;
}

export function ProfileEditButtons({
	isEditing,
	isSaving,
	onEdit,
	onSave,
	onCancel,
}: ProfileEditButtonsProps) {
	return (
		<div className="flex gap-2">
			{isEditing && (
				<Button
					color="default"
					variant="flat"
					onPress={onCancel}
					isDisabled={isSaving}
				>
					Cancelar
				</Button>
			)}
			<Button
				color={isEditing ? 'success' : 'primary'}
				variant={isEditing ? 'solid' : 'bordered'}
				onPress={isEditing ? onSave : onEdit}
				isLoading={isSaving}
				isDisabled={isSaving}
			>
				{isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
			</Button>
		</div>
	);
}
