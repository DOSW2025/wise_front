import { Button } from '@heroui/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface PageHeaderProps {
	title: string;
	description?: string;
	action?: {
		label: string;
		to?: string;
		onClick?: () => void;
		color?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
		variant?: 'solid' | 'bordered' | 'light' | 'flat';
	};
	breadcrumbs?: Array<{ label: string; to?: string }>;
	children?: ReactNode;
}

export function PageHeader({
	title,
	description,
	action,
	breadcrumbs,
	children,
}: PageHeaderProps) {
	return (
		<div className="flex flex-col gap-4 mb-6">
			{breadcrumbs && breadcrumbs.length > 0 && (
				<nav className="flex items-center gap-2 text-sm">
					{breadcrumbs.map((crumb) => (
						<div key={crumb.label} className="flex items-center gap-2">
							{breadcrumbs.indexOf(crumb) > 0 && (
								<svg
									className="w-4 h-4 text-default-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Separator"
								>
									<title>Separator</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							)}
							{crumb.to ? (
								<Link
									to={crumb.to}
									className="text-default-500 hover:text-primary transition-colors"
								>
									{crumb.label}
								</Link>
							) : (
								<span className="text-foreground font-medium">
									{crumb.label}
								</span>
							)}
						</div>
					))}
				</nav>
			)}

			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="text-3xl font-bold text-foreground">{title}</h1>
					{description && (
						<p className="text-default-500 text-base">{description}</p>
					)}
				</div>

				{action && (
					<div className="flex-shrink-0">
						{action.to ? (
							<Button
								as={Link}
								to={action.to}
								color={action.color || 'primary'}
								variant={action.variant || 'solid'}
							>
								{action.label}
							</Button>
						) : (
							<Button
								onClick={action.onClick}
								color={action.color || 'primary'}
								variant={action.variant || 'solid'}
							>
								{action.label}
							</Button>
						)}
					</div>
				)}
			</div>

			{children}
		</div>
	);
}
