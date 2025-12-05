import { Button, Card, CardBody, Chip, Progress } from '@heroui/react';
import { CheckCircle2, Square, Target } from 'lucide-react';
import type { Challenge } from '~/lib/types/gamification.types';

interface ChallengeCardProps {
	challenge: Challenge;
	onClaim?: (challengeId: string) => void;
}

function getStatusColor(status: Challenge['estadoUsuario']) {
	switch (status) {
		case 'no_iniciado':
			return 'default';
		case 'en_progreso':
			return 'primary';
		case 'listo_reclamar':
			return 'success';
		case 'completado':
			return 'secondary';
	}
}

function getStatusText(status: Challenge['estadoUsuario']) {
	switch (status) {
		case 'no_iniciado':
			return 'No iniciado';
		case 'en_progreso':
			return 'En progreso';
		case 'listo_reclamar':
			return 'Listo para reclamar';
		case 'completado':
			return 'Completado';
	}
}

export function ChallengeCard({ challenge, onClaim }: ChallengeCardProps) {
	const fechaFin = new Date(challenge.periodo.fin);
	const diasRestantes = Math.ceil(
		(fechaFin.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
	);

	return (
		<Card
			className={
				challenge.estadoUsuario === 'listo_reclamar'
					? 'border-2 border-success'
					: ''
			}
		>
			<CardBody className="gap-4">
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-3 flex-1">
						<span className="text-3xl">{challenge.icon}</span>
						<div className="flex-1">
							<h4 className="font-bold text-foreground">{challenge.titulo}</h4>
							<p className="text-sm text-default-500 mt-1">
								{challenge.descripcion}
							</p>
						</div>
					</div>
					<Chip
						size="sm"
						color={getStatusColor(challenge.estadoUsuario)}
						variant="flat"
					>
						{getStatusText(challenge.estadoUsuario)}
					</Chip>
				</div>

				<div className="space-y-2">
					{challenge.objetivos.map((objetivo, index) => (
						<div key={index} className="flex items-center gap-2">
							{objetivo.completado ? (
								<CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
							) : (
								<Square className="w-4 h-4 text-default-400 flex-shrink-0" />
							)}
							<span
								className={`text-sm ${objetivo.completado ? 'text-success line-through' : 'text-default-600'}`}
							>
								{objetivo.descripcion}
							</span>
						</div>
					))}
				</div>

				<div className="space-y-2">
					<Progress
						value={challenge.progreso}
						color="primary"
						size="sm"
						showValueLabel={true}
						classNames={{
							value: 'text-xs',
						}}
					/>
				</div>

				<div className="flex items-center justify-between pt-2 border-t border-divider">
					<div className="flex items-center gap-4">
						<div>
							<p className="text-xs text-default-500">Recompensa</p>
							<p className="text-lg font-bold text-warning">
								+{challenge.recompensaXP} XP
							</p>
						</div>
						<div>
							<p className="text-xs text-default-500">Tiempo restante</p>
							<p className="text-sm font-semibold text-default-700">
								{diasRestantes > 0 ? `${diasRestantes} días` : 'Finalizado'}
							</p>
						</div>
					</div>

					{challenge.estadoUsuario === 'listo_reclamar' && (
						<Button
							color="success"
							variant="shadow"
							size="sm"
							onPress={() => onClaim?.(challenge.id)}
						>
							Reclamar Recompensa
						</Button>
					)}
				</div>
			</CardBody>
		</Card>
	);
}

interface ChallengesListProps {
	challenges: Challenge[];
	onClaim?: (challengeId: string) => void;
}

export function ChallengesList({ challenges, onClaim }: ChallengesListProps) {
	if (challenges.length === 0) {
		return (
			<Card>
				<CardBody className="text-center py-8">
					<Target className="w-12 h-12 mx-auto mb-2 text-default-300" />
					<p className="text-default-500">No hay desafíos activos</p>
					<p className="text-sm text-default-400 mt-1">
						Los desafíos semanales aparecerán aquí
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4">
			{challenges.map((challenge) => (
				<ChallengeCard
					key={challenge.id}
					challenge={challenge}
					onClaim={onClaim}
				/>
			))}
		</div>
	);
}
