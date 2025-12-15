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
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface InterestsChipsProps {
	title: string;
	items: string[];
	isEditing: boolean;
	onAdd: (value: string) => void;
	onRemove: (value: string) => void;
	emptyText?: string;
	addLabel?: string;
	addPromptText?: string;
	availableItems?: string[];
	enableSearch?: boolean;
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
	availableItems = [],
	enableSearch = false,
}: InterestsChipsProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [inputValue, setInputValue] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const handleAddClick = () => {
		setInputValue('');
		setSearchQuery('');
		onOpen();
	};

	const handleConfirm = () => {
		if (inputValue.trim()) {
			onAdd(inputValue);
			setInputValue('');
			onClose();
		}
	};

	const handleSelectAvailable = (item: string) => {
		onAdd(item);
		setSearchQuery('');
		onClose();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleConfirm();
		}
	};

	const filteredAvailableItems = useMemo(() => {
		if (!enableSearch || !availableItems.length) return [];

		const query = searchQuery.toLowerCase();
		return availableItems
			.filter((item) => !items.includes(item))
			.filter((item) => item.toLowerCase().includes(query));
	}, [availableItems, items, searchQuery, enableSearch]);

	return (
		<>
			<div className="space-y-2">
				<span className="text-sm font-medium block">{title}</span>
				<div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
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

			<Modal isOpen={isOpen} onClose={onClose} backdrop="opaque" size="lg">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<span>{title}</span>
					</ModalHeader>
					<ModalBody>
						{enableSearch && availableItems.length > 0 ? (
							<>
								<Input
									placeholder="Buscar materia..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									startContent={<Search className="w-4 h-4 text-default-400" />}
									variant="bordered"
									className="mb-2"
								/>
								<div className="max-h-60 overflow-y-auto border rounded-lg p-2">
									{filteredAvailableItems.length > 0 ? (
										<div className="space-y-1">
											{filteredAvailableItems.map((item) => (
												<div
													key={item}
													className="p-2 hover:bg-default-100 rounded cursor-pointer transition-colors"
													onClick={() => handleSelectAvailable(item)}
													onKeyDown={(e) => {
														if (e.key === 'Enter' || e.key === ' ') {
															handleSelectAvailable(item);
														}
													}}
												>
													{item}
												</div>
											))}
										</div>
									) : (
										<p className="text-sm text-default-400 text-center py-4">
											{searchQuery
												? 'No se encontraron materias'
												: 'Todas las materias ya están agregadas'}
										</p>
									)}
								</div>
								<div className="mt-4">
									<p className="text-sm text-default-500 mb-2">
										O ingresa una materia manualmente:
									</p>
									<Input
										placeholder={addPromptText}
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										onKeyDown={handleKeyDown}
										variant="bordered"
									/>
								</div>
							</>
						) : (
							<Input
								autoFocus
								placeholder={addPromptText}
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={handleKeyDown}
								variant="bordered"
							/>
						)}
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Cancelar
						</Button>
						{inputValue.trim() && (
							<Button
								color="primary"
								onPress={handleConfirm}
								isDisabled={!inputValue.trim()}
							>
								Agregar
							</Button>
						)}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
