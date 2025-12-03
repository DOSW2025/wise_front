// Helper compartido para descripciones de foros (reduce duplicación en student/tutor)
export function getForumDescription(forumId: string): string {
	switch (forumId) {
		case 'forum-1':
			return 'Tengo dudas sobre cuándo aplicar sustitución trigonométrica en integrales. ¿Alguien puede explicar los casos más comunes?';
		case 'forum-2':
			return '¿Qué estructura de datos recomiendan usar para implementar un sistema de caché? Estoy considerando usar diccionarios pero me gustaría conocer otras opciones.';
		case 'forum-3':
			return 'En problemas con fricción, ¿cómo identifico correctamente todas las fuerzas que actúan sobre un cuerpo?';
		default:
			return '¿Alguien tiene tips para balancear ecuaciones redox más fácilmente? Siempre me confundo con los números de oxidación.';
	}
}

export type ReplyKind = 'text' | 'image' | 'link';

// Construye payload de respuesta (reduce ternarios anidados)
export function buildReplyPayload(
	replyType: ReplyKind,
	forumId: string,
	textReply: string,
	imageFile: File | null,
	linkUrl: string,
):
	| { forumId: string; type: 'text'; text: string }
	| { forumId: string; type: 'image'; imageName?: string }
	| { forumId: string; type: 'link'; url: string } {
	if (replyType === 'text') {
		return { forumId, type: 'text', text: textReply.trim() };
	}
	if (replyType === 'image') {
		return { forumId, type: 'image', imageName: imageFile?.name };
	}
	return { forumId, type: 'link', url: linkUrl.trim() };
}
