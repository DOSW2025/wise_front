import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { UserResponse } from '~/lib/api/auth';
import { authService } from '~/lib/api/auth';

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
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función auxiliar para mapear el rol del backend al tipo del frontend
function mapRoleToUserRole(rol: string): UserRole {
	const roleLower = rol.toLowerCase();
	if (roleLower === 'estudiante') return 'student';
	if (roleLower === 'docente' || roleLower === 'tutor') return 'tutor';
	if (roleLower === 'administrador' || roleLower === 'admin') return 'admin';
	return 'student'; // Default
}

// Función auxiliar para convertir UserResponse a User
function convertUserResponseToUser(userResponse: UserResponse): User {
	return {
		id: userResponse.id,
		name: `${userResponse.nombre} ${userResponse.apellido}`,
		email: userResponse.email,
		role: mapRoleToUserRole(userResponse.rol),
		avatar: userResponse.avatarUrl || undefined,
	};
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Load user from storage on initialization
	// Storage operations use secure utility functions (see ~/lib/utils/storage.ts)
	// that follow OWASP best practices for client-side storage
	useEffect(() => {
		const loadUser = () => {
			try {
				const storedUser = authService.getUser();
				if (storedUser) {
					const convertedUser = convertUserResponseToUser(storedUser);
					setUser(convertedUser);
				}
			} catch (error) {
				console.error('Error al cargar usuario:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadUser();
	}, []);

	const login = (userData: User) => {
		setUser(userData);
		// Authentication data is stored securely by authService
	};

	const logout = () => {
		setUser(null);
		authService.logout();
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				isAuthenticated: !!user,
				isLoading,
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
