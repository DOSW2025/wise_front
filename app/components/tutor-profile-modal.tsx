import {
	Avatar,
	Button,
	Card,
	CardBody,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from '@heroui/react';
import { AlertCircle, Calendar, Clock, Star } from 'lucide-react';
import { useTutorProfile } from '~/lib/hooks/useTutorProfile';
import type { TutorAvailability } from '~/lib/types/tutor-profile.types';

interface TutorProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	tutorId: string | null;
}

const DAYS_MAP = {
	monday: 'Lunes',
	tuesday: 'Martes',
	wednesday: 'Miércoles',
	thursday: 'Jueves',
	friday: 'Viernes',
	saturday: 'Sábado',
	sunday: 'Domingo',
};

export function TutorProfileModal({
	isOpen,
	onClose,
	tutorId,
}: TutorProfileModalProps) {
	const { data: profile, isLoading, error } = useTutorProfile(tutorId);

	const formatTime = (time: string) => {
		return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-CO', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
	};

	const renderAvailability = (availability: TutorAvailability[]) => {
		return availability.map((slot, index) => (
			<div key={index} className="flex items-center gap-2 text-sm">
				<Clock className="w-3 h-3 text-default-400" />
				<span>
					{formatTime(slot.start)} - {formatTime(slot.end)}
				</span>
				<Chip
					size="sm"
					variant="flat"
					color={slot.modalidad === 'VIRTUAL' ? 'primary' : 'secondary'}
				>
					{slot.modalidad}
				</Chip>
			</div>
		));
	};

	if (!isOpen) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					Perfil del Tutor
				</ModalHeader>
				<ModalBody>
					{isLoading && (
						<div className="flex justify-center items-center py-8">
							<Spinner size="lg" color="primary" />
						</div>
					)}

					{error && (
						<div className="text-center py-8">
							<AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
							<p className="text-danger">Error al cargar el perfil del tutor</p>
						</div>
					)}

					{profile && (
						<div className="space-y-6">
							{/* Header del perfil */}
							<div className="flex items-start gap-4">
								<Avatar
									src={profile.usuario.avatarUrl}
									name={`${profile.usuario.nombre} ${profile.usuario.apellido}`}
									size="lg"
									className="bg-primary text-white"
								/>
								<div className="flex-1">
									<h3 className="text-xl font-semibold">
										{profile.usuario.nombre} {profile.usuario.apellido}
									</h3>
									<p className="text-default-500">{profile.usuario.email}</p>
									<div className="flex items-center gap-2 mt-2">
										<Star className="w-4 h-4 text-yellow-500 fill-current" />
										<span className="font-medium">
											{profile.reputacion.toFixed(1)}
										</span>
										<span className="text-default-500">
											({profile.ratings.length} reseñas)
										</span>
									</div>
								</div>
							</div>

							{/* Bio */}
							{profile.bio && (
								<Card>
									<CardBody>
										<h4 className="font-semibold mb-2">Acerca de mí</h4>
										<p className="text-default-600">{profile.bio}</p>
									</CardBody>
								</Card>
							)}

							{/* Materias */}
							<Card>
								<CardBody>
									<h4 className="font-semibold mb-3">Materias que enseña</h4>
									<div className="flex flex-wrap gap-2">
										{profile.materias.map((materia) => (
											<Chip key={materia.codigo} variant="flat" color="primary">
												{materia.nombre}
											</Chip>
										))}
									</div>
								</CardBody>
							</Card>

							{/* Disponibilidad */}
							<Card>
								<CardBody>
									<h4 className="font-semibold mb-3 flex items-center gap-2">
										<Calendar className="w-4 h-4" />
										Disponibilidad
									</h4>
									<div className="space-y-3">
										{Object.entries(profile.usuario.disponibilidad).map(
											([day, slots]) => {
												if (!slots || slots.length === 0) return null;
												return (
													<div
														key={day}
														className="border-l-2 border-primary pl-3"
													>
														<h5 className="font-medium text-sm mb-1">
															{DAYS_MAP[day as keyof typeof DAYS_MAP]}
														</h5>
														<div className="space-y-1">
															{renderAvailability(slots)}
														</div>
													</div>
												);
											},
										)}
									</div>
								</CardBody>
							</Card>

							{/* Reseñas recientes */}
							{profile.ratings.length > 0 && (
								<Card>
									<CardBody>
										<h4 className="font-semibold mb-3">Reseñas recientes</h4>
										<div className="space-y-3 max-h-40 overflow-y-auto">
											{profile.ratings.slice(0, 3).map((rating) => (
												<div
													key={rating.id}
													className="border-b border-default-200 pb-2 last:border-b-0"
												>
													<div className="flex items-center gap-2 mb-1">
														<div className="flex items-center">
															{[...Array(5)].map((_, i) => (
																<Star
																	key={i}
																	className={`w-3 h-3 ${
																		i < rating.rating
																			? 'text-yellow-500 fill-current'
																			: 'text-default-300'
																	}`}
																/>
															))}
														</div>
														<span className="text-sm text-default-500">
															{rating.estudianteNombre || 'Estudiante'}
														</span>
													</div>
													{rating.comentario && (
														<p className="text-sm text-default-600">
															{rating.comentario}
														</p>
													)}
												</div>
											))}
										</div>
									</CardBody>
								</Card>
							)}
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="light" onPress={onClose}>
						Cerrar
					</Button>
					{profile && <Button color="primary">Solicitar Tutoría</Button>}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
