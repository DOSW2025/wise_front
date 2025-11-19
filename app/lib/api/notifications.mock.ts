// Local mock data for student dashboard notifications.
// This module is intentionally simple so it can be replaced
// later with a Supabase-backed implementation.

export type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: string; // ISO date string
  // When integrating with Supabase, you will typically have an
  // additional `read` column in the table. For now we track
  // read state only on the client side.
};

// Example notifications shown in the student dashboard mockup.
export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Entrega de Proyecto – Ingeniería de Sistemas",
    description: "Tu profesor ha publicado una nueva entrega.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 h
  },
  {
    id: "2",
    title: "Nuevo anuncio del curso",
    description: "El profesor ha publicado un comunicado.",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // Hace 6 h
  },
  {
    id: "3",
    title: "Actualización de calificaciones",
    description: "Se han actualizado tus notas.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Ayer
  },
];

// Simulated fetch function. React Query will use this to obtain
// notification data. Replace the body of this function when you
// connect to Supabase.
export async function fetchNotifications(): Promise<Notification[]> {
  // Example for Supabase:
  // const { data, error } = await supabase
  //   .from("notifications")
  //   .select("id, title, description, created_at")
  //   .eq("user_id", currentUserId);
  // if (error) throw error;
  // return data?.map((row) => ({
  //   id: row.id,
  //   title: row.title,
  //   description: row.description,
  //   createdAt: row.created_at,
  // })) ?? [];

  // For now we simply resolve the local mock data.
  return Promise.resolve(mockNotifications);
}
