import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import { AuthProvider } from './contexts/auth-context';

export const themes = [
	'brand',
	'light',
	'dark',
	'retroWave',
	'forestMist',
	'cyberpunk',
	'earth',
	'corporate',
	'theme2light',
	'theme2dark',
	'neonInk',
	'citrus',
	'oceanDepths',
	'solarEclipse',
] as const;

type Theme = (typeof themes)[number];

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

// Creamos el cliente de React Query una sola vez
// Este maneja todo el cache y estado de las peticiones HTTP
const queryClient = new QueryClient();

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used inside a ThemeContextProvider');
	}

	return context;
};

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [innerTheme, innerSetTheme] = useState<Theme>('brand');

	const setTheme = useCallback(
		(theme: Theme) => {
			if (document?.documentElement.classList.contains(innerTheme)) {
				document.documentElement.classList.remove(innerTheme);
			}

			document.documentElement.classList.add(theme);
			return innerSetTheme(theme);
		},
		[innerTheme],
	);

	const value: ThemeContextType = {
		theme: innerTheme,
		setTheme: setTheme,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

// Componente que envuelve toda la app con los providers necesarios
// React Query para manejo de datos y HeroUI para los componentes de interfaz
export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<ThemeContextProvider>
			<QueryClientProvider client={queryClient}>
				<HeroUIProvider>
					<AuthProvider>{children}</AuthProvider>
				</HeroUIProvider>
			</QueryClientProvider>
		</ThemeContextProvider>
	);
}
