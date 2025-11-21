export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface SendMessagePayload {
  messages: Array<Pick<ChatMessage, 'role' | 'content'>>;
}

/**
 * Core service responsible for talking to the AI model.
 *
 * Azure endpoint and credentials will be configured later via
 * environment variables. For now this returns a mocked response
 * so the UI can be fully implemented and tested.
 */
export async function sendMessageToAssistant(
  payload: SendMessagePayload,
): Promise<ChatMessage> {
  const hasAzureConfig =
    typeof import.meta !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Boolean((import.meta as any).env?.VITE_AZURE_OPENAI_ENDPOINT);

  if (!hasAzureConfig) {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        'Hola, soy el asistente de ECIWISE+. Esta es una respuesta simulada mientras conectamos el modelo en Azure.',
      createdAt: new Date().toISOString(),
    };
  }

  // TODO: Replace this block with the real Azure call once
  // the endpoint, deployment name and API key are available.
  // Example:
  // const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT as string;
  // const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY as string;
  // const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT as string;
  // const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-05-01-preview`;
  // const response = await fetch(url, { ... });

  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content:
      'La conexión con Azure aún no está configurada en este entorno, pero la UI del chat está lista.',
    createdAt: new Date().toISOString(),
  };
}
