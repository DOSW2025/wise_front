// Tipos TypeScript para materiales
export interface Comment {
	id: string;
	userId: string;
	userName: string;
	date: string;
	content: string;
}
export interface Material {
	id: string;
	title: string;
	author: string;
	subject: string;
	semester: string;
	fileType: 'PDF'; //Por ahora dado el ael alcance se recibe solo PDF;
	date: string;
	rating: number;
	ratingsCount: number;
	downloads: number;
	comments: number;
	description: string;
	commentsList: Comment[];
	fileUrl?: string; // URL del archivo para vista previa
}

// Configuraciones
export const subjects = [
	'Todos',
	'Programación',
	'Matemáticas',
	'Física',
	'Química',
];
export const semesters = [
	'Todos',
	'1er Semestre',
	'2do Semestre',
	'3er Semestre',
	'4to Semestre',
];
export const fileTypes = ['Todos', 'PDF', 'DOC', 'XLSX', 'PPT', 'IMG', 'VIDEO'];
export const sortOptions = [
	'Todos',
	'Más relevantes',
	'Más recientes',
	'Mejor valorado',
	'Más descargados',
];

export const fileTypeColors: Record<string, string> = {
	PDF: 'bg-red-50 text-red-600',
};

// Datos mock
export const mockMaterials: Material[] = [
	{
		id: '1',
		title: 'Python para principiantes',
		author: 'Ing. Ana López',
		subject: 'Programación',
		semester: '2do Semestre',
		fileType: 'PDF',
		date: '20 oct 2025',
		rating: 4.8,
		ratingsCount: 234,
		downloads: 2103,
		comments: 78,
		description:
			'Documento completo sobre programación en Python desde cero con ejemplos prácticos y ejercicios.',
		commentsList: [
			{
				id: 'c1',
				userId: 'user1',
				userName: 'Juana Lozano',
				date: '5 nov 2025',
				content:
					'Excelente material, muy completo y bien explicado. Me ayudó mucho para el examen.',
			},
			{
				id: 'c2',
				userId: 'user2',
				userName: 'Anderson García',
				date: '3 nov 2025',
				content:
					'Muy útil, aunque le faltarían algunos ejemplos más avanzados.',
			},
			{
				id: 'c3',
				userId: 'user3',
				userName: 'Laura Alejandra Venegas',
				date: '1 nov 2025',
				content: '¡Gracias por compartir! Los diagramas están muy claros.',
			},
		],
	},
	{
		id: '2',
		title: 'Estructuras de datos - Teoría y práctica',
		author: 'Ing. Carlos Martínez',
		subject: 'Programación',
		semester: '4to Semestre',
		fileType: 'PDF',
		date: '3 nov 2025',
		rating: 4.9,
		ratingsCount: 203,
		downloads: 1891,
		comments: 67,
		description:
			'Documento completo sobre estructuras de datos con implementaciones en Python y Java.',
		commentsList: [
			{
				id: 'c4',
				userId: 'user4',
				userName: 'Juana Lozano',
				date: '4 nov 2025',
				content: 'Muy buena explicación de árboles binarios.',
			},
			{
				id: 'c5',
				userId: 'user5',
				userName: 'Sofia Rodríguez',
				date: '2 nov 2025',
				content: 'Los ejemplos en Java son muy claros, gracias.',
			},
		],
	},

	{
		id: '3',
		title: 'Cálculo Diferencial e Integral',
		author: 'Dr. Roberto Sánchez',
		subject: 'Matemáticas',
		semester: '1er Semestre',
		fileType: 'PDF',
		date: '15 sep 2025',
		rating: 4.7,
		ratingsCount: 156,
		downloads: 1245,
		comments: 45,
		description:
			'Libro completo de cálculo con ejercicios resueltos y teoría avanzada.',
		commentsList: [
			{
				id: 'c6',
				userId: 'user6',
				userName: 'Christian Romero',
				date: '18 oct 2025',
				content:
					'Los ejercicios propuestos me ayudaron a entender mejor las integrales.',
			},
			{
				id: 'c7',
				userId: 'user7',
				userName: 'María Fernanda',
				date: '20 oct 2025',
				content:
					'Faltaron algunos pasos en las soluciones, pero en general buen material.',
			},
		],
	},
	{
		id: '4',
		title: 'Álgebra Lineal - Ejercicios resueltos',
		author: 'Dra. María González',
		subject: 'Matemáticas',
		semester: '2do Semestre',
		fileType: 'PDF',
		date: '10 oct 2025',
		rating: 4.5,
		ratingsCount: 98,
		downloads: 876,
		comments: 32,
		description:
			'Colección de ejercicios de álgebra lineal con soluciones detalladas.',
		commentsList: [
			{
				id: 'c8',
				userId: 'user8',
				userName: 'Diego Herrera',
				date: '12 oct 2025',
				content: 'Muy buen compendio. Los pasos están bien explicados.',
			},
			{
				id: 'c9',
				userId: 'user9',
				userName: 'Valeria Suárez',
				date: '11 oct 2025',
				content: 'Ideal para practicar antes del parcial de álgebra lineal.',
			},
		],
	},
	{
		id: '5',
		title: 'Leyes de Newton y Movimiento',
		author: 'Fís. Jorge Ramírez',
		subject: 'Física',
		semester: '3er Semestre',
		fileType: 'PDF',
		date: '5 nov 2025',
		rating: 4.6,
		ratingsCount: 134,
		downloads: 987,
		comments: 28,
		description:
			'Presentación sobre las leyes de Newton con animaciones y ejemplos.',
		commentsList: [
			{
				id: 'c10',
				userId: 'user10',
				userName: 'Juana lozano',
				date: '6 nov 2025',
				content: 'Las animaciones hacen más claro el concepto de fuerza.',
			},
			{
				id: 'c11',
				userId: 'user11',
				userName: 'Fernando Ruiz',
				date: '7 nov 2025',
				content: 'Sería genial tener más ejercicios resueltos paso a paso.',
			},
		],
	},
	{
		id: '6',
		title: 'Tabla Periódica Interactiva',
		author: 'Q.F.B. Laura Mendoza',
		subject: 'Química',
		semester: '1er Semestre',
		fileType: 'PDF',
		date: '25 ago 2025',
		rating: 4.4,
		ratingsCount: 87,
		downloads: 654,
		comments: 19,
		description:
			'Tabla periódica en alta resolución con información detallada de cada elemento.',
		commentsList: [
			{
				id: 'c12',
				userId: 'user12',
				userName: 'Camila Ortiz',
				date: '1 sep 2025',
				content: 'Información precisa y muy útil para laboratorio.',
			},
			{
				id: 'c13',
				userId: 'user13',
				userName: 'Sergio Molina',
				date: '2 sep 2025',
				content:
					'Buen formato, ayuda a identificar propiedades de los elementos rápidamente.',
			},
		],
	},
	{
		id: '7',
		title: 'Experimentos de Laboratorio - Química Orgánica',
		author: 'Dr. Luis Torres',
		subject: 'Química',
		semester: '4to Semestre',
		fileType: 'PDF',
		date: '12 nov 2025',
		rating: 4.8,
		ratingsCount: 176,
		downloads: 1123,
		comments: 41,
		description:
			'Guía completa de experimentos de química orgánica en laboratorio.',
		commentsList: [
			{
				id: 'c14',
				userId: 'user14',
				userName: 'Paula Gómez',
				date: '13 nov 2025',
				content:
					'Excelente guía, las precauciones de seguridad están muy claras.',
			},
			{
				id: 'c15',
				userId: 'user15',
				userName: 'Ricardo Salas',
				date: '14 nov 2025',
				content:
					'Probé el experimento 4 y los resultados coincidieron con los descritos.',
			},
		],
	},
	{
		id: '8',
		title: 'Estadística Descriptiva e Inferencial',
		author: 'Mtro. Pedro Castillo',
		subject: 'Matemáticas',
		semester: '3er Semestre',
		fileType: 'PDF',
		date: '8 oct 2025',
		rating: 4.3,
		ratingsCount: 112,
		downloads: 765,
		comments: 23,
		description:
			'Guía completa de estadística con ejemplos prácticos y casos de estudio.',
		commentsList: [
			{
				id: 'c16',
				userId: 'user16',
				userName: 'Lucía Fernández',
				date: '9 oct 2025',
				content:
					'Muy buena explicación de procesos inferenciales con ejemplos reales.',
			},
			{
				id: 'c17',
				userId: 'user17',
				userName: 'Mateo Vargas',
				date: '10 oct 2025',
				content:
					'Los casos de estudio ayudan a entender la aplicación práctica de las técnicas.',
			},
		],
	},
	{
		id: '9',
		title: 'Introducción a Base de Datos SQL',
		author: 'Ing. Juan Pérez',
		subject: 'Programación',
		semester: '3er Semestre',
		fileType: 'PDF',
		date: '22 nov 2025',
		rating: 4.7,
		ratingsCount: 189,
		downloads: 1456,
		comments: 52,
		description:
			'Tutorial completo de SQL con ejercicios prácticos y consultas complejas.',
		commentsList: [
			{
				id: 'c18',
				userId: 'user18',
				userName: 'Isabella Cruz',
				date: '24 nov 2025',
				content: 'Las consultas JOIN están explicadas de manera muy clara.',
			},
			{
				id: 'c19',
				userId: 'user19',
				userName: 'Roberto Silva',
				date: '23 nov 2025',
				content: 'Perfecto para prepararse para bases de datos avanzadas.',
			},
		],
	},
	{
		id: '10',
		title: 'Mecánica de Fluidos - Fundamentos',
		author: 'Dr. Andrés Moreno',
		subject: 'Física',
		semester: '4to Semestre',
		fileType: 'PDF',
		date: '18 oct 2025',
		rating: 4.6,
		ratingsCount: 145,
		downloads: 892,
		comments: 31,
		description:
			'Tratado sobre principios de mecánica de fluidos con aplicaciones industriales.',
		commentsList: [
			{
				id: 'c20',
				userId: 'user20',
				userName: 'Claudia Reyes',
				date: '19 oct 2025',
				content:
					'Explicaciones detalladas y ejemplos de la vida real muy útiles.',
			},
			{
				id: 'c21',
				userId: 'user21',
				userName: 'Tomás López',
				date: '20 oct 2025',
				content: 'Recomendado para el laboratorio de física experimental.',
			},
		],
	},
	{
		id: '11',
		title: 'Química Inorgánica Aplicada',
		author: 'Dra. Beatriz Gómez',
		subject: 'Química',
		semester: '2do Semestre',
		fileType: 'PDF',
		date: '16 nov 2025',
		rating: 4.5,
		ratingsCount: 121,
		downloads: 734,
		comments: 28,
		description:
			'Apuntes sobre reacciones químicas inorgánicas con reacciones balanceadas.',
		commentsList: [
			{
				id: 'c22',
				userId: 'user22',
				userName: 'Natalia Soto',
				date: '17 nov 2025',
				content:
					'Las ecuaciones químicas están muy bien ordenadas y clasificadas.',
			},
			{
				id: 'c23',
				userId: 'user23',
				userName: 'Héctor Vega',
				date: '18 nov 2025',
				content: 'Muy práctico para entender la reactividad de los elementos.',
			},
		],
	},
	{
		id: '12',
		title: 'Cálculo Multivariable',
		author: 'Dr. Francisco Ruiz',
		subject: 'Matemáticas',
		semester: '4to Semestre',
		fileType: 'PDF',
		date: '5 nov 2025',
		rating: 4.8,
		ratingsCount: 198,
		downloads: 1567,
		comments: 61,
		description:
			'Teoría y ejercicios de funciones de varias variables con integrales múltiples.',
		commentsList: [
			{
				id: 'c24',
				userId: 'user24',
				userName: 'Diana Cortés',
				date: '6 nov 2025',
				content:
					'Finalmente entiendo las derivadas parciales con estos ejemplos.',
			},
			{
				id: 'c25',
				userId: 'user25',
				userName: 'Esteban Ruiz',
				date: '7 nov 2025',
				content: 'Los gráficos 3D ayudan muchísimo a visualizar los conceptos.',
			},
		],
	},
	{
		id: '13',
		title: 'Programación Orientada a Objetos',
		author: 'Ing. Patricia Castillo',
		subject: 'Programación',
		semester: '2do Semestre',
		fileType: 'PDF',
		date: '12 oct 2025',
		rating: 4.9,
		ratingsCount: 267,
		downloads: 2145,
		comments: 89,
		description:
			'Guía completa de POO con patrones de diseño y buenas prácticas.',
		commentsList: [
			{
				id: 'c26',
				userId: 'user26',
				userName: 'Gabriela Medina',
				date: '13 oct 2025',
				content:
					'Los patrones de diseño están explicados con claridad ejemplar.',
			},
			{
				id: 'c27',
				userId: 'user27',
				userName: 'Oscar Jiménez',
				date: '14 oct 2025',
				content: 'Material indispensable para cualquier programador.',
			},
		],
	},
	{
		id: '14',
		title: 'Óptica y Ondas',
		author: 'Fís. Mariana Gutierrez',
		subject: 'Física',
		semester: '1er Semestre',
		fileType: 'PDF',
		date: '28 sep 2025',
		rating: 4.4,
		ratingsCount: 103,
		downloads: 612,
		comments: 22,
		description:
			'Conceptos fundamentales de óptica geométrica y física ondulatoria.',
		commentsList: [
			{
				id: 'c28',
				userId: 'user28',
				userName: 'Vicente Aparicio',
				date: '29 sep 2025',
				content:
					'Las ilustraciones de fenómenos de interferencia son espectaculares.',
			},
			{
				id: 'c29',
				userId: 'user29',
				userName: 'Elena Pacheco',
				date: '30 sep 2025',
				content: 'Muy útil para entender la naturaleza de la luz y el sonido.',
			},
		],
	},
	{
		id: '15',
		title: 'Termodinámica y Calor',
		author: 'Dr. Miguel Sánchez',
		subject: 'Física',
		semester: '2do Semestre',
		fileType: 'PDF',
		date: '3 nov 2025',
		rating: 4.7,
		ratingsCount: 156,
		downloads: 1034,
		comments: 39,
		description:
			'Tratado sobre leyes de la termodinámica con aplicaciones prácticas.',
		commentsList: [
			{
				id: 'c30',
				userId: 'user30',
				userName: 'Roxana Jiménez',
				date: '4 nov 2025',
				content:
					'Ahora entiendo por qué los procesos irreversibles ocurren así.',
			},
			{
				id: 'c31',
				userId: 'user31',
				userName: 'Raúl Navarro',
				date: '5 nov 2025',
				content: 'Ejemplos prácticos con máquinas térmicas muy ilustrativos.',
			},
		],
	},
	{
		id: '16',
		title: 'Química Orgánica - Síntesis y Reacciones',
		author: 'Dra. Verónica López',
		subject: 'Química',
		semester: '3er Semestre',
		fileType: 'PDF',
		date: '25 oct 2025',
		rating: 4.6,
		ratingsCount: 167,
		downloads: 1289,
		comments: 47,
		description:
			'Manual de síntesis orgánica con mecanismos de reacción detallados.',
		commentsList: [
			{
				id: 'c32',
				userId: 'user32',
				userName: 'Sofía Navarro',
				date: '26 oct 2025',
				content: 'Los mecanismos están dibujados paso a paso, muy claro.',
			},
			{
				id: 'c33',
				userId: 'user33',
				userName: 'Javier Romero',
				date: '27 oct 2025',
				content:
					'Perfecto para la práctica de laboratorio de química orgánica.',
			},
		],
	},
	{
		id: '17',
		title: 'estructura de desglose de trabajo ',
		author: 'ing. Martha Edith ramirez',
		subject: 'Matemáticas',
		semester: '3er Semestre',
		fileType: 'PDF',
		date: '25 oct 2025',
		rating: 4.6,
		ratingsCount: 167,
		downloads: 1289,
		comments: 47,
		description: 'versión de generencia de proyectos ',
		commentsList: [
			{
				id: 'c32',
				userId: 'user32',
				userName: 'Sofía Navarro',
				date: '26 oct 2025',
				content: 'Todo está muy claroo',
			},
			{
				id: 'c33',
				userId: 'user33',
				userName: 'Javier Romero',
				date: '27 oct 2025',
				content: 'me gustó la explicación ',
			},
		],
	},
];
