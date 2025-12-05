import { Star } from 'lucide-react';

interface RatingStarsProps {
	rating: number;
	onRatingChange?: (rating: number) => void;
	size?: number;
}

export default function RatingStars({
	rating,
	onRatingChange,
	size = 20,
}: RatingStarsProps) {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					onClick={() => onRatingChange?.(star)}
					className={`${onRatingChange ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
				>
					<Star
						size={size}
						className={`${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
					/>
				</button>
			))}
		</div>
	);
}
