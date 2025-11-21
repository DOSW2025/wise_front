import { Avatar } from '@heroui/react';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
	src?: string;
	name: string;
	isEditing: boolean;
	onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	preview?: string | null;
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

export function ProfileAvatar({
	src,
	name,
	isEditing,
	onImageChange,
	preview,
}: ProfileAvatarProps) {
	console.log('ProfileAvatar - src:', src);
	console.log('ProfileAvatar - preview:', preview);
	console.log('ProfileAvatar - name:', name);

	const avatarSrc = fixGoogleAvatarUrl(preview || src);
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
						crossOrigin: 'anonymous',
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
				{isEditing && (
					<label
						htmlFor="avatar-upload"
						className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
					>
						<Camera className="w-4 h-4" />
						<input
							id="avatar-upload"
							type="file"
							accept="image/*"
							onChange={onImageChange}
							className="hidden"
						/>
					</label>
				)}
			</div>
			{isEditing && (
				<div className="text-center">
					<p className="text-xs text-default-500">Tamaño máximo: 2MB</p>
					<p className="text-xs text-default-500">Formatos: JPG, PNG, GIF</p>
				</div>
			)}
		</div>
	);
}
