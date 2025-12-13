import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/user.service';

export function useUsers(search = '', page = 1, limit = 100) {
	return useQuery({
		queryKey: ['users', search, page, limit],
		queryFn: () => getUsers({ search, page, limit }),
		staleTime: 5 * 60 * 1000,
	});
}
