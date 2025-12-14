import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatsService } from '../services/chats.service';

export function useChats() {
	return useQuery({
		queryKey: ['chats'],
		queryFn: () => chatsService.getAllGroups(),
		staleTime: 1 * 60 * 1000,
	});
}

export function useChatMessages(groupId: string | undefined) {
	return useQuery({
		queryKey: ['chat-messages', groupId],
		queryFn: () => {
			if (!groupId) return [];
			return chatsService.getGroupMessages(groupId);
		},
		enabled: !!groupId,
		staleTime: 30 * 1000,
	});
}

export function useCreateChat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ nombre, emails }: { nombre: string; emails: string[] }) =>
			chatsService.createGroup(nombre, emails),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		},
	});
}

export function useSendMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			groupId,
			contenido,
		}: {
			groupId: string;
			contenido: string;
		}) => chatsService.sendMessage(groupId, contenido),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['chat-messages', variables.groupId],
			});
		},
	});
}

export function useDeleteChat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (groupId: string) => chatsService.deleteGroup(groupId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['chats'] });
		},
	});
}
