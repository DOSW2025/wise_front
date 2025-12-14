import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Divider,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from '@heroui/react';
import {
	ArrowRight,
	Award,
	BookOpen,
	Calendar,
	CheckCircle,
	GraduationCap,
	MessageCircle,
	Sparkles,
	Target,
	TrendingUp,
	Users,
} from 'lucide-react';

export function meta() {
	return [
		{ title: 'ECIWISE+ - Aprender, conectar y compartir sin limites' },
		{
			name: 'description',
			content:
				'Plataforma digital de aprendizaje colaborativo inteligente que conecta a estudiantes, tutores y docentes.',
		},
	];
}

export default function Home() {
	const features = [
		{
			icon: Users,
			title: 'Tutorias Personalizadas',
			description:
				'Solicita y ofrece tutorias academicas personalizadas, virtuales o presenciales.',
			color: 'primary' as const,
		},
		{
			icon: BookOpen,
			title: 'Banco de Materiales',
			description:
				'Accede a guias, examenes pasados, talleres y apuntes organizados por asignatura.',
			color: 'secondary' as const,
		},
		{
			icon: MessageCircle,
			title: 'Grupos de Estudio',
			description:
				'Participa en grupos de estudio y foros colaborativos con tus compañeros.',
			color: 'success' as const,
		},
		{
			icon: Award,
			title: 'Sistema de Reputacion',
			description:
				'Acumula reputacion y reconocimientos por tu participacion activa.',
			color: 'warning' as const,
		},
		{
			icon: Calendar,
			title: 'Planificacion Academica',
			description:
				'Planifica tu tiempo de estudio y recibe recomendaciones inteligentes.',
			color: 'secondary' as const,
		},
		{
			icon: TrendingUp,
			title: 'Seguimiento de Progreso',
			description: 'Visualiza tu progreso y mejora continua en tiempo real.',
			color: 'success' as const,
		},
	];

	const benefits = [
		'Acceso centralizado a recursos academicos',
		'Conexion entre estudiantes, tutores y docentes',
		'Fomento del aprendizaje entre pares',
		'Reconocimiento por esfuerzo y colaboracion',
		'Herramientas tecnologicas avanzadas',
		'Comunidad educativa mas conectada',
	];

	const userProfiles = [
		{
			title: 'Estudiante',
			description:
				'Solicita tutorias, accede a materiales y participa en grupos de estudio.',
			color: 'primary' as const,
		},
		{
			title: 'Tutor Estudiantil',
			description:
				'Publica disponibilidad, comparte conocimiento y recibe calificaciones.',
			color: 'secondary' as const,
		},
		{
			title: 'Docente',
			description:
				'Guia a estudiantes, comparte materiales y supervisa el progreso.',
			color: 'success' as const,
		},
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Navbar */}
			<Navbar isBordered maxWidth="xl">
				<NavbarBrand>
					<GraduationCap className="text-primary" size={32} />
					<p className="font-logo font-bold text-xl text-primary ml-2">
						ECIWISE+
					</p>
				</NavbarBrand>
				<NavbarContent className="hidden sm:flex gap-4" justify="center">
					<NavbarItem>
						<Link color="foreground" href="#features" className="font-nav">
							Caracteristicas
						</Link>
					</NavbarItem>
					<NavbarItem>
						<Link color="foreground" href="#benefits" className="font-nav">
							Beneficios
						</Link>
					</NavbarItem>
					<NavbarItem>
						<Link color="foreground" href="#profiles" className="font-nav">
							Perfiles
						</Link>
					</NavbarItem>
				</NavbarContent>
				<NavbarContent justify="end">
					<NavbarItem>
						<Button
							as={Link}
							color="primary"
							href="/login"
							variant="flat"
							className="font-nav"
						>
							Iniciar Sesion
						</Button>
					</NavbarItem>
				</NavbarContent>
			</Navbar>

			{/* Hero Section */}
			<section className="w-full py-20 px-6 bg-gradient-to-b from-content1 to-background">
				<div className="max-w-7xl mx-auto text-center">
					<Chip
						color="primary"
						variant="flat"
						startContent={<Sparkles size={16} />}
						className="mb-6 font-nav"
					>
						Plataforma de Aprendizaje Colaborativo
					</Chip>
					<h1 className="text-5xl md:text-6xl font-logo font-bold text-foreground mb-6">
						ECIWISE+
					</h1>
					<p className="text-2xl md:text-3xl text-primary font-logo font-semibold mb-4">
						Aprender, conectar y compartir sin limites
					</p>
					<p className="text-lg text-default-600 max-w-3xl mx-auto mb-8">
						Plataforma digital de aprendizaje colaborativo inteligente que
						conecta a estudiantes, tutores y docentes para compartir
						conocimiento de forma estructurada, segura y accesible.
					</p>
					<div className="flex gap-4 justify-center flex-wrap">
						<Button
							color="primary"
							size="lg"
							endContent={<ArrowRight size={20} />}
							as={Link}
							href="/login"
						>
							Comenzar Ahora
						</Button>
						<Button
							color="default"
							variant="bordered"
							size="lg"
							startContent={<Target size={20} />}
						>
							Conoce Mas
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="w-full py-20 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-heading font-bold text-foreground mb-4">
							Caracteristicas Principales
						</h2>
						<p className="text-lg text-default-600 max-w-2xl mx-auto">
							Descubre todas las herramientas que ECIWISE+ ofrece para potenciar
							tu experiencia de aprendizaje
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<Card
									key={index}
									className="border-none bg-content1"
									shadow="sm"
								>
									<CardHeader className="flex gap-3">
										<div className="p-2 rounded-lg bg-primary/10">
											<Icon className="text-primary" size={24} />
										</div>
										<div className="flex flex-col">
											<p className="text-lg font-semibold font-heading">
												{feature.title}
											</p>
										</div>
									</CardHeader>
									<CardBody>
										<p className="text-default-600">{feature.description}</p>
									</CardBody>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<Divider className="max-w-7xl mx-auto" />

			{/* Benefits Section */}
			<section id="benefits" className="w-full py-20 px-6 bg-content1">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-heading font-bold text-foreground mb-4">
							Objetivos y Beneficios
						</h2>
						<p className="text-lg text-default-600 max-w-2xl mx-auto">
							ECIWISE+ transforma la experiencia educativa a traves de la
							colaboracion y la tecnologia
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
						{benefits.map((benefit, index) => (
							<div key={index} className="flex items-start gap-3">
								<CheckCircle
									className="text-success mt-1 flex-shrink-0"
									size={20}
								/>
								<p className="text-default-700">{benefit}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<Divider className="max-w-7xl mx-auto" />

			{/* User Profiles Section */}
			<section id="profiles" className="w-full py-20 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-heading font-bold text-foreground mb-4">
							Perfiles de Usuario
						</h2>
						<p className="text-lg text-default-600 max-w-2xl mx-auto">
							ECIWISE+ esta diseñado para diferentes tipos de usuarios en la
							comunidad educativa
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{userProfiles.map((profile, index) => (
							<Card key={index} className="border-none" shadow="md" isPressable>
								<CardHeader>
									<h3 className="text-xl font-bold text-foreground font-heading">
										{profile.title}
									</h3>
								</CardHeader>
								<Divider />
								<CardBody>
									<p className="text-default-600">{profile.description}</p>
								</CardBody>
								<CardFooter>
									<Chip color={profile.color} variant="flat" size="sm">
										Mas informacion
									</Chip>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="w-full py-20 px-6 bg-gradient-to-b from-content1 to-content2">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl font-heading font-bold text-foreground mb-4">
						El conocimiento no se guarda, se comparte
					</h2>
					<p className="text-lg text-default-600 mb-8">
						Unete a ECIWISE+ y forma parte de una comunidad academica mas
						conectada, solidaria y eficiente
					</p>
					<Button
						color="primary"
						size="lg"
						className="font-nav"
						endContent={<ArrowRight size={20} />}
						as={Link}
						href="/login"
					>
						Comenzar tu Experiencia
					</Button>
				</div>
			</section>

			{/* Footer */}
			<footer className="w-full py-8 px-6 border-t border-divider">
				<div className="max-w-7xl mx-auto text-center">
					<div className="flex items-center justify-center gap-2 mb-4">
						<GraduationCap className="text-primary" size={24} />
						<p className="font-bold text-lg text-primary font-logo">ECIWISE+</p>
					</div>
					<p className="text-sm text-default-600">
						Desarrollo de Operaciones de Software - 2025-2
					</p>
					<p className="text-sm text-default-500 mt-2">
						Escuela Colombiana de Ingenieria
					</p>
				</div>
			</footer>
		</div>
	);
}
