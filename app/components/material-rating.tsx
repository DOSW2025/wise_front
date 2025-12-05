/**
 * Material Rating Component
 * Componente interactivo para calificar materiales
 */

import { Button } from '@heroui/react';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useRateMaterial } from '~/lib/hooks/useMaterials';

interface MaterialRatingProps {
	materialId: string;
	currentRating: number;
	userRating?: number;
	onRatingChange?: (newRating: number) => void;
}

export function MaterialRating({
	materialId,
	currentRating,
	userRating,
	onRatingChange,
}: MaterialRatingProps) {
	const [hoveredRating, setHoveredRating] = useState(0);
	const rateMaterial = useRateMaterial();

	const handleRating = (rating: number) => {
		rateMaterial.mutate(
			{ id: materialId, rating },
			{
				onSuccess: () => {
					onRatingChange?.(rating);
				},
			},
		);
	};

	const renderStars = () => {
		return Array.from({ length: 5 }, (_, index) => {
			const starValue = index + 1;
			const isActive = hoveredRating
				? starValue <= hoveredRating
				: starValue <= (userRating || 0);
			const isCurrentRating = starValue <= currentRating;

			return (
				<Button
					key={starValue}
					isIconOnly
					variant="light"
					size="sm"
					onPress={() => handleRating(starValue)}
					onMouseEnter={() => setHoveredRating(starValue)}
					onMouseLeave={() => setHoveredRating(0)}
					isDisabled={rateMaterial.isPending}
					className="min-w-unit-8 w-8 h-8"
				>
					<Star
						className={`w-4 h-4 transition-colors ${
							isActive
								? 'text-warning-500 fill-warning-500'
								: isCurrentRating
									? 'text-warning-300 fill-warning-300'
									: 'text-default-300'
						}`}
					/>
				</Button>
			);
		});
	};

	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center">{renderStars()}</div>
			<div className="text-sm text-default-600">
				<span className="font-medium">{currentRating.toFixed(1)}</span>
				{userRating && (
					<span className="ml-2 text-xs">(Tu calificación: {userRating})</span>
				)}
			</div>
		</div>
	);
}
