import { Button } from '@heroui/react';

export function meta() {
	return [
		{ title: 'New React Router App' },
		{ name: 'description', content: 'Welcome to React Router!' },
	];
}

export default function Home() {
	return (
		<>
			<h1>Hello DOSW</h1>
			<Button color="primary">Hero Button</Button>
		</>
	);
}
