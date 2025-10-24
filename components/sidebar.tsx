"use client";

import { Filter, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters?: () => void;
  snippetCount?: number;
}

export function Sidebar({
  tags,
  selectedTags,
  onToggleTag,
  onClearFilters,
  snippetCount = 0,
}: SidebarProps) {
  return (
    <aside className="hidden w-64 border-r border-border bg-card lg:block">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-6">
          <div className="mb-6 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Overview
              </h3>
            </div>
            <p className="text-2xl font-bold text-foreground">{snippetCount}</p>
            <p className="text-xs text-muted-foreground">Total Snippets</p>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Filters</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tags
              </h3>
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={cn(
                          "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors",
                          isSelected
                            ? "border-primary/40 bg-primary/15 text-primary"
                            : "border-border/60 bg-card/80 text-muted-foreground hover:bg-muted/40",
                        )}
                        onClick={() => onToggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedTags.length > 0 && onClearFilters && (
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-full border border-border/80 bg-background/90 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-background/80"
                onClick={onClearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
