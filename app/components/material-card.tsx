import { Button, Card, CardBody, CardFooter, Chip } from '@heroui/react';
import type React from 'react';

interface MaterialCardProps {
	title: string;
	subject: string;
	author: string;
	downloads: number;
	rating?: number;
	type: 'pdf' | 'doc' | 'video' | 'image' | 'other';
	uploadDate: string;
	onDownload?: () => void;
	onView?: () => void;
}

export function MaterialCard({
	title,
	subject,
	author,
	downloads,
	rating,
	type,
	uploadDate,
	onDownload,
	onView,
}: MaterialCardProps) {
	const typeIconsMap: Record<
		typeof type,
		{ svg: React.ReactNode; label: string; color: string }
	> = {
		pdf: {
			svg: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="PDF document"
				>
					<title>PDF document</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
					/>
				</svg>
			),
			label: 'PDF',
			color: 'danger',
		},
		doc: {
			svg: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="Document"
				>
					<title>Document</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			),
			label: 'DOC',
			color: 'primary',
		},
		video: {
			svg: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="Video"
				>
					<title>Video</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			),
			label: 'VIDEO',
			color: 'secondary',
		},
		image: {
			svg: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="Image"
				>
					<title>Image</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			),
			label: 'IMAGE',
			color: 'success',
		},
		other: {
			svg: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-label="File"
				>
					<title>File</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			),
			label: 'FILE',
			color: 'default',
		},
	};

	const typeData = typeIconsMap[type];
	const chipColor = typeData.color as
		| 'danger'
		| 'primary'
		| 'secondary'
		| 'success'
		| 'default';

	// Mapeo de colores para el círculo
	const circleColorMap: Record<string, string> = {
		danger: 'bg-danger',
		primary: 'bg-primary',
		secondary: 'bg-secondary',
		success: 'bg-success',
		default: 'bg-default',
	};

	const circleColor = circleColorMap[typeData.color] || 'bg-default';

	return (
		<Card className="w-full hover:shadow-lg transition-shadow border border-default-200">
			<CardBody className="gap-3">
				<div className="flex items-start gap-3">
					<div
						className={`p-3 rounded-full ${circleColor} flex items-center justify-center`}
					>
						<div className="text-white">{typeData.svg}</div>
					</div>
					<div className="flex-1">
						<p className="font-semibold text-sm line-clamp-1">{title}</p>
						<p className="text-small text-default-500">{subject}</p>
						<p className="text-tiny text-default-400 mt-1">Por {author}</p>
					</div>
					<Chip size="sm" variant="flat" color={chipColor}>
						{typeData.label}
					</Chip>
				</div>

				<div className="flex items-center gap-4 mt-2">
					{rating !== undefined && (
						<div className="flex items-center gap-1">
							<svg
								className="w-4 h-4 text-warning fill-current"
								viewBox="0 0 24 24"
								aria-label="Star rating"
							>
								<title>Star rating</title>
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
							</svg>
							<span className="text-small font-semibold">
								{rating.toFixed(1)}
							</span>
						</div>
					)}
					<div className="flex items-center gap-1">
						<svg
							className="w-4 h-4 text-default-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="Downloads"
						>
							<title>Downloads</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<span className="text-small text-default-500">{downloads}</span>
					</div>
					<span className="text-tiny text-default-400">{uploadDate}</span>
				</div>
			</CardBody>
			<CardFooter className="gap-2">
				{onView && (
					<Button
						size="sm"
						variant="bordered"
						color="primary"
						className="flex-1"
						onPress={onView}
					>
						Ver
					</Button>
				)}
				{onDownload && (
					<Button
						size="sm"
						color="primary"
						className="flex-1"
						onPress={onDownload}
						startContent={
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-label="Download"
							>
								<title>Download</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						}
					>
						Descargar
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
