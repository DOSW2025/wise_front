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
	tags?: string[]; // Tags del material
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

// Datos de ejemplo eliminados - Se utiliza la API en tiempo real
