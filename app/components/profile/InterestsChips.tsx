import {
	Button,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from '@heroui/react';
import { useState } from 'react';

interface InterestsChipsProps {
	title: string;
	items: string[];
	isEditing: boolean;
	onAdd: (value: string) => void;
	onRemove: (value: string) => void;
	emptyText?: string;
	addLabel?: string;
	addPromptText?: string;
}

export function InterestsChips({
	title,
	items,
	isEditing,
	onAdd,
	onRemove,
	emptyText = 'No has agregado elementos',
	addLabel = '+ Agregar',
	addPromptText = 'Ingresa un nuevo elemento:',
}: InterestsChipsProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [inputValue, setInputValue] = useState('');

	const handleAddClick = () => {
		setInputValue('');
		onOpen();
	};

	const handleConfirm = () => {
		if (inputValue.trim()) {
			onAdd(inputValue);
			setInputValue('');
			onClose();
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleConfirm();
		}
	};

	return (
		<>
			<div className="space-y-2">
				<span className="text-sm font-medium block">{title}</span>
				<div className="flex flex-wrap gap-2">
					{items && items.length > 0 ? (
						items.map((item) => (
							<Chip
								key={item}
								onClose={isEditing ? () => onRemove(item) : undefined}
								variant="flat"
								color="primary"
							>
								{item}
							</Chip>
						))
					) : (
						<p className="text-sm text-default-500">{emptyText}</p>
					)}
					{isEditing && (
						<Chip
							variant="bordered"
							className="cursor-pointer"
							onClick={handleAddClick}
						>
							{addLabel}
						</Chip>
					)}
				</div>
			</div>

			<Modal isOpen={isOpen} onClose={onClose} backdrop="opaque">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<span>{title}</span>
					</ModalHeader>
					<ModalBody>
						<Input
							autoFocus
							placeholder={addPromptText}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyPress={handleKeyPress}
							variant="bordered"
						/>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Cancelar
						</Button>
						<Button
							color="primary"
							onPress={handleConfirm}
							isDisabled={!inputValue.trim()}
						>
							Agregar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
