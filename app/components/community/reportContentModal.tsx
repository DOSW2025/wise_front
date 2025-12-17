import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Radio,
	RadioGroup,
	Textarea,
} from '@heroui/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import {
	mapFrontendReasonToBackend,
	reportesService,
	TipoContenido,
} from '~/lib/services/reportes.services';

interface ReportContentModalProps {
	isOpen: boolean;
	onClose: () => void;
	contenidoId: string;
	tipoContenido: TipoContenido;
	nombreContenido?: string; // Ej: "este thread", "esta respuesta"
}

const reportReasons = [
	{ value: 'harassment', label: 'Acoso o intimidación' },
	{ value: 'inappropriate', label: 'Contenido inapropiado' },
	{ value: 'spam', label: 'Spam o publicidad' },
	{ value: 'offensive', label: 'Lenguaje ofensivo' },
	{ value: 'scam', label: 'Estafa o fraude' },
	{ value: 'impersonation', label: 'Suplantación de identidad' },
	{ value: 'other', label: 'Otro motivo' },
];

export default function ReportContentModal({
	isOpen,
	onClose,
	contenidoId,
	tipoContenido,
	nombreContenido = 'este contenido',
}: Readonly<ReportContentModalProps>) {
	const [selectedReason, setSelectedReason] = useState('');
	const [details, setDetails] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getTipoTexto = () => {
		switch (tipoContenido) {
			case TipoContenido.THREAD:
				return 'thread';
			case TipoContenido.RESPONSE:
				return 'respuesta';
			case TipoContenido.MENSAJE_CHAT:
				return 'mensaje';
			default:
				return 'contenido';
		}
	};

	const handleSubmit = async () => {
		if (!selectedReason) return;

		setIsSubmitting(true);
		setError(null);

		try {
			const motivo = mapFrontendReasonToBackend(selectedReason);

			await reportesService.createReport({
				contenido_id: contenidoId,
				tipo_contenido: tipoContenido,
				motivo,
				descripcion: details || undefined,
			});

			// Resetear formulario
			setSelectedReason('');
			setDetails('');
			onClose();

			// Mostrar mensaje de éxito (opcional)
			alert('Reporte enviado exitosamente. Será revisado por nuestro equipo.');
		} catch (err) {
			console.error('Error al crear reporte:', err);
			setError(
				err instanceof Error ? err.message : 'Error al enviar el reporte',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setSelectedReason('');
		setDetails('');
		setError(null);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="md"
			classNames={{
				backdrop: 'bg-black/50',
				base: 'bg-white',
			}}
		>
			<ModalContent>
				<ModalHeader className="flex gap-2 items-center text-danger">
					<AlertTriangle className="w-5 h-5" />
					Reportar {getTipoTexto()}
				</ModalHeader>
				<ModalBody>
					<p className="text-sm text-gray-600 mb-4">
						Estás reportando {nombreContenido}. Esta acción será revisada por
						nuestro equipo de moderación.
					</p>

					{error && (
						<div className="bg-danger-50 border border-danger-200 rounded-lg p-3 mb-4">
							<p className="text-sm text-danger-800">{error}</p>
						</div>
					)}

					<RadioGroup
						label="Motivo del reporte"
						value={selectedReason}
						onValueChange={setSelectedReason}
						isRequired
					>
						{reportReasons.map((reason) => (
							<Radio key={reason.value} value={reason.value}>
								{reason.label}
							</Radio>
						))}
					</RadioGroup>

					<Textarea
						label="Detalles adicionales (opcional)"
						placeholder="Describe brevemente la situación..."
						value={details}
						onValueChange={setDetails}
						minRows={3}
						maxRows={6}
						maxLength={500}
						className="mt-4"
					/>

					<div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mt-4">
						<p className="text-xs text-warning-800">
							<strong>Nota:</strong> Los reportes falsos pueden resultar en
							sanciones para tu cuenta.
						</p>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						variant="light"
						onPress={handleClose}
						isDisabled={isSubmitting}
					>
						Cancelar
					</Button>
					<Button
						color="danger"
						onPress={handleSubmit}
						isDisabled={!selectedReason || isSubmitting}
						isLoading={isSubmitting}
					>
						Enviar reporte
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
