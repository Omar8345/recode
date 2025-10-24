"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Code2, Tag, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Snippet } from "@/lib/snippets";

interface SnippetSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippets: Snippet[];
  onSelectSnippet: (snippetId: string) => void;
  filtersActive?: boolean;
}

const MAX_RESULTS = 12;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export function SnippetSearchDialog({
  open,
  onOpenChange,
  snippets,
  onSelectSnippet,
  filtersActive = false,
}: SnippetSearchDialogProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (snippets.length === 0) return [];
    if (!normalizedQuery) {
      return snippets.slice(0, MAX_RESULTS);
    }

    return snippets
      .map((snippet) => {
        const haystack = [
          snippet.title,
          snippet.language,
          snippet.tags.join(" "),
          snippet.code,
        ]
          .join(" ")
          .toLowerCase();
        const index = haystack.indexOf(normalizedQuery);
        if (index === -1) {
          return null;
        }
        const titleIndex = snippet.title.toLowerCase().indexOf(normalizedQuery);
        const score = titleIndex >= 0 ? titleIndex : index + 100;
        return { snippet, score };
      })
      .filter(
        (entry): entry is { snippet: Snippet; score: number } => entry !== null,
      )
      .sort((a, b) => a.score - b.score)
      .slice(0, MAX_RESULTS)
      .map((entry) => entry.snippet);
  }, [normalizedQuery, snippets]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const handleSelect = (snippetId: string) => {
    onSelectSnippet(snippetId);
    onOpenChange(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && results.length > 0) {
      event.preventDefault();
      handleSelect(results[0].id);
    }
  };

  const description = snippets.length
    ? `Search ${snippets.length} snippet${snippets.length === 1 ? "" : "s"}${
        filtersActive ? " (filtered)" : ""
      }.`
    : "Save a snippet to start searching.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden border border-border/60 bg-card/95 p-0 shadow-2xl sm:rounded-3xl">
        <DialogHeader className="space-y-2 px-6 pt-6">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Quick search
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, language, tag, or code..."
              className="h-12 rounded-xl border-border/60 bg-background/85 pl-10 text-sm"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press Enter to jump to the best match. Results don’t change the
            dashboard until you toggle filters.
          </p>
        </div>

        <ScrollArea className="max-h-[24rem] border-t border-border/60">
          <div className="divide-y divide-border/60">
            {results.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                {snippets.length
                  ? "No snippets match that search."
                  : "No snippets available yet."}
              </div>
            ) : (
              results.map((snippet) => {
                const preview = snippet.code
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line.length > 0)
                  .slice(0, 2)
                  .join(" · ");

                return (
                  <button
                    key={snippet.id}
                    type="button"
                    onClick={() => handleSelect(snippet.id)}
                    className="flex w-full items-start gap-4 bg-card/0 px-6 py-4 text-left transition hover:bg-muted/60 focus:bg-muted/70 focus:outline-none"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {snippet.title}
                        </p>
                        <Badge className="rounded-full border-border/50 bg-muted/70 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {snippet.language}
                        </Badge>
                      </div>
                      {preview && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {preview}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(snippet.createdAt)}
                        </span>
                        {snippet.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                        {snippet.tags.length > 3 && (
                          <span className="text-muted-foreground/80">
                            +{snippet.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
