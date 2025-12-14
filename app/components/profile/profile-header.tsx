interface ProfileHeaderProps {
	title: string;
	description: string;
}

export function ProfileHeader({ title, description }: ProfileHeaderProps) {
	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-3xl font-bold text-foreground">{title}</h1>
			<p className="text-default-500">{description}</p>
		</div>
	);
}
