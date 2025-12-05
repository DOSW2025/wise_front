import { Card, CardBody, Progress } from '@heroui/react';
import { BookOpen } from 'lucide-react';
import type { CategoryProgress } from '~/lib/types/gamification.types';

interface CategoryProgressCardProps {
	category: CategoryProgress;
}

export function CategoryProgressCard({ category }: CategoryProgressCardProps) {
	return (
		<Card>
			<CardBody className="gap-3">
				<div className="flex justify-between items-start">
					<div>
						<h4 className="font-semibold text-foreground">
							{category.categoryName}
						</h4>
						<p className="text-sm text-default-500">
							{category.completedMaterials} de {category.totalMaterials}{' '}
							materiales
						</p>
					</div>
					<span className="text-xl font-bold text-primary">
						{Math.round(category.percentage)}%
					</span>
				</div>
				<Progress
					value={category.percentage}
					color="success"
					size="sm"
					classNames={{
						indicator: 'bg-gradient-to-r from-success-400 to-success-600',
					}}
				/>
			</CardBody>
		</Card>
	);
}

interface CategoryProgressListProps {
	categories: CategoryProgress[];
}

export function CategoryProgressList({
	categories,
}: CategoryProgressListProps) {
	if (categories.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<BookOpen className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay progreso por categorías</p>
					<p className="text-sm text-default-400 mt-1">
						Completa materiales para ver tu avance
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{categories.map((category) => (
				<CategoryProgressCard key={category.categoryId} category={category} />
			))}
		</div>
	);
}
