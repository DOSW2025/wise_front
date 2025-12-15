import { Card, CardBody } from '@heroui/react';
import {
	BookOpen,
	GraduationCap,
	Mail,
	MessageCircle,
	Phone,
	Settings,
	Shield,
	Users,
} from 'lucide-react';
import { PageHeader } from '~/components/page-header';

export default function AdminHelp() {
	const adminResources = [
		{
			icon: <Shield className="w-6 h-6" />,
			title: 'Guía de Administración',
			description: 'Gestiona la plataforma de forma eficiente y segura',
			color: 'danger',
		},
		{
			icon: <Settings className="w-6 h-6" />,
			title: 'Configuración del Sistema',
			description: 'Aprende a configurar y personalizar ECIWISE+',
			color: 'primary',
		},
		{
			icon: <Users className="w-6 h-6" />,
			title: 'Gestión de Usuarios',
			description: 'Administra roles, permisos y usuarios de la plataforma',
			color: 'secondary',
		},
		{
			icon: <MessageCircle className="w-6 h-6" />,
			title: 'Soporte Técnico Premium',
			description: 'Acceso prioritario al equipo de desarrollo',
			color: 'success',
		},
	];

	return (
		<div className="space-y-8">
			<PageHeader
				title="Centro de Ayuda"
				description="Encuentra respuestas a las preguntas más frecuentes"
			/>

			{/* Hero Section Administrativo */}
			<Card className="overflow-hidden">
				<CardBody className="p-0">
					<div className="grid md:grid-cols-2 min-h-[400px]">
						{/* Mitad Izquierda - Imagen de la Universidad */}
						<div className="relative h-64 md:h-auto">
							<img
								src="/photos/eci-image-2.jpg"
								alt="Escuela Colombiana de Ingeniería"
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Mitad Derecha - Contenido */}
						<div className="bg-primary-600 text-white flex items-center p-8 md:p-12">
							<div className="space-y-4">
								<div className="flex items-center gap-3 mb-6">
									<Shield className="w-16 h-16 text-white/90" />
									<h2 className="text-3xl md:text-4xl font-bold">
										¿Necesitas ayuda? 🛡️
									</h2>
								</div>
								<div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
									💼 Panel Administrativo
								</div>
								<p className="text-lg md:text-xl text-white/95 leading-relaxed">
									Como administrador de <strong>ECIWISE+</strong>, tienes acceso
									a herramientas poderosas. Estamos aquí para ayudarte a
									aprovecharlas al máximo.
								</p>
								<p className="text-white/90 text-base md:text-lg leading-relaxed">
									La{' '}
									<strong>
										Escuela Colombiana de Ingeniería Julio Garavito
									</strong>{' '}
									confía en ti para liderar esta plataforma. Aquí encontrarás
									todo el soporte que necesitas.
								</p>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Recursos Administrativos */}
			<div>
				<h3 className="text-2xl font-bold text-foreground mb-4">
					Recursos para Administradores
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{adminResources.map((resource, index) => (
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

			{/* Quick Links */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="border-2 border-primary/20">
					<CardBody className="text-center p-6">
						<BookOpen className="w-12 h-12 text-primary mx-auto mb-3" />
						<h4 className="font-bold text-lg mb-2">API Documentation</h4>
						<p className="text-sm text-default-500">
							Integra servicios externos
						</p>
					</CardBody>
				</Card>
				<Card className="border-2 border-success/20">
					<CardBody className="text-center p-6">
						<Settings className="w-12 h-12 text-success mx-auto mb-3" />
						<h4 className="font-bold text-lg mb-2">Logs del Sistema</h4>
						<p className="text-sm text-default-500">Monitorea actividad</p>
					</CardBody>
				</Card>
				<Card className="border-2 border-secondary/20">
					<CardBody className="text-center p-6">
						<Shield className="w-12 h-12 text-secondary mx-auto mb-3" />
						<h4 className="font-bold text-lg mb-2">Seguridad</h4>
						<p className="text-sm text-default-500">Configuración avanzada</p>
					</CardBody>
				</Card>
			</div>

			{/* Contacto Premium */}
			<Card className="border-2 border-secondary/20">
				<CardBody className="p-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
							<Mail className="w-5 h-5 text-white" />
						</div>
						<h3 className="text-xl font-bold text-foreground">
							Soporte Técnico Premium 24/7
						</h3>
					</div>
					<div className="space-y-2 text-default-600">
						<p>
							<strong>Email Prioritario:</strong> admin@eciwise.edu.co
						</p>
						<p>
							<strong>Línea Directa:</strong> +57 (1) 668-3600 ext. 1000
						</p>
						<p>
							<strong>WhatsApp Admin:</strong> +57 300 123 4567
						</p>
						<p>
							<strong>Disponibilidad:</strong> 24/7 para emergencias críticas
						</p>
						<p className="text-sm italic mt-4">
							💡 Tip: Como administrador, tienes acceso prioritario a todo el
							equipo de desarrollo.
						</p>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
