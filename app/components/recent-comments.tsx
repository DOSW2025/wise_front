/**
 * RecentComments Component
 * Muestra los 2 comentarios más recientes del tutor
 */

import { Avatar, Button, Card, CardBody, Skeleton } from '@heroui/react';
import {
	AlertCircle,
	ArrowRight,
	Clock,
	MessageSquare,
	MessageSquareOff,
	Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getUserName } from '~/lib/services/tutoria.service';
import type { Rating } from '~/lib/types/tutoria.types';

interface RecentCommentsProps {
	ratings: Rating[];
	isLoading: boolean;
	isError: boolean;
}

/**
 * Formatea la fecha de forma relativa
 */
function formatRelativeDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInDays === 0) return 'Hoy';
	if (diffInDays === 1) return 'Ayer';
	if (diffInDays < 7) return `Hace ${diffInDays} días`;
	if (diffInDays < 30) {
		const weeks = Math.floor(diffInDays / 7);
		return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
	}

	// Formato alternativo para fechas antiguas
	return date.toLocaleDateString('es-ES', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

/**
 * Renderiza las estrellas según el score
 */
function RatingStars({ score }: { readonly score: number }) {
	const fullStars = Math.floor(score);
	const emptyStars = 5 - fullStars;

	return (
		<div className="flex items-center gap-0.5">
			{Array.from({ length: fullStars }).map((_, i) => (
				<Star
					key={`full-${score}-${i}`}
					className="w-4 h-4 fill-yellow-500 text-yellow-500"
				/>
			))}
			{Array.from({ length: emptyStars }).map((_, i) => (
				<Star
					key={`empty-${score}-${i}`}
					className="w-4 h-4 text-default-300"
				/>
			))}
		</div>
	);
}

/**
 * Tarjeta individual de comentario
 */
function CommentCard({ rating }: { readonly rating: Rating }) {
	// El nombre del estudiante viene directamente en rating.rater.nombre
	const studentName = rating.rater?.nombre || 'Estudiante';

	// Truncar comentario si es muy largo
	const MAX_COMMENT_LENGTH = 100;
	const comment = rating.comment || '';
	const shouldTruncate = comment.length > MAX_COMMENT_LENGTH;
	const displayComment = shouldTruncate
		? `${comment.substring(0, MAX_COMMENT_LENGTH)}...`
		: comment;

	return (
		<div className="space-y-3">
			{/* Header: Avatar + Nombre + Rating */}
			<div className="flex items-start gap-3">
				<Avatar
					name={studentName
						.split(' ')
						.map((n) => n[0])
						.join('')
						.toUpperCase()}
					size="sm"
					className="bg-primary text-white flex-shrink-0"
				/>
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2 mb-1">
						<h4 className="font-heading font-semibold text-sm text-default-900 truncate">
							{studentName}
						</h4>
						<RatingStars score={rating.score} />
					</div>
					{/* Comentario */}
					<p className="font-sans text-sm text-default-600 italic leading-relaxed">
						"{displayComment}"
					</p>
					{/* Fecha */}
					<div className="flex items-center gap-1 mt-2">
						<Clock className="w-3.5 h-3.5 text-default-400" />
						<span className="text-xs text-default-400">
							{formatRelativeDate(rating.createdAt)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Skeleton para estado de carga
 */
function CommentSkeleton() {
	return (
		<div className="space-y-3">
			<div className="flex items-start gap-3">
				<Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
				<div className="flex-1 space-y-2">
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-24 rounded" />
						<Skeleton className="h-4 w-20 rounded" />
					</div>
					<Skeleton className="h-12 w-full rounded" />
					<Skeleton className="h-3 w-16 rounded" />
				</div>
			</div>
		</div>
	);
}

/**
 * Estado vacío
 */
function EmptyState() {
	return (
		<div className="text-center py-8">
			<div className="w-12 h-12 mx-auto mb-3 rounded-full bg-default-100 flex items-center justify-center">
				<MessageSquareOff className="w-6 h-6 text-default-400" />
			</div>
			<p className="text-sm text-default-500">
				Aún no has recibido comentarios de estudiantes
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
				No pudimos cargar los comentarios
			</p>
			<p className="text-xs text-default-500">Intenta recargar la página</p>
		</div>
	);
}

/**
 * Componente principal
 */
export function RecentComments({
	ratings,
	isLoading,
	isError,
}: RecentCommentsProps) {
	// Tomar solo los primeros 2 comentarios
	const recentRatings = ratings.slice(0, 2);

	return (
		<Card>
			<CardBody className="gap-4">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<MessageSquare className="w-5 h-5 text-primary" />
						<h2 className="font-heading text-xl font-semibold">
							Comentarios Recientes
						</h2>
					</div>
					<Button
						as={Link}
						to="/dashboard/tutor/reports"
						size="sm"
						variant="light"
						color="primary"
					>
						Ver todos
					</Button>
				</div>{' '}
				{/* Content */}
				{isLoading && (
					<div className="space-y-4">
						<CommentSkeleton />
						<div className="border-t border-default-200" />
						<CommentSkeleton />
					</div>
				)}
				{isError && <ErrorState />}
				{!isLoading && !isError && recentRatings.length === 0 && <EmptyState />}
				{!isLoading &&
					!isError &&
					recentRatings.length > 0 &&
					recentRatings.map((rating, index) => (
						<div key={rating.id}>
							<CommentCard rating={rating} />
							{index < recentRatings.length - 1 && (
								<div className="border-t border-default-200 my-4" />
							)}
						</div>
					))}
			</CardBody>
		</Card>
	);
}
