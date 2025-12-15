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
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import {
	mapFrontendReasonToBackend,
	reportesService,
	TipoContenido,
} from '~/lib/services/reportes.services';

interface ReportChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	tutorName: string;
	messageId?: string;
	onSubmitReport: (reason: string, details: string) => void;
	isMessageReport?: boolean;
}

export default function ReportChatModal({
	isOpen,
	onClose,
	tutorName,
	messageId,
	onSubmitReport,
	isMessageReport = false,
}: Readonly<ReportChatModalProps>) {
	const [selectedReason, setSelectedReason] = useState('');
	const [details, setDetails] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const reportReasons = [
		{ value: 'harassment', label: 'Acoso o intimidación' },
		{ value: 'inappropriate', label: 'Contenido inapropiado' },
		{ value: 'spam', label: 'Spam o publicidad' },
		{ value: 'offensive', label: 'Lenguaje ofensivo' },
		{ value: 'scam', label: 'Estafa o fraude' },
		{ value: 'impersonation', label: 'Suplantación de identidad' },
		{ value: 'other', label: 'Otro motivo' },
	];

	const handleSubmit = async () => {
		if (!selectedReason) return;

		setIsSubmitting(true);
		setErrorMessage('');

		try {
			const motivo = mapFrontendReasonToBackend(selectedReason);

			if (messageId) {
				await reportesService.createReport({
					contenido_id: messageId,
					tipo_contenido: TipoContenido.MENSAJE_CHAT,
					motivo,
					descripcion: details || undefined,
				});
			} else {
				// Fallback: si no hay messageId, solo ejecuta el callback
				console.warn('No messageId provided, skipping API call');
			}

			onSubmitReport(selectedReason, details);

			setSuccessMessage(
				'Reporte enviado exitosamente. Será revisado por nuestro equipo.',
			);

			setTimeout(() => {
				setSelectedReason('');
				setDetails('');
				setSuccessMessage('');
				onClose();
			}, 2000);
		} catch (error) {
			console.error('Error al crear reporte:', error);
			alert('Error al enviar el reporte. Por favor, intenta nuevamente.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setSelectedReason('');
		setDetails('');
		setSuccessMessage('');
		setErrorMessage('');
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
					{isMessageReport ? 'Reportar mensaje' : 'Reportar conversación'}
				</ModalHeader>
				<ModalBody>
					{/* Mensaje de éxito */}
					{successMessage && (
						<div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
							<p className="text-sm text-success-800 font-medium flex items-center gap-2">
								<CheckCircle className="w-4 h-4" />
								{successMessage}
							</p>
						</div>
					)}

					{/* Mensaje de error */}
					{errorMessage && (
						<div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4">
							<p className="text-sm text-danger-800 font-medium flex items-center gap-2">
								<AlertTriangle className="w-4 h-4" />
								{errorMessage}
							</p>
						</div>
					)}

					{/* Solo mostrar el formulario si no hay mensaje de éxito */}
					{!successMessage && (
						<>
							<p className="text-sm text-gray-600 mb-4">
								{isMessageReport ? (
									<>
										Estás reportando un mensaje de <strong>{tutorName}</strong>.
										Esta acción será revisada por nuestro equipo de moderación.
									</>
								) : (
									<>
										Estás reportando tu conversación completa con{' '}
										<strong>{tutorName}</strong>. Esta acción será revisada por
										nuestro equipo de moderación.
									</>
								)}
							</p>

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
								className="mt-4"
							/>

							<div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mt-4">
								<p className="text-xs text-warning-800">
									<strong>Nota:</strong> Los reportes falsos pueden resultar en
									sanciones para tu cuenta.
								</p>
							</div>
						</>
					)}
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
