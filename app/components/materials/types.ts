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
];
