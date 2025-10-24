"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Models } from "appwrite";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { SnippetCard } from "@/components/snippet-card";
import { AddSnippetModal } from "@/components/add-snippet-modal";
import { SnippetSearchDialog } from "@/components/snippet-search-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { appwriteDB } from "@/lib/appwrite";
import {
  normalizeSnippet,
  normalizeSnippetList,
  type Snippet,
  type SnippetPayload,
} from "@/lib/snippets";

interface DashboardPageProps {
  user: Models.User<Models.Preferences>;
}

export function DashboardPage({ user }: DashboardPageProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchSnippets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await appwriteDB.listSnippets();
      const items = normalizeSnippetList(
        response.rows as Array<Models.Row & Record<string, unknown>>,
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
      new Set(snippets.flatMap((snippet) => snippet.tags)),
    ).sort((a, b) => a.localeCompare(b));
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    if (selectedTags.length === 0) {
      return snippets;
    }
    return snippets.filter((snippet) =>
      selectedTags.some((tag) => snippet.tags.includes(tag)),
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
        "ring-offset-background",
      );
      setTimeout(() => {
        element.classList.remove(
          "ring-2",
          "ring-primary",
          "ring-offset-2",
          "ring-offset-background",
        );
      }, 1200);
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
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
            </div>

            <AnimatePresence mode="wait">
              {filteredSnippets.length === 0 ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card"
                >
                  <div className="text-center text-muted-foreground">
                    Fetching your snippets...
                  </div>
                </motion.div>
              ) : filteredSnippets.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card"
                >
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground">
                      No snippets yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Click “Add snippet” to save your first code snippet.
                    </p>
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

      <SnippetSearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        snippets={snippets}
        onSelectSnippet={handleSelectFromSearch}
        filtersActive={selectedTags.length > 0}
      />
    </div>
  );
}
