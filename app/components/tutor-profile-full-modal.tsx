import {
	Badge,
	Card,
	CardBody,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';
import {
	AlertCircle,
	BookOpen,
	Calendar,
	MapPin,
	MessageSquare,
	Star,
	Video,
	X,
} from 'lucide-react';
import { useTutorFullProfile } from '~/lib/hooks/useTutorFullProfile';

interface TutorProfileFullModalProps {
	tutorId: string | null;
	isOpen: boolean;
	onClose: () => void;
}

const dayTranslations: Record<string, string> = {
	monday: 'Lunes',
	tuesday: 'Martes',
	wednesday: 'Miércoles',
	thursday: 'Jueves',
	friday: 'Viernes',
	saturday: 'Sábado',
	sunday: 'Domingo',
};

const formatRelativeDate = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInDays === 0) return 'Hoy';
	if (diffInDays === 1) return 'Ayer';
	if (diffInDays < 7) return `Hace ${diffInDays} días`;
	if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
	if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
	return `Hace ${Math.floor(diffInDays / 365)} años`;
};

const renderStars = (score: number) => {
	return Array.from({ length: 5 }, (_, i) => (
		<Star
			key={i}
			className={`w-4 h-4 ${i < score ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
		/>
	));
};

export function TutorProfileFullModal({
	tutorId,
	isOpen,
	onClose,
}: Readonly<TutorProfileFullModalProps>) {
	const { data: profile, isLoading, isError } = useTutorFullProfile(tutorId);

	// Usar reputación del endpoint
	const tutorRating = profile?.reputacion ?? 0;
	const tutorReviews = profile?.totalRatings ?? 0;

	// Preparar datos de disponibilidad
	const availabilityData = profile?.usuario?.disponibilidad
		? Object.entries(profile.usuario.disponibilidad)
				.filter(([_, slots]) => slots && slots.length > 0)
				.flatMap(([day, slots]) =>
					slots.map(
						(slot: {
							start: string;
							end: string;
							modalidad: string;
							lugar?: string;
						}) => ({
							day: dayTranslations[day] || day,
							time: `${slot.start} - ${slot.end}`,
							modalidad: slot.modalidad,
							lugar: slot.lugar || 'N/A',
						}),
					),
				)
		: [];

	// Ordenar comentarios por fecha (más recientes primero) y tomar solo los primeros 2
	const recentComments =
		profile?.ratings
			?.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)
			.slice(0, 2) || [];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="5xl"
			scrollBehavior="outside"
		>
			<ModalContent>
				{(onCloseModal) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pr-10">
							{isLoading ? (
								<>
									<Skeleton className="h-8 w-64 rounded-lg" />
									<Skeleton className="h-4 w-48 rounded-lg mt-2" />
								</>
							) : isError ? (
								<span className="text-danger">Error al cargar perfil</span>
							) : (
								<>
									<h2 className="text-2xl font-bold">
										{profile?.usuario?.nombre} {profile?.usuario?.apellido}
									</h2>
								</>
							)}
							<button
								type="button"
								onClick={onCloseModal}
								className="absolute top-4 right-4 text-default-400 hover:text-default-600"
								aria-label="Cerrar"
							>
								<X className="w-5 h-5" />
							</button>
						</ModalHeader>

						<ModalBody className="gap-6 py-6">
							{isLoading ? (
								<>
									<Card>
										<CardBody className="gap-3">
											<Skeleton className="h-6 w-40 rounded-lg" />
											<Skeleton className="h-20 w-full rounded-lg" />
										</CardBody>
									</Card>
									<Card>
										<CardBody className="gap-3">
											<Skeleton className="h-6 w-40 rounded-lg" />
											<Skeleton className="h-32 w-full rounded-lg" />
										</CardBody>
									</Card>
								</>
							) : isError ? (
								<Card>
									<CardBody className="text-center py-12">
										<AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
										<h3 className="text-lg font-semibold text-danger mb-2">
											No pudimos cargar el perfil del tutor
										</h3>
										<p className="text-default-500">
											Por favor, intenta nuevamente más tarde
										</p>
									</CardBody>
								</Card>
							) : (
								<>
									{/* Biografía */}
									{profile?.bio && (
										<Card>
											<CardBody>
												<h3 className="text-lg font-semibold mb-2">
													Biografía
												</h3>
												<p className="text-sm text-default-600">
													{profile.bio}
												</p>
											</CardBody>
										</Card>
									)}

									{/* A. Sección de Calificación */}
									<Card>
										<CardBody className="gap-4">
											<div className="flex items-center gap-2">
												<h3 className="text-lg font-semibold">Calificación</h3>
											</div>

											{tutorReviews === 0 ? (
												<div className="flex items-center gap-2">
													<Badge color="primary" variant="flat">
														Nuevo tutor
													</Badge>
													<span className="text-sm text-default-500">
														Aún no tiene calificaciones
													</span>
												</div>
											) : (
												<div className="flex items-center gap-4">
													<div className="flex items-center gap-2">
														<Star className="w-6 h-6 text-red-700 fill-red-700" />
														<span className="text-3xl font-bold text-red-700">
															{tutorRating.toFixed(1)}
														</span>
													</div>
													<div className="text-sm text-default-500">
														<p>
															Basado en{' '}
															{tutorReviews === 1
																? '1 calificación'
																: `${tutorReviews} calificaciones`}
														</p>
													</div>
												</div>
											)}
										</CardBody>
									</Card>

									{/* B. Sección de Materias */}
									<Card>
										<CardBody className="gap-4">
											<div className="flex items-center gap-2">
												<BookOpen className="w-5 h-5 text-primary" />
												<h3 className="text-lg font-semibold">
													Materias que dicta
												</h3>
											</div>

											{profile?.tutorMaterias &&
											profile.tutorMaterias.length > 0 ? (
												<div className="space-y-2">
													{profile.tutorMaterias.map((materia) => (
														<div
															key={materia.id}
															className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-100 transition-colors"
														>
															<Badge
																color="danger"
																variant="solid"
																size="md"
																className="font-mono font-semibold"
															>
																{materia.materia.codigo}
															</Badge>
															<span className="text-sm font-medium text-default-700">
																{materia.materia.nombre}
															</span>
														</div>
													))}
												</div>
											) : (
												<p className="text-default-500">
													No hay materias registradas
												</p>
											)}
										</CardBody>
									</Card>

									{/* C. Sección de Disponibilidad Horaria */}
									<Card>
										<CardBody className="gap-4">
											<div className="flex items-center gap-2">
												<Calendar className="w-5 h-5 text-success" />
												<h3 className="text-lg font-semibold">
													Horarios Disponibles
												</h3>
											</div>

											{availabilityData.length > 0 ? (
												<Table
													aria-label="Tabla de disponibilidad del tutor"
													removeWrapper
													classNames={{
														th: 'bg-default-100',
													}}
												>
													<TableHeader>
														<TableColumn>Día</TableColumn>
														<TableColumn>Horario</TableColumn>
														<TableColumn>Modalidad</TableColumn>
													</TableHeader>
													<TableBody>
														{availabilityData.map((slot, index) => (
															<TableRow key={`${slot.day}-${index}`}>
																<TableCell>{slot.day}</TableCell>
																<TableCell>{slot.time}</TableCell>
																<TableCell>
																	<Badge
																		color={
																			slot.modalidad === 'VIRTUAL'
																				? 'primary'
																				: 'success'
																		}
																		variant="flat"
																		className="flex items-center gap-1"
																	>
																		{slot.modalidad === 'VIRTUAL' ? (
																			<Video className="w-3 h-3" />
																		) : (
																			<MapPin className="w-3 h-3" />
																		)}
																		{slot.modalidad}
																	</Badge>
																</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											) : (
												<p className="text-default-500">
													No hay horarios disponibles registrados
												</p>
											)}
										</CardBody>
									</Card>

									{/* D. Sección de Comentarios Recientes */}
									<Card>
										<CardBody className="gap-4">
											<div className="flex items-center gap-2">
												<MessageSquare className="w-5 h-5 text-warning" />
												<h3 className="text-lg font-semibold">
													Comentarios Recientes
												</h3>
											</div>

											{recentComments.length > 0 ? (
												<div className="space-y-4">
													{recentComments.map((rating) => (
														<Card key={rating.id} shadow="none">
															<CardBody className="gap-2 bg-default-50">
																<div className="flex items-center justify-between">
																	<div className="flex items-center gap-2">
																		{renderStars(rating.score)}
																	</div>
																	<span className="text-xs text-default-400">
																		{formatRelativeDate(rating.createdAt)}
																	</span>
																</div>
																<p className="text-sm font-semibold text-default-600">
																	Estudiante
																</p>
																<p className="text-sm text-default-700">
																	{rating.comment || (
																		<span className="italic text-default-400">
																			Sin comentario escrito
																		</span>
																	)}
																</p>
															</CardBody>
														</Card>
													))}
												</div>
											) : (
												<p className="text-default-500 text-center py-4">
													Este tutor aún no ha recibido calificaciones
												</p>
											)}
										</CardBody>
									</Card>
								</>
							)}
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
