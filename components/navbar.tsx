"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Command, Search, User } from "lucide-react";
import type { Models } from "appwrite";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppIcon } from "@/components/app-icon";

interface NavbarProps {
  user?: Models.User<Models.Preferences> | null;
  showSearch?: boolean;
  onSearchTrigger?: () => void;
}

export function Navbar({ user, showSearch, onSearchTrigger }: NavbarProps) {
  const shouldShowSearch = Boolean(
    (showSearch ?? (user && onSearchTrigger)) && onSearchTrigger,
  );

  const isMac =
    typeof window !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");

  const avatarUrl = useMemo(() => {
    if (!user?.prefs) return undefined;
    const prefs = user.prefs as Record<string, unknown>;
    return typeof prefs.avatarUrl === "string" ? prefs.avatarUrl : undefined;
  }, [user?.prefs]);

  const displayName = user?.name || user?.email || "User";
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center px-6">
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 transition-opacity hover:opacity-80 cursor-pointer shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent p-1.5">
            <AppIcon className="h-full w-full text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">recode</span>
        </Link>

        {shouldShowSearch && (
          <div className="flex-1 flex justify-center px-6">
            <Button
              type="button"
              variant="outline"
              onClick={onSearchTrigger}
              className="w-full max-w-md justify-start gap-3 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground hover:bg-card/80"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 truncate text-left">
                Search your snippets
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono font-medium">
                  {isMac ? <Command className="h-3 w-3" /> : "Ctrl"}
                </kbd>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono font-medium">
                  K
                </kbd>
              </span>
            </Button>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3 shrink-0">
          <ThemeToggle />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                      {displayInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
