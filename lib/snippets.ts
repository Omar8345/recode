import type { Models } from "appwrite";

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
}

export type SnippetPayload = Omit<Snippet, "id" | "createdAt">;

export const normalizeSnippet = (
  row: Models.Row & Record<string, unknown>,
): Snippet => {
  const tags = Array.isArray(row.tags) ? (row.tags as string[]) : [];
  const createdAt =
    typeof row.$createdAt === "string"
      ? row.$createdAt
      : new Date().toISOString();

  return {
    id: row.$id,
    title: (row.title as string) ?? "",
    code: (row.code as string) ?? "",
    language: (row.language as string) ?? "plaintext",
    tags,
    createdAt,
  };
};

export const normalizeSnippetList = (
  rows: Array<Models.Row & Record<string, unknown>>,
): Snippet[] => rows.map((row) => normalizeSnippet(row));
