/**
 * Componente de Selector de Estrellas
 * Permite seleccionar una calificación de 1 a 5 estrellas
 */

import { Star } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface StarRatingProps {
	value: number;
	onChange: (value: number) => void;
	size?: number;
	disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
	value,
	onChange,
	size = 32,
	disabled = false,
}) => {
	const [hoverValue, setHoverValue] = useState<number>(0);

	const handleClick = (rating: number) => {
		if (!disabled) {
			onChange(rating);
		}
	};

	const handleMouseEnter = (rating: number) => {
		if (!disabled) {
			setHoverValue(rating);
		}
	};

	const handleMouseLeave = () => {
		setHoverValue(0);
	};

	const handleKeyDown = (e: React.KeyboardEvent, rating: number) => {
		if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			onChange(rating);
		}
	};

	return (
		<fieldset
			className="flex gap-2 border-0 p-0 m-0"
			onMouseLeave={handleMouseLeave}
			aria-label="Calificación de estrellas"
		>
			{[1, 2, 3, 4, 5].map((rating) => {
				const isFilled = rating <= (hoverValue || value);
				return (
					<button
						key={rating}
						type="button"
						onClick={() => handleClick(rating)}
						onMouseEnter={() => handleMouseEnter(rating)}
						onKeyDown={(e) => handleKeyDown(e, rating)}
						disabled={disabled}
						className={`transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-warning focus:ring-offset-2 rounded ${
							disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
						}`}
						aria-label={`Calificar con ${rating} estrella${rating > 1 ? 's' : ''}`}
						aria-pressed={rating === value}
					>
						<Star
							size={size}
							className={`transition-colors ${
								isFilled
									? 'fill-warning text-warning'
									: 'text-default-300 hover:text-warning'
							}`}
						/>
					</button>
				);
			})}
		</fieldset>
	);
};
