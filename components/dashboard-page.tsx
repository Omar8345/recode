"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type { Models } from "appwrite";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { SnippetCard } from "@/components/snippet-card";
import { AddSnippetModal } from "@/components/add-snippet-modal";
import { EditSnippetModal } from "@/components/edit-snippet-modal";
import { SnippetSearchDialog } from "@/components/snippet-search-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { appwriteDB } from "@/lib/appwrite";
import {
  normalizeSnippet,
  normalizeSnippetList,
  type Snippet,
  type SnippetPayload,
} from "@/lib/snippets";
import { detectLanguage } from "@/lib/syntax-highlighter";

interface DashboardPageProps {
  user: Models.User<Models.Preferences>;
}

export function DashboardPage({ user }: DashboardPageProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchSnippets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await appwriteDB.listSnippets();
      const items = normalizeSnippetList(
        response.rows as Array<Models.Row & Record<string, unknown>>
      );
      setSnippets(items);
    } catch (error) {
      toast({
        title: "Could not load snippets",
        description:
          error instanceof Error
            ? error.message
            : "Please check your Appwrite configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user.$id]);

  useEffect(() => {
    if (!user) return;
    fetchSnippets();
  }, [fetchSnippets, user]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifierPressed = event.metaKey || event.ctrlKey;
      if (isModifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const allTags = useMemo(() => {
    return Array.from(
      new Set(snippets.flatMap((snippet) => snippet.tags))
    ).sort((a, b) => a.localeCompare(b));
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    if (selectedTags.length === 0) {
      return snippets;
    }
    return snippets.filter((snippet) =>
      selectedTags.some((tag) => snippet.tags.includes(tag))
    );
  }, [snippets, selectedTags]);

  const handleAddSnippet = async (payload: SnippetPayload) => {
    try {
      setIsSaving(true);
      const response = await appwriteDB.createSnippet({
        ...payload,
        userId: user.$id,
      });
      const snippet = normalizeSnippet(response as Models.Row);
      setSnippets((prev) => [snippet, ...prev]);
      setIsModalOpen(false);
      toast({
        title: "Snippet saved",
        description: "Your code snippet has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Could not save snippet",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving your snippet.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    const existing = snippets.find((snippet) => snippet.id === id);

    try {
      await appwriteDB.deleteSnippet(id);
      setSnippets((prev) => prev.filter((snippet) => snippet.id !== id));
      toast({
        title: "Snippet deleted",
        description: existing
          ? `"${existing.title}" has been removed from your snippets.`
          : "The snippet has been removed.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Could not delete snippet",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while deleting the snippet.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsEditModalOpen(true);
  };

  const handleUpdateSnippet = async (id: string, payload: Omit<Snippet, "id" | "createdAt">) => {
    try {
      setIsEditing(true);
      const response = await appwriteDB.updateSnippet(id, payload);
      const updatedSnippet = normalizeSnippet(response as Models.Row);
      setSnippets((prev) => prev.map((snippet) => 
        snippet.id === id ? updatedSnippet : snippet
      ));
      setIsEditModalOpen(false);
      setEditingSnippet(null);
      toast({
        title: "Snippet updated",
        description: "Your code snippet has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Could not update snippet",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while updating your snippet.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsEditing(false);
    }
  };

  const handleSelectFromSearch = (snippetId: string) => {
    setIsSearchOpen(false);
    requestAnimationFrame(() => {
      const element = document.getElementById(`snippet-${snippetId}`);
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      window.scrollBy({ top: -80, behavior: "smooth" });
      element.classList.add(
        "ring-2",
        "ring-primary",
        "ring-offset-2",
        "ring-offset-background"
      );
      setTimeout(() => {
        element.classList.remove(
          "ring-2",
          "ring-primary",
          "ring-offset-2",
          "ring-offset-background"
        );
      }, 1200);
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const handleExportSnippets = () => {
    try {
      const payload = snippets.map((snippet) => ({
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags,
      }));

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      anchor.download = `recode-snippets-${timestamp}.json`;
      anchor.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Snippets exported",
        description: "Your snippets were downloaded as JSON.",
      });
    } catch (error) {
      console.error("Export failed", error);
      toast({
        title: "Export failed",
        description: "We couldn't create the export file.",
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const raw = await file.text();
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        throw new Error("JSON must contain an array of snippets.");
      }

      const normalized = parsed
        .map((item) => {
          if (typeof item !== "object" || item === null) return null;

          const title = typeof item.title === "string" ? item.title.trim() : "";
          const code = typeof item.code === "string" ? item.code : "";
          let language =
            typeof item.language === "string" && item.language.trim()
              ? item.language.trim()
              : "";
          const tags = Array.isArray(item.tags)
            ? item.tags
                .map((tag: unknown) =>
                  typeof tag === "string" ? tag.trim() : String(tag)
                )
                .filter((tag: string) => tag.length > 0)
            : [];

          if (!title || !code) return null;

          if (!language) {
            language = detectLanguage(code);
          }

          return { title, code, language, tags };
        })
        .filter(
          (
            item
          ): item is {
            title: string;
            code: string;
            language: string;
            tags: string[];
          } => Boolean(item)
        );

      if (normalized.length === 0) {
        throw new Error("No valid snippets were found in the file.");
      }

      for (const snippet of normalized) {
        await appwriteDB.createSnippet({
          ...snippet,
          userId: user.$id,
        });
      }

      toast({
        title: "Import complete",
        description: `Imported ${normalized.length} snippet${
          normalized.length === 1 ? "" : "s"
        } successfully.`,
      });

      await fetchSnippets();
    } catch (error) {
      console.error("Import failed", error);
      toast({
        title: "Import failed",
        description:
          error instanceof Error
            ? error.message
            : "We could not import that file.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const handleDeleteAll = async () => {
    if (snippets.length === 0 || isClearing) return;
    setShowClearDialog(true);
  };

  const confirmDeleteAll = async () => {
    if (snippets.length === 0 || isClearing) return;

    try {
      setIsClearing(true);
      await Promise.all(
        snippets.map((snippet) => appwriteDB.deleteSnippet(snippet.id))
      );
      setSnippets([]);
      toast({
        title: "Snippets cleared",
        description: "All snippets have been permanently removed.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Failed to delete all snippets", error);
      toast({
        title: "Delete failed",
        description:
          error instanceof Error
            ? error.message
            : "We couldn't remove your snippets.",
        variant: "destructive",
      });
      await fetchSnippets();
    } finally {
      setIsClearing(false);
      setShowClearDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Loading your snippets…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        showSearch
        onSearchTrigger={() => setIsSearchOpen(true)}
      />

      <div className="flex">
        <Sidebar
          tags={allTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClearFilters={() => setSelectedTags([])}
          snippetCount={snippets.length}
        />

        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto max-w-7xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  All Snippets
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {`${filteredSnippets.length} snippet${
                    filteredSnippets.length === 1 ? "" : "s"
                  } found`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary dark:text-foreground dark:bg-card/80 dark:hover:border-primary/60 dark:hover:bg-primary/10 dark:hover:text-primary"
                  onClick={handleExportSnippets}
                  disabled={snippets.length === 0}
                >
                  <Download className="h-4 w-4" /> Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary dark:text-foreground dark:bg-card/80 dark:hover:border-primary/60 dark:hover:bg-primary/10 dark:hover:text-primary"
                  onClick={handleImportClick}
                  disabled={isImporting}
                >
                  <Upload className="h-4 w-4" />
                  {isImporting ? "Importing…" : "Import"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center gap-2 rounded-full border border-destructive/60 bg-background px-3 text-xs font-semibold uppercase tracking-wide text-destructive transition hover:border-destructive hover:bg-destructive/15 hover:text-destructive dark:text-destructive dark:bg-card/80 dark:hover:bg-destructive/20"
                  onClick={handleDeleteAll}
                  disabled={snippets.length === 0 || isClearing}
                >
                  <Trash2 className="h-4 w-4" />
                  {isClearing ? "Clearing…" : "Delete All"}
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredSnippets.length === 0 ? (
                <motion.div
                  key={snippets.length === 0 ? "empty" : "no-results"}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card"
                >
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-foreground">
                      {snippets.length === 0
                        ? "No snippets yet"
                        : "No snippets match your filters"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {snippets.length === 0
                        ? "Click “Add snippet” to save your first code snippet."
                        : "Try adjusting or clearing your selected tags."}
                    </p>
                    {snippets.length > 0 && selectedTags.length > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTags([])}
                      >
                        Clear filters
                      </Button>
                    ) : null}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredSnippets.map((snippet, index) => (
                    <motion.div
                      key={snippet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <SnippetCard
                        snippet={snippet}
                        onDelete={handleDeleteSnippet}
                        onEdit={handleEditSnippet}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="group fixed bottom-6 right-6"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg transition-all hover:scale-110 hover:shadow-xl cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add snippet</span>
        </Button>
      </motion.div>

      <AddSnippetModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={handleAddSnippet}
        isSubmitting={isSaving}
      />

      <EditSnippetModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onEdit={handleUpdateSnippet}
        snippet={editingSnippet}
        isSubmitting={isEditing}
      />

      <SnippetSearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        snippets={snippets}
        onSelectSnippet={handleSelectFromSearch}
        filtersActive={selectedTags.length > 0}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFile}
      />
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all snippets?</AlertDialogTitle>
            <AlertDialogDescription>
              This action permanently removes all of your snippets. You can
              export a backup first if you want to keep a copy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isClearing}
              onClick={confirmDeleteAll}
            >
              {isClearing ? "Deleting…" : "Delete Everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
