import { Avatar } from '@heroui/react';

interface ProfileAvatarProps {
	src?: string;
	name: string;
}

// Helper function to fix Google avatar URLs
function fixGoogleAvatarUrl(url: string | undefined): string | undefined {
	if (!url) return undefined;

	// If it's a Google profile picture URL
	if (url.includes('googleusercontent.com')) {
		// Remove existing size parameters and add a larger size
		const baseUrl = url.split('=')[0];
		return `${baseUrl}=s200-c`; // s200-c = 200px square, cropped
	}

	return url;
}

export function ProfileAvatar({ src, name }: ProfileAvatarProps) {
	console.log('ProfileAvatar - src:', src);
	console.log('ProfileAvatar - name:', name);

	const avatarSrc = fixGoogleAvatarUrl(src);
	console.log('Final avatar source (fixed):', avatarSrc);

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative">
				<Avatar
					src={avatarSrc}
					name={name}
					size="lg"
					color="primary"
					isBordered
					showFallback
					className="w-32 h-32 text-large"
					imgProps={{
						referrerPolicy: 'no-referrer',
						onError: (e) => {
							console.error('ProfileAvatar: Error loading image:', avatarSrc);
							console.log('Trying without size parameter...');
							// Try loading without the size parameter
							const originalUrl = src?.split('=')[0];
							if (originalUrl && e.currentTarget.src !== originalUrl) {
								e.currentTarget.src = originalUrl;
							} else {
								e.currentTarget.style.display = 'none';
							}
						},
						onLoad: () => {
							console.log('ProfileAvatar: Image loaded successfully');
						},
					}}
					classNames={{
						img: 'object-cover',
					}}
				/>
			</div>
		</div>
	);
}
