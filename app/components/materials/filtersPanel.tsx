import { Card, CardBody, Select, SelectItem } from '@heroui/react';
import { fileTypes, semesters, subjects } from './types';

interface FiltersPanelProps {
	isOpen: boolean;
	selectedSubject: string;
	selectedSemester: string;
	selectedFileType: string;
	onSubjectChange: (subject: string) => void;
	onSemesterChange: (semester: string) => void;
	onFileTypeChange: (fileType: string) => void;
}

export default function FiltersPanel({
	isOpen,
	selectedSubject,
	selectedSemester,
	selectedFileType,
	onSubjectChange,
	onSemesterChange,
	onFileTypeChange,
}: FiltersPanelProps) {
	if (!isOpen) return null;

	return (
		<Card>
			<CardBody className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Select
						label="Materia"
						selectedKeys={[selectedSubject]}
						onSelectionChange={(keys) =>
							onSubjectChange(Array.from(keys)[0] as string)
						}
					>
						{subjects.map((subject) => (
							<SelectItem key={subject}>{subject}</SelectItem>
						))}
					</Select>

					<Select
						label="Tipo de archivo"
						selectedKeys={[selectedFileType]}
						onSelectionChange={(keys) =>
							onFileTypeChange(Array.from(keys)[0] as string)
						}
					>
						{fileTypes.map((type) => (
							<SelectItem key={type}>{type}</SelectItem>
						))}
					</Select>

					<Select
						label="Semestre"
						selectedKeys={[selectedSemester]}
						onSelectionChange={(keys) =>
							onSemesterChange(Array.from(keys)[0] as string)
						}
					>
						{semesters.map((semester) => (
							<SelectItem key={semester}>{semester}</SelectItem>
						))}
					</Select>
				</div>
			</CardBody>
		</Card>
	);
}
