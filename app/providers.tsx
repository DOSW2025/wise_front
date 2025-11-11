import { HeroUIProvider } from '@heroui/react';
import type { ReactNode } from 'react';

function AppProviders({ children }: { children: ReactNode }) {
	return <HeroUIProvider>{children}</HeroUIProvider>;
}

export { AppProviders };
