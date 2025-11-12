import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

export type UserRole = 'student' | 'tutor' | 'admin';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	avatar?: string;
}

interface AuthContextType {
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const login = (userData: User) => {
		setUser(userData);
		// TODO: Guardar en localStorage o sessionStorage
		// TODO: Configurar token de autenticación
	};

	const logout = () => {
		setUser(null);
		// TODO: Limpiar localStorage
		// TODO: Invalidar token
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				isAuthenticated: !!user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
