// Shared helpers to reduce duplication and cognitive complexity in community views

export type ReplyKind = 'text' | 'image' | 'link';

// Returns a short description for a forum id (demo content for frontend-only flows)
export function getForumDescription(forumId: string): string {
	switch (forumId) {
		case 'forum-1':
			return 'Tema de integrales y técnicas útiles para practicar.';
		case 'forum-2':
			return 'Buenas prácticas con estructuras de datos en Python.';
		default:
			return 'Conversación abierta entre estudiantes y tutores.';
	}
}

// Build a reply payload-like object description used by UI; frontend-only
export function buildReplyPayload(
	kind: ReplyKind,
	data: { text?: string; imageName?: string; url?: string },
) {
	if (kind === 'text') {
		return { type: 'text' as const, text: (data.text || '').trim() };
	}
	if (kind === 'image') {
		return { type: 'image' as const, imageName: data.imageName || 'archivo' };
	}
	return { type: 'link' as const, url: (data.url || '').trim() };
}
