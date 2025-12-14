/**
 * RecommendedTutorsList Component
 * Componente minimalista para mostrar tutores recomendados en el dashboard del estudiante
 */

import { Avatar, Badge, Card, CardBody, Chip, Skeleton } from '@heroui/react';
import { AlertCircle, Star, Users } from 'lucide-react';
import { useTutores } from '~/lib/hooks/useTutores';
import { useTutorMaterias } from '~/lib/hooks/useTutorMaterias';
import type { TutorProfile } from '~/lib/types/tutoria.types';

/**
 * Obtiene calificación desde tutorProfile o nivel superior
 */
const getTutorRating = (profile: TutorProfile): number => {
	return profile.tutorProfile?.calificacion ?? profile.calificacion ?? 0;
};

/**
 * Obtiene número de comentarios desde tutorProfile o nivel superior
 */
const getTutorReviews = (profile: TutorProfile): number => {
	return profile.tutorProfile?.comentarios ?? profile.comentarios ?? 0;
};

/**
 * Tarjeta individual de tutor
 */
interface TutorCardProps {
	readonly tutor: TutorProfile;
}

function TutorCard({ tutor }: TutorCardProps) {
	const rating = getTutorRating(tutor);
	const reviews = getTutorReviews(tutor);
	const hasRating = rating > 0 && reviews > 0;

	// Obtener materias desde el backend usando el mismo hook que el modal
	const { data: materiasData, isLoading: isLoadingMaterias } = useTutorMaterias(
		tutor.id,
		true,
	);

	// Mostrar máximo 3 materias
	const materias = materiasData?.materias ?? [];
	const visibleMaterias = materias.slice(0, 3);
	const remainingCount = Math.max(0, materias.length - 3);

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardBody className="p-4">
				<div className="flex items-start gap-3">
					{/* Avatar */}
					<Avatar
						name={`${tutor.nombre.charAt(0)}${tutor.apellido.charAt(0)}`}
						className="flex-shrink-0 bg-primary text-white"
						size="md"
					/>

					{/* Información del tutor */}
					<div className="flex-1 min-w-0 space-y-2">
						{/* Nombre completo */}
						<h4 className="font-heading font-semibold text-default-900 truncate">
							{tutor.nombre} {tutor.apellido}
						</h4>

						{/* Materias como Chips - Mismo formato que tutor-schedule-modal.tsx */}
						<div className="flex flex-wrap gap-1.5">
							{isLoadingMaterias ? (
								<span className="text-xs text-default-400">
									Cargando materias...
								</span>
							) : visibleMaterias.length > 0 ? (
								<>
									{visibleMaterias.map((materia) => (
										<Chip
											key={materia.codigo}
											variant="flat"
											color="secondary"
											size="sm"
										>
											{materia.codigo}
										</Chip>
									))}
									{remainingCount > 0 && (
										<Badge
											size="sm"
											variant="flat"
											color="default"
											className="text-xs"
										>
											+{remainingCount} más
										</Badge>
									)}
								</>
							) : (
								<span className="text-xs text-default-400">
									Sin materias disponibles
								</span>
							)}
						</div>

						{/* Calificación y reseñas - Mismo formato que tutor-card.tsx */}
						<div className="flex items-center mt-1">
							{hasRating ? (
								<>
									<Star className="w-4 h-4 mr-1 text-red-700 fill-red-700" />
									<span className="text-sm font-medium text-red-700">
										{rating.toFixed(1)}
									</span>
									<span className="text-xs text-default-400 ml-1">
										({reviews} {reviews === 1 ? 'reseña' : 'reseñas'})
									</span>
								</>
							) : (
								<span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
									Nuevo tutor
								</span>
							)}
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

/**
 * Skeleton para estado de carga
 */
function TutorCardSkeleton() {
	return (
		<Card>
			<CardBody className="p-4">
				<div className="flex items-start gap-3">
					<Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-32 rounded-lg" />
						<div className="flex gap-1.5">
							<Skeleton className="h-5 w-16 rounded-lg" />
							<Skeleton className="h-5 w-16 rounded-lg" />
						</div>
						<Skeleton className="h-4 w-24 rounded-lg" />
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

/**
 * Estado vacío
 */
function EmptyState() {
	return (
		<div className="text-center py-8">
			<div className="w-12 h-12 mx-auto mb-3 rounded-full bg-default-100 flex items-center justify-center">
				<Users className="w-6 h-6 text-default-400" />
			</div>
			<p className="text-sm text-default-500">
				No hay tutores disponibles en este momento
			</p>
		</div>
	);
}

/**
 * Estado de error
 */
function ErrorState() {
	return (
		<div className="text-center py-8">
			<div className="w-12 h-12 mx-auto mb-3 rounded-full bg-danger-100 flex items-center justify-center">
				<AlertCircle className="w-6 h-6 text-danger" />
			</div>
			<p className="text-sm font-medium text-danger mb-1">
				No pudimos cargar los tutores
			</p>
			<p className="text-xs text-default-500">Intenta recargar la página</p>
		</div>
	);
}

/**
 * Componente principal
 */
export function RecommendedTutorsList() {
	const { data: tutores, isLoading, isError } = useTutores();

	// Mostrar solo los primeros 4 tutores
	const recommendedTutores = tutores?.slice(0, 4) ?? [];

	return (
		<div className="space-y-3">
			{isLoading && (
				<>
					<TutorCardSkeleton />
					<TutorCardSkeleton />
					<TutorCardSkeleton />
					<TutorCardSkeleton />
				</>
			)}

			{isError && <ErrorState />}

			{!isLoading && !isError && recommendedTutores.length === 0 && (
				<EmptyState />
			)}

			{!isLoading &&
				!isError &&
				recommendedTutores.length > 0 &&
				recommendedTutores.map((tutor) => (
					<TutorCard key={tutor.id} tutor={tutor} />
				))}
		</div>
	);
}
