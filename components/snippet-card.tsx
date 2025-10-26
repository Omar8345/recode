"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Trash2, Calendar, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { Snippet } from "@/lib/snippets";
import { ScrollArea } from "@/components/ui/scroll-area";

const COMMON_KEYWORDS = [
  "const",
  "let",
  "var",
  "fn",
  "function",
  "return",
  "import",
  "from",
  "export",
  "default",
  "async",
  "await",
  "class",
  "if",
  "else",
  "for",
  "while",
  "switch",
  "case",
  "break",
  "continue",
  "new",
  "try",
  "catch",
  "finally",
  "throw",
  "extends",
  "implements",
  "interface",
  "type",
  "enum",
  "public",
  "private",
  "protected",
  "static",
  "void",
  "true",
  "false",
  "null",
  "undefined",
  "this",
  "super",
  "yield",
  "in",
  "of",
  "with",
  "as",
  "not",
  "and",
  "or",
];

const LANGUAGE_KEYWORDS: Record<string, string[]> = {
  javascript: [
    "console",
    "window",
    "document",
    "setTimeout",
    "Promise",
    "Math",
    "JSON",
  ],
  typescript: ["interface", "implements", "readonly", "declare", "namespace"],
  python: [
    "def",
    "lambda",
    "None",
    "self",
    "pass",
    "raise",
    "yield",
    "with",
    "as",
    "async",
    "await",
  ],
  java: [
    "package",
    "implements",
    "extends",
    "boolean",
    "int",
    "long",
    "float",
    "double",
    "String",
    "throws",
  ],
  go: [
    "package",
    "import",
    "func",
    "defer",
    "go",
    "chan",
    "map",
    "struct",
    "interface",
    "type",
    "var",
    "range",
    "select",
  ],
  rust: [
    "let",
    "mut",
    "impl",
    "trait",
    "pub",
    "crate",
    "match",
    "enum",
    "struct",
    "use",
    "mod",
  ],
  cpp: [
    "#include",
    "namespace",
    "std",
    "auto",
    "constexpr",
    "template",
    "typename",
    "virtual",
    "override",
    "delete",
  ],
  csharp: [
    "using",
    "namespace",
    "async",
    "await",
    "partial",
    "sealed",
    "override",
    "public",
    "private",
    "protected",
  ],
  php: [
    "<?php",
    "echo",
    "function",
    "use",
    "namespace",
    "class",
    "array",
    "foreach",
  ],
  ruby: [
    "def",
    "end",
    "class",
    "module",
    "include",
    "extend",
    "self",
    "begin",
    "rescue",
    "ensure",
    "yield",
    "unless",
    "elsif",
  ],
  swift: [
    "import",
    "let",
    "var",
    "func",
    "struct",
    "class",
    "enum",
    "protocol",
    "extension",
    "guard",
    "defer",
    "mutating",
  ],
  kotlin: [
    "fun",
    "val",
    "var",
    "object",
    "companion",
    "when",
    "sealed",
    "data",
    "inline",
    "suspend",
  ],
  sql: [
    "select",
    "from",
    "where",
    "insert",
    "update",
    "delete",
    "join",
    "left",
    "right",
    "inner",
    "outer",
    "group",
    "by",
    "order",
    "limit",
    "values",
    "into",
    "create",
    "table",
    "primary",
    "key",
    "not",
    "null",
  ],
  css: [
    "display",
    "flex",
    "grid",
    "color",
    "background",
    "margin",
    "padding",
    "font",
    "border",
    "var",
    "calc",
  ],
  html: [
    "<div",
    "<span",
    "<section",
    "<header",
    "<footer",
    "<main",
    "<button",
    "<input",
    "</div>",
    "</span>",
    "</section>",
    "</button>",
  ],
  bash: [
    "#!/bin/bash",
    "echo",
    "fi",
    "done",
    "then",
    "elif",
    "function",
    "for",
    "do",
    "if",
    "case",
    "esac",
  ],
  python3: [],
};

const BUILTIN_IDENTIFIERS: Record<string, string[]> = {
  javascript: [
    "console",
    "Math",
    "JSON",
    "Number",
    "String",
    "Array",
    "Promise",
    "document",
    "window",
  ],
  typescript: ["console", "Math", "JSON", "Record", "Partial"],
  python: [
    "print",
    "range",
    "len",
    "dict",
    "list",
    "set",
    "int",
    "float",
    "str",
  ],
  java: ["System", "String", "List", "Map"],
  go: ["fmt", "len", "cap", "make", "append"],
  rust: ["println", "format", "Vec"],
  sql: ["count", "sum", "avg", "min", "max"],
};

const TOKEN_REGEX =
  /(\s+|\/\/.*$|--.*$|#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b0x[0-9a-fA-F]+\b|\b\d+\.\d+\b|\b\d+\b|==|!=|<=|>=|=>|&&|\|\||[(){}\[\].,;:+\-*/=<>!&|^%]|[A-Za-z_][\w-]*)/g;

const punctuation = new Set([
  ".",
  ",",
  ";",
  ":",
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  "=>",
]);

function getKeywordSet(language: string) {
  const keywords = new Set<string>();
  COMMON_KEYWORDS.forEach((keyword) => keywords.add(keyword.toLowerCase()));
  const extras = LANGUAGE_KEYWORDS[language.toLowerCase()] ?? [];
  extras.forEach((keyword) => keywords.add(keyword.toLowerCase()));
  return keywords;
}

function getBuiltins(language: string) {
  return new Set(
    (BUILTIN_IDENTIFIERS[language.toLowerCase()] ?? []).map((item) =>
      item.toLowerCase()
    )
  );
}

function renderHighlightedLine(
  line: string,
  keywordSet: Set<string>,
  builtinSet: Set<string>,
  language: string
) {
  const tokens = line.match(TOKEN_REGEX) ?? [line];
  const languageLower = language.toLowerCase();

  return tokens.map((token, index) => {
    if (token.length === 0) {
      return (
        <span key={index} className="text-foreground/90">
          {"\u200B"}
        </span>
      );
    }

    if (/^\s+$/.test(token)) {
      return <span key={index}>{token}</span>;
    }

    if (token.startsWith("//") || token.startsWith("--")) {
      return (
        <span key={index} className="text-muted-foreground/60">
          {token}
        </span>
      );
    }

    if (token.startsWith("#") && languageLower === "python") {
      return (
        <span key={index} className="text-muted-foreground/60">
          {token}
        </span>
      );
    }

    if (
      token.startsWith('"') ||
      token.startsWith("'") ||
      token.startsWith("`")
    ) {
      return (
        <span key={index} className="text-emerald-400">
          {token}
        </span>
      );
    }

    if (/^\d/.test(token)) {
      return (
        <span key={index} className="text-orange-400">
          {token}
        </span>
      );
    }

    const tokenLower = token.toLowerCase();

    if (keywordSet.has(tokenLower)) {
      return (
        <span key={index} className="text-sky-400">
          {token}
        </span>
      );
    }

    if (builtinSet.has(tokenLower)) {
      return (
        <span key={index} className="text-indigo-400">
          {token}
        </span>
      );
    }

    const nextToken = tokens[index + 1];
    if (
      nextToken === "(" &&
      /^[A-Za-z_][\w-]*$/.test(token) &&
      !keywordSet.has(tokenLower)
    ) {
      return (
        <span key={index} className="text-purple-400">
          {token}
        </span>
      );
    }

    if (punctuation.has(token)) {
      return (
        <span key={index} className="text-muted-foreground/80">
          {token}
        </span>
      );
    }

    if (token === "=" || token === "==" || token === "===") {
      return (
        <span key={index} className="text-pink-400">
          {token}
        </span>
      );
    }

    if (
      languageLower === "html" ||
      languageLower === "jsx" ||
      languageLower === "tsx"
    ) {
      if (token.startsWith("<") || token.endsWith(">")) {
        return (
          <span key={index} className="text-sky-400">
            {token}
          </span>
        );
      }
    }

    return (
      <span key={index} className="text-foreground/90">
        {token}
      </span>
    );
  });
}

interface SnippetCardProps {
  snippet: Snippet;
  onDelete: (id: string) => Promise<void>;
}

export function SnippetCard({ snippet, onDelete }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const languageKey = (snippet.language ?? "").toLowerCase();
  const keywordSet = useMemo(() => getKeywordSet(languageKey), [languageKey]);
  const builtinSet = useMemo(() => getBuiltins(languageKey), [languageKey]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Could not copy snippet",
        description:
          error instanceof Error
            ? error.message
            : "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(snippet.id);
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Could not delete snippet",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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

  const codeLines = snippet.code.split("\n");
  const MAX_LINES = 10;
  const shouldScroll = codeLines.length > MAX_LINES;

  return (
    <Card
      id={`snippet-${snippet.id}`}
      className="group flex h-full flex-col overflow-hidden border border-border bg-card shadow-sm transition hover:shadow-md"
    >
      <CardHeader className="flex flex-col gap-3 border-b border-border/70 bg-card/95 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {snippet.title}
            </h3>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-border/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
          >
            {snippet.language}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(snippet.createdAt)}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>
            {codeLines.length} line{codeLines.length === 1 ? "" : "s"}
          </span>
          {snippet.tags.length > 0 && (
            <>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span>
                {snippet.tags.length} tag
                {snippet.tags.length === 1 ? "" : "s"}
              </span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 px-5 py-4">
        <div className="rounded-2xl border border-border/60 bg-background/95 p-4 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
            <span>Preview</span>
            <span className="font-mono lowercase text-muted-foreground">
              {snippet.language}
            </span>
          </div>
          <ScrollArea
            className={`mt-3 rounded-xl border border-border/40 bg-card/95 pr-1 ${
              shouldScroll ? "h-[240px]" : "max-h-[240px]"
            }`}
          >
            <div className="space-y-1 px-3 py-4 font-mono text-xs leading-relaxed">
              {codeLines.map((line, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="w-6 select-none text-right text-[11px] text-muted-foreground/60">
                    {index + 1}
                  </span>
                  <code className="flex-1 whitespace-pre-wrap text-foreground/90">
                    {renderHighlightedLine(
                      line,
                      keywordSet,
                      builtinSet,
                      snippet.language
                    )}
                  </code>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {snippet.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-border/70 bg-card/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-end gap-2 border-t border-border/70 bg-card/90 px-5 py-3">
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-full border border-border/70 bg-background px-3 text-xs transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary dark:bg-card/80"
          onClick={handleCopy}
        >
          <motion.span
            initial={false}
            animate={{ scale: copied ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.25 }}
            className="flex"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </motion.span>
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 rounded-full border border-destructive/60 bg-background px-3 text-xs font-medium text-destructive transition-colors hover:border-destructive hover:bg-destructive/15 hover:text-destructive dark:text-destructive dark:bg-card/80 dark:hover:bg-destructive/20"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{snippet.title}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                  />
                  Deleting...
                </motion.div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
