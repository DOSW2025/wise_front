import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
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

const scrollbarStyles = `
	::-webkit-scrollbar {
		width: 10px;
	}
	::-webkit-scrollbar-track {
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		background: rgba(155, 155, 155, 0.5);
		border-radius: 6px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: rgba(155, 155, 155, 0.8);
	}
`;

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
			title: 'Colaboracion Confiable',
			description:
				'Perfiles verificados y comunidad respaldada para aprender con confianza.',
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
		<div className="min-h-screen bg-gradient-to-br from-white via-content1 to-default-100">
			<style>{scrollbarStyles}</style>
			{/* Navbar - Clean & Minimalist */}
			<Navbar
				isBordered={false}
				maxWidth="xl"
				className="bg-background/60 backdrop-blur-md border-b border-divider/50"
			>
				<NavbarBrand>
					<img
						src="/logo/logoeciwise.svg"
						alt="ECIWISE+ logo"
						className="w-10 h-10"
					/>
					<p className="font-logo font-bold text-2xl text-primary ml-3">
						ECIWISE+
					</p>
				</NavbarBrand>
				<NavbarContent className="hidden sm:flex gap-8" justify="center">
					<NavbarItem>
						<Link
							color="foreground"
							href="#features"
							className="font-nav text-medium hover:text-primary transition-colors"
						>
							Características
						</Link>
					</NavbarItem>
					<NavbarItem>
						<Link
							color="foreground"
							href="#benefits"
							className="font-nav text-medium hover:text-primary transition-colors"
						>
							Beneficios
						</Link>
					</NavbarItem>
					<NavbarItem>
						<Link
							color="foreground"
							href="#profiles"
							className="font-nav text-medium hover:text-primary transition-colors"
						>
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
							size="lg"
							className="font-nav font-semibold px-8 shadow-lg shadow-primary/30"
							endContent={<ArrowRight size={18} />}
						>
							Iniciar Sesión
						</Button>
					</NavbarItem>
				</NavbarContent>
			</Navbar>

			{/* Hero Section - Two Column Layout */}
			<section className="w-full py-16 md:py-24 px-6 overflow-hidden">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
						{/* Left Column - Content */}
						<div className="space-y-8">
							<div>
								<Chip
									color="primary"
									variant="flat"
									startContent={<Sparkles size={16} className="ml-1" />}
									className="mb-6 font-nav"
								>
									Más que una plataforma
								</Chip>
								<h1 className="text-5xl md:text-6xl lg:text-7xl font-logo font-bold text-foreground mb-6 leading-tight">
									Aprender, Conectar y{' '}
									<span className="text-primary">Compartir</span>
								</h1>
								<h2 className="text-2xl md:text-3xl text-default-700 font-heading mb-6">
									Sin Límites con ECIWISE+
								</h2>
								<p className="text-lg md:text-xl text-default-600 leading-relaxed font-sans max-w-xl">
									Plataforma digital de aprendizaje colaborativo inteligente que
									conecta a estudiantes, tutores y docentes para compartir
									conocimiento de forma estructurada, segura y accesible.
								</p>
							</div>
							<div className="flex gap-4 flex-wrap">
								<Button
									color="primary"
									size="lg"
									endContent={<ArrowRight size={20} />}
									as={Link}
									href="/login"
									className="font-nav font-semibold px-8 shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/50 transition-all"
								>
									Comenzar Ahora
								</Button>
								<Button
									color="default"
									variant="bordered"
									size="lg"
									startContent={<Target size={20} />}
									className="font-nav font-semibold px-8 border-2"
									as={Link}
									href="#features"
								>
									Conoce Más
								</Button>
							</div>

							{/* Quick Stats Cards */}
							<div className="grid grid-cols-3 gap-4 pt-8">
								<div className="bg-content1/80 backdrop-blur-sm rounded-2xl p-4 border border-divider/50 shadow-md">
									<div className="flex items-center gap-2 mb-1">
										<Users className="text-primary" size={20} />
										<p className="text-2xl font-bold text-foreground font-heading">
											+500
										</p>
									</div>
									<p className="text-xs text-default-700 font-sans">
										Estudiantes esperados
									</p>
								</div>
								<div className="bg-content1/80 backdrop-blur-sm rounded-2xl p-4 border border-divider/50 shadow-md">
									<div className="flex items-center gap-2 mb-1">
										<BookOpen className="text-secondary" size={20} />
										<p className="text-2xl font-bold text-foreground font-heading">
											+1K
										</p>
									</div>
									<p className="text-xs text-default-700 font-sans">
										Materiales compartidos
									</p>
								</div>
								<div className="bg-content1/80 backdrop-blur-sm rounded-2xl p-4 border border-divider/50 shadow-md">
									<div className="flex items-center gap-2 mb-1">
										<GraduationCap className="text-success" size={20} />
										<p className="text-2xl font-bold text-foreground font-heading">
											+200
										</p>
									</div>
									<p className="text-xs text-default-700 font-sans">
										Tutores esperados
									</p>
								</div>
							</div>
						</div>

						{/* Right Column - Illustration/Visual with subtle institutional image */}
						<div className="relative ">
							<div className="relative rounded-3xl bg-gradient-to-br from-primary/15 via-danger/10 to-white p-8 md:p-12 backdrop-blur-sm border border-divider/30 shadow-2xl overflow-hidden min-h-[400px] md:min-h-[450px] lg:min-h-[500px] max-w-[900px] mx-auto">
								<div className="absolute inset-0">
									<img
										src="/photos/eci-image-2.jpg"
										alt="Comunidad académica ECIWISE+"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-br from-white/30 via-content1/50 to-white/90"></div>
								</div>

								{/* Floating Cards */}
								<div className="relative space-y-6">
									{/* Card 1 */}
									<div className="bg-content1/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-divider/50 transform hover:scale-105 transition-transform">
										<div className="flex items-center gap-4">
											<div className="p-3 rounded-xl bg-primary/10">
												<BookOpen className="text-primary" size={32} />
											</div>
											<div>
												<p className="font-heading font-semibold text-lg text-foreground">
													Recursos Académicos
												</p>
												<p className="text-sm text-default-600 font-sans">
													Accede a materiales de calidad
												</p>
											</div>
										</div>
									</div>

									{/* Card 2 */}
									<div className="bg-content1/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-divider/50 transform hover:scale-105 transition-transform ml-8">
										<div className="flex items-center gap-4">
											<div className="p-3 rounded-xl bg-secondary/10">
												<Users className="text-secondary" size={32} />
											</div>
											<div>
												<p className="font-heading font-semibold text-lg text-foreground">
													Tutorías Personalizadas
												</p>
												<p className="text-sm text-default-600 font-sans">
													Aprende con expertos
												</p>
											</div>
										</div>
									</div>

									{/* Card 3 */}
									<div className="bg-content1/95 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-divider/50 transform hover:scale-105 transition-transform">
										<div className="flex items-center gap-4">
											<div className="p-3 rounded-xl bg-success/10">
												<MessageCircle className="text-success" size={32} />
											</div>
											<div>
												<p className="font-heading font-semibold text-lg text-foreground">
													Comunidad Colaborativa
												</p>
												<p className="text-sm text-default-600 font-sans">
													Conecta con tu comunidad
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Decorative Elements */}
								<div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/15 rounded-full blur-3xl"></div>
								<div className="absolute -bottom-6 -left-6 w-32 h-32 bg-danger/15 rounded-full blur-3xl"></div>
							</div>

							{/* Additional floating badge */}
							<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-content1 rounded-full px-6 py-3 shadow-xl border border-divider/50">
								<div className="flex items-center gap-2">
									<GraduationCap className="text-primary" size={20} />
									<p className="font-semibold text-sm font-heading">
										Alianza Académica
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section - Modern Card Design */}
			<section id="features" className="w-full py-24 px-6 bg-background">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16 space-y-4">
						<Chip color="primary" variant="flat" className="font-nav">
							Características
						</Chip>
						<h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
							Todo lo que Necesitas
						</h2>
						<p className="text-lg md:text-xl text-default-600 max-w-3xl mx-auto font-sans leading-relaxed">
							Descubre todas las herramientas que ECIWISE+ ofrece para potenciar
							tu experiencia de aprendizaje colaborativo
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<Card
									key={index}
									className="border border-divider/50 bg-content1 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
									shadow="lg"
								>
									<CardHeader className="flex gap-4 pb-4">
										<div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
											<Icon className="text-primary" size={28} />
										</div>
										<div className="flex flex-col justify-center">
											<p className="text-xl font-bold font-heading text-foreground">
												{feature.title}
											</p>
										</div>
									</CardHeader>
									<CardBody className="pt-0">
										<p className="text-default-600 font-sans text-base leading-relaxed">
											{feature.description}
										</p>
									</CardBody>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			{/* Benefits Section - Modern Grid Cards */}
			<section
				id="benefits"
				className="w-full py-24 px-6 bg-gradient-to-b from-content1 to-background"
			>
				<div className="max-w-7xl mx-auto relative">
					<div className="text-center mb-16 space-y-4">
						<Chip color="success" variant="flat" className="font-nav">
							Beneficios
						</Chip>
						<h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
							Transformando la Educación
						</h2>
						<p className="text-lg md:text-xl text-default-600 max-w-3xl mx-auto font-sans leading-relaxed">
							ECIWISE+ revoluciona la experiencia educativa a través de la
							colaboración y la tecnología inteligente
						</p>
					</div>

					{/* Subtle institutional photo */}
					<div className="hidden lg:block absolute right-[-12rem] top-16 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border border-divider/50">
						<img
							src="/photos/eci-image-1.jpg"
							alt="Campus ECIWISE+"
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-br from-white/65 via-content1/70 to-white/85"></div>
					</div>
					<div className="hidden lg:block absolute left-[-10rem] bottom-[-10rem] w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border border-divider/50">
						<img
							src="/photos/eci-people.jpg"
							alt="Campus ECIWISE+"
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-br from-white/65 via-content1/70 to-white/85"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
						{benefits.map((benefit, index) => (
							<div
								key={index}
								className="bg-content1 rounded-2xl p-6 border border-divider/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-start gap-4"
							>
								<div className="p-2 rounded-xl bg-success/10 flex-shrink-0">
									<CheckCircle className="text-success" size={24} />
								</div>
								<p className="text-default-700 font-sans text-base leading-relaxed">
									{benefit}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* User Profiles Section - Floating Cards */}
			<section id="profiles" className="w-full py-24 px-6 bg-background">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16 space-y-4">
						<Chip color="secondary" variant="flat" className="font-nav">
							Perfiles
						</Chip>
						<h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
							Diseñado Para Ti
						</h2>
						<p className="text-lg md:text-xl text-default-600 max-w-3xl mx-auto font-sans leading-relaxed">
							ECIWISE+ está diseñado para diferentes tipos de usuarios en la
							comunidad educativa
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{userProfiles.map((profile, index) => (
							<Card
								key={index}
								className="border border-divider/50 bg-gradient-to-br from-content1 to-content2 hover:shadow-2xl hover:scale-105 transition-all duration-300"
								shadow="lg"
								isPressable
							>
								<CardHeader className="pb-4">
									<div className="flex flex-col gap-2 w-full">
										<div className="flex items-center justify-between">
											<h3 className="text-2xl font-bold text-foreground font-heading">
												{profile.title}
											</h3>
											<GraduationCap className="text-primary" size={32} />
										</div>
										<Chip
											color={profile.color}
											variant="flat"
											size="sm"
											className="w-fit"
										>
											Rol principal
										</Chip>
									</div>
								</CardHeader>
								<CardBody className="pt-0 pb-6">
									<p className="text-default-600 font-sans text-base leading-relaxed">
										{profile.description}
									</p>
								</CardBody>
								<CardFooter className="pt-0">
									<Button
										color={profile.color}
										variant="flat"
										size="sm"
										className="font-nav"
										endContent={<ArrowRight size={16} />}
									>
										Más información
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section - Modern & Spacious */}
			<section className="w-full py-32 px-6 bg-gradient-to-br from-primary/15 via-danger/10 to-white relative overflow-hidden">
				{/* Background decorations */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
					<div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
				</div>

				<div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
					<div className="space-y-6">
						<h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
							El conocimiento no se guarda,{' '}
							<span className="text-primary">se comparte</span>
						</h2>
						<p className="text-lg md:text-xl text-default-600 max-w-3xl mx-auto font-sans leading-relaxed">
							Únete a ECIWISE+ y forma parte de una comunidad académica más
							conectada, solidaria y eficiente. Comienza hoy tu viaje de
							aprendizaje colaborativo.
						</p>
					</div>

					<div className="flex gap-4 justify-center flex-wrap">
						<Button
							color="primary"
							size="lg"
							className="font-nav font-semibold px-10 py-6 text-lg shadow-2xl shadow-primary/50 hover:shadow-3xl hover:shadow-primary/60 transition-all"
							endContent={<ArrowRight size={22} />}
							as={Link}
							href="/login"
						>
							Comenzar tu Experiencia
						</Button>
						<Button
							color="default"
							variant="bordered"
							size="lg"
							className="font-nav font-semibold px-10 py-6 text-lg border-2"
							as={Link}
							href="/register"
						>
							Crear Cuenta Gratis
						</Button>
					</div>

					{/* Trust badges */}
					<div className="flex items-center justify-center gap-8 flex-wrap pt-8">
						<div className="flex items-center gap-2 text-default-600">
							<CheckCircle className="text-success" size={20} />
							<span className="font-sans">100% Gratis</span>
						</div>
						<div className="flex items-center gap-2 text-default-600">
							<CheckCircle className="text-success" size={20} />
							<span className="font-sans">Sin publicidad</span>
						</div>
						<div className="flex items-center gap-2 text-default-600">
							<CheckCircle className="text-success" size={20} />
							<span className="font-sans">Comunidad activa</span>
						</div>
					</div>
				</div>
			</section>

			{/* Footer - Clean & Modern */}
			<footer className="w-full py-12 px-6 border-t border-divider/50 bg-content1">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
						{/* Brand */}
						<div className="flex flex-col items-center md:items-start gap-3">
							<div className="flex items-center gap-2">
								<img
									src="/logo/logoeciwise.svg"
									alt="ECIWISE+ logo"
									className="w-8 h-8"
								/>
								<p className="font-bold text-xl text-primary font-logo">
									ECIWISE+
								</p>
							</div>
							<p className="text-sm text-default-600 font-sans text-center md:text-left">
								Plataforma de aprendizaje colaborativo
							</p>
						</div>

						{/* Quick Links */}
						<div className="flex flex-col items-center gap-3">
							<h4 className="font-semibold text-foreground font-heading">
								Enlaces Rápidos
							</h4>
							<div className="flex flex-col gap-2 items-center">
								<Link
									href="#features"
									className="text-sm text-default-600 hover:text-primary transition-colors font-sans"
								>
									Características
								</Link>
								<Link
									href="#benefits"
									className="text-sm text-default-600 hover:text-primary transition-colors font-sans"
								>
									Beneficios
								</Link>
								<Link
									href="#profiles"
									className="text-sm text-default-600 hover:text-primary transition-colors font-sans"
								>
									Perfiles
								</Link>
							</div>
						</div>

						{/* Info */}
						<div className="flex flex-col items-center md:items-end gap-3">
							<h4 className="font-semibold text-foreground font-heading">
								Información
							</h4>
							<div className="flex flex-col gap-1 items-center md:items-end">
								<p className="text-sm text-default-600 font-sans">
									Desarrollo de Operaciones de Software
								</p>
								<p className="text-sm text-default-500 font-sans">
									Escuela Colombiana de Ingeniería
								</p>
								<p className="text-xs text-default-400 font-sans mt-1">
									© 2025 ECIWISE+ - Todos los derechos reservados
								</p>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
