// Tipos TypeScript para materiales
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
	},
];
