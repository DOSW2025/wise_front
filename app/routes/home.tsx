import { Button } from '@heroui/react';
import { FingerprintIcon } from 'lucide-react';

export function meta() {
	return [
		{ title: 'New React Router App' },
		{ name: 'description', content: 'Welcome to React Router!' },
	];
}

export default function Home() {
	return (
		<div className="w-dvw h-dvh flex items-center justify-center flex-col gap-8">
			<h1>Hello DOSW</h1>
			<Button
				color="primary"
				startContent={
					<span className="text-primary-foreground">
						<FingerprintIcon size={24} />
					</span>
				}
			>
				Hero Button
			</Button>
		</div>
	);
}
