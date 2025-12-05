import { Card, CardBody, Select, SelectItem } from '@heroui/react';
import { semesters, subjects } from './types';

interface FiltersPanelProps {
	isOpen: boolean;
	selectedSubject: string;
	selectedSemester: string;
	onSubjectChange: (subject: string) => void;
	onSemesterChange: (semester: string) => void;
}

export default function FiltersPanel({
	isOpen,
	selectedSubject,
	selectedSemester,
	onSubjectChange,
	onSemesterChange,
}: FiltersPanelProps) {
	if (!isOpen) return null;

	return (
		<Card>
			<CardBody className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
