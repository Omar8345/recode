"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, Sparkles } from "lucide-react";
import { detectLanguage } from "@/lib/syntax-highlighter";
import type { Snippet } from "@/lib/snippets";
import { toast } from "./ui/use-toast";

interface EditSnippetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (
    id: string,
    snippet: Omit<Snippet, "id" | "createdAt">
  ) => Promise<void> | void;
  snippet: Snippet | null;
  isSubmitting?: boolean;
}

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "jsx",
  "tsx",
  "html",
  "css",
  "sql",
  "bash",
  "json",
  "yaml",
];

export function EditSnippetModal({
  open,
  onOpenChange,
  onEdit,
  snippet,
  isSubmitting = false,
}: EditSnippetModalProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [tags, setTags] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);
  const [languageTouched, setLanguageTouched] = useState(false);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setCode(snippet.code);
      setLanguage(snippet.language);
      setTags(snippet.tags.join(", "));
      setLanguageTouched(true);
      setAutoDetected(false);
    }
  }, [snippet]);

  const parsedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    [tags]
  );

  const lineCount = useMemo(
    () => (code.trim().length > 0 ? code.trim().split(/\r?\n/).length : 0),
    [code]
  );

  useEffect(() => {
    const sample = code.trim();
    if (!sample || sample.length < 6) return;
    if (languageTouched) return;
    const detected = detectLanguage(sample);
    if (detected && detected !== language) {
      setLanguage(detected);
      setAutoDetected(true);
    }
  }, [code, language, languageTouched]);

  useEffect(() => {
    if (!autoDetected) return;
    const timeout = window.setTimeout(() => setAutoDetected(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [autoDetected]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    setLanguageTouched(true);
    setAutoDetected(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !code.trim() || !snippet) {
      return;
    }

    try {
      await onEdit(snippet.id, {
        title: title.trim(),
        code: code.trim(),
        language: language.trim(),
        tags: parsedTags,
      });

      onOpenChange(false);
    } catch (error) {
        toast({
            title: "Update failed",
            description:
                error instanceof Error
                    ? error.message
                    : "We could not update your snippet. Please try again.",
            variant: "destructive",
        });
        
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  if (!snippet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl overflow-hidden border border-border/60 bg-card/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-4xl lg:max-w-5xl sm:rounded-[28px]">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader className="space-y-4 px-6 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/40"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                >
                  <Edit3 className="h-6 w-6 text-primary-foreground" />
                </motion.div>
                <div>
                  <DialogTitle className="text-2xl font-semibold text-foreground">
                    Edit snippet
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Update your code snippet and organize it better.
                  </DialogDescription>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Smart capture
              </div>
            </div>
          </DialogHeader>

          <div className="mt-2 space-y-6 border-t border-border/40 bg-card/90 px-6 py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Debounce utility hook"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="rounded-xl border border-border/60 bg-background/80 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Give it a clear name so you can find it later.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="language" className="text-sm font-medium">
                    Language
                  </Label>
                  {autoDetected && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary"
                    >
                      <Sparkles className="h-3 w-3" />
                      Auto
                    </motion.span>
                  )}
                </div>
                <Select
                  value={language}
                  onValueChange={handleLanguageChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="rounded-xl border border-border/60 bg-background/80 text-sm">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  {[
                    "javascript",
                    "typescript",
                    "python",
                    "go",
                    "rust",
                    "sql",
                  ].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                        language === quick
                          ? "border-primary/50 bg-primary/15 text-primary"
                          : "border-border/60 bg-card/80 text-muted-foreground hover:bg-muted/40"
                      }`}
                      onClick={() => handleLanguageChange(quick)}
                      disabled={isSubmitting}
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags (optional)
              </Label>
              <Input
                id="tags"
                placeholder="Comma separated, e.g. ui, hooks, api"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={isSubmitting}
                className="rounded-xl border border-border/60 bg-background/80 text-sm"
              />
              {parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {parsedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="rounded-full border border-border/60 bg-muted/40 px-3 py-0.5 text-xs font-medium uppercase tracking-wide"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Tags speed up filtering and search.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border/60 bg-background/95 p-5 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                <span>Code</span>
                <span>
                  {lineCount
                    ? `${lineCount} line${lineCount === 1 ? "" : "s"}`
                    : "Paste or type your code"}
                </span>
              </div>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                rows={12}
                className="min-h-[200px] max-h-[260px] overflow-auto rounded-2xl border border-border/40 bg-card/90 font-mono text-sm leading-relaxed focus-visible:ring-0"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (languageTouched && e.target.value.trim().length === 0) {
                    setLanguageTouched(false);
                  }
                }}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter className="gap-3 border-t border-border/60 bg-card/90 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-full border border-border/60 bg-transparent px-5 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 rounded-full px-5 text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                  />
                  Updating…
                </motion.div>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  Update snippet
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
