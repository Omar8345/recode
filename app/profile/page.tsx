"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Models } from "appwrite";
import { ProfilePage } from "@/components/profile-page";
import { useAuth } from "@/hooks/use-auth";
import { appwriteDB } from "@/lib/appwrite";
import { normalizeSnippetList, type Snippet } from "@/lib/snippets";

interface ProfileStats {
  snippetCount: number;
  languageCount: number;
  tagCount: number;
}

const emptyStats: ProfileStats = {
  snippetCount: 0,
  languageCount: 0,
  tagCount: 0,
};

const computeStats = (snippets: Snippet[]): ProfileStats => {
  const languages = new Set<string>();
  const tags = new Set<string>();

  snippets.forEach((snippet) => {
    if (snippet.language) {
      languages.add(snippet.language.toLowerCase());
    }
    snippet.tags.forEach((tag) => tags.add(tag.toLowerCase()));
  });

  return {
    snippetCount: snippets.length,
    languageCount: languages.size,
    tagCount: tags.size,
  };
};

export default function Profile() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ProfileStats>(emptyStats);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const response = await appwriteDB.listSnippets();
        const rows = normalizeSnippetList(
          response.rows as Array<Models.Row & Record<string, unknown>>,
        );
        setStats(computeStats(rows));
      } catch {
        setStats(emptyStats);
      } finally {
        setStatsLoading(false);
      }
    };

    void loadStats();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col gap-3">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-border border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Preparing your profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProfilePage
      user={user}
      stats={stats}
      onLogout={logout}
      loadingStats={statsLoading}
    />
  );
}
