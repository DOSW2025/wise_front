import { Card, CardBody } from '@heroui/react';
import {
	BookOpen,
	GraduationCap,
	Mail,
	MessageCircle,
	Phone,
	Users,
} from 'lucide-react';

export default function TutorHelp() {
	const helpResources = [
		{
			icon: <Users className="w-6 h-6" />,
			title: 'Comunidad de Tutores',
			description: 'Conecta con otros tutores y comparte experiencias',
			color: 'secondary',
		},
		{
			icon: <Mail className="w-6 h-6" />,
			title: 'Contacto Directo',
			description: 'Escríbenos a soporte@eciwise.edu.co',
			color: 'warning',
		},
	];

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Centro de Ayuda</h1>
				<p className="text-default-500">
					Encuentra respuestas y soporte técnico.
				</p>
			</div>

			{/* Hero Section con Imagen Universidad */}
			<Card className="overflow-hidden">
				<CardBody className="p-0">
					<div className="grid md:grid-cols-2 min-h-[400px]">
						{/* Mitad Izquierda - Imagen de la Universidad */}
						<div className="relative h-64 md:h-auto">
							<img
								src="/photos/eci-image-1.jpg"
								alt="Escuela Colombiana de Ingeniería"
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Mitad Derecha - Contenido en Vino Tinto */}
						<div className="bg-primary-600 text-white flex items-center p-8 md:p-12">
							<div className="space-y-4">
								<div className="flex items-center gap-3 mb-6">
									<GraduationCap className="w-16 h-16 text-white/90" />
									<h2 className="text-3xl md:text-4xl font-bold">
										¿Necesitas ayuda? 🚀
									</h2>
								</div>
								<p className="text-lg md:text-xl text-white/95 leading-relaxed">
									¡Estamos aquí para apoyarte! En <strong>ECIWISE+</strong>, tu
									éxito como tutor es nuestra prioridad. No estás solo en este
									camino de enseñanza.
								</p>
								<p className="text-white/90 text-base md:text-lg leading-relaxed">
									La{' '}
									<strong>
										Escuela Colombiana de Ingeniería Julio Garavito
									</strong>{' '}
									te respalda con recursos, guías y una comunidad lista para
									ayudarte a brillar.
								</p>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Recursos de Ayuda */}
			<div>
				<h3 className="text-2xl font-bold text-foreground mb-4">
					Recursos Disponibles
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{helpResources.map((resource, index) => (
						<Card key={index} className="hover:shadow-lg transition-shadow">
							<CardBody className="p-6">
								<div className="flex items-start gap-4">
									<div className={`p-3 rounded-xl ${resource.color}`}>
										{resource.icon}
									</div>
									<div className="flex-1">
										<h4 className="text-lg font-semibold text-foreground mb-1">
											{resource.title}
										</h4>
										<p className="text-default-500 text-sm">
											{resource.description}
										</p>
									</div>
								</div>
							</CardBody>
						</Card>
					))}
				</div>
			</div>

			{/* Información de Contacto */}
			<Card className="border-2 border-primary/20">
				<CardBody className="p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
							<Phone className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-xl font-bold text-foreground">
							Contacto de Emergencia
						</h3>
					</div>
					<div className="space-y-2 text-default-600">
						<p>
							<strong>Email:</strong> soporte@eciwise.edu.co
						</p>
						<p>
							<strong>Teléfono:</strong> +57 (1) 668-3600 ext. 2020
						</p>
						<p>
							<strong>Horario:</strong> Lunes a Viernes, 8:00 AM - 6:00 PM
						</p>
						<p>
							<strong>Campus:</strong> Autopista Norte Ak. 45 No. 205-59, Bogotá
						</p>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
