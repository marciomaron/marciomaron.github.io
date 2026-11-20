export function isCalendarDate(value: unknown): boolean;
export function toIsoDate(value: unknown): unknown;
export function slugFromFilename(entry: string): string;
export function todayInBrasilia(now?: Date): string;
export function selectPublished<
  T extends { id: string; data: { data: string; rascunho?: boolean } },
>(posts: T[], options?: { includeAll?: boolean }): T[];
export function statusOf(post: {
  data: { data: string; rascunho?: boolean };
}): "rascunho" | "agendado" | "publicado";
