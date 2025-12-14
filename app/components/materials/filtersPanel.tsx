import { Button, Card, CardBody, Chip, Input } from '@heroui/react';
import { X } from 'lucide-react';
import { useState } from 'react';

interface FiltersPanelProps {
	isOpen: boolean;
	selectedTags: string[];
	onTagsChange: (tags: string[]) => void;
}

export default function FiltersPanel({
	isOpen,
	selectedTags,
	onTagsChange,
}: FiltersPanelProps) {
	const [tagInput, setTagInput] = useState('');

	const handleAddTag = () => {
		if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
			onTagsChange([...selectedTags, tagInput.trim()]);
			setTagInput('');
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddTag();
		}
	};

	if (!isOpen) return null;

	return (
		<Card>
			<CardBody className="p-6">
				<div className="space-y-4">
					<div>
						<label
							htmlFor="tag-filter-input"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Filtrar por Tags
						</label>
						<div className="flex gap-2">
							<Input
								id="tag-filter-input"
								placeholder="Escribe un tag y presiona Enter..."
								value={tagInput}
								onValueChange={setTagInput}
								onKeyDown={handleKeyDown}
								className="flex-1"
							/>
							<Button
								color="primary"
								onClick={handleAddTag}
								disabled={!tagInput.trim()}
							>
								Agregar
							</Button>
						</div>
					</div>

					{selectedTags.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium text-gray-700">
								Tags seleccionados:
							</p>
							<div className="flex flex-wrap gap-2">
								{selectedTags.map((tag) => (
									<Chip
										key={tag}
										endContent={
											<button
												type="button"
												onClick={() => handleRemoveTag(tag)}
												className="ml-2 hover:opacity-70"
											>
												<X size={16} />
											</button>
										}
										variant="flat"
										color="primary"
									>
										{tag}
									</Chip>
								))}
							</div>
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
