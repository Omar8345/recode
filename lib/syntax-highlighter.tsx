"use client";

// Palenight theme colors for syntax highlighting
export const palenightTheme = {
  background: "oklch(0.16 0.015 264)",
  foreground: "oklch(0.85 0.02 264)",
  comment: "oklch(0.48 0.02 264)",
  keyword: "oklch(0.75 0.18 300)", // Purple
  string: "oklch(0.75 0.12 140)", // Green
  number: "oklch(0.75 0.15 50)", // Orange
  function: "oklch(0.75 0.15 240)", // Blue
  variable: "oklch(0.85 0.02 264)", // Light gray
  operator: "oklch(0.75 0.18 300)", // Purple
  punctuation: "oklch(0.65 0.02 264)", // Gray
  className: "oklch(0.75 0.15 60)", // Yellow
  tag: "oklch(0.75 0.18 10)", // Red
  attribute: "oklch(0.75 0.15 60)", // Yellow
  lineNumber: "oklch(0.38 0.02 264)", // Darker gray
};

type LanguageScore = {
  regexes: Array<RegExp>;
  keywords?: string[];
};

const LANGUAGE_PATTERNS: Record<string, LanguageScore> = {
  typescript: {
    regexes: [
      /interface\s+\w+/m,
      /type\s+\w+\s*=/m,
      /:\s*(string|number|boolean|unknown|never|any)/m,
      /\bimplements\b/m,
      /<\w+[,\w\s]*>/m,
    ],
    keywords: ["interface", "type", "enum", "readonly"],
  },
  tsx: {
    regexes: [/<[A-Z][^>]*>/m, /:\s*React\./m, /Props\s*=\s*/m],
    keywords: ["tsx", "ReactNode"],
  },
  javascript: {
    regexes: [
      /function\s+\w+/m,
      /const\s+\w+\s*=\s*/m,
      /=>\s*\{/m,
      /console\.log/m,
      /module\.exports/m,
    ],
    keywords: ["require", "document", "window", "Promise"],
  },
  jsx: {
    regexes: [/<\w+[^>]*>/m, /className=/m, /onClick=/m, /use(State|Effect)/m],
  },
  python: {
    regexes: [
      /def\s+\w+\s*\(/m,
      /class\s+\w+/m,
      /import\s+[\w.]+/m,
      /print\(/m,
      /if\s+__name__\s*==/m,
    ],
    keywords: ["self", "None", "async", "await", "lambda", "yield"],
  },
  go: {
    regexes: [
      /package\s+\w+/m,
      /func\s+\w+\s*\(/m,
      /fmt\.Print/m,
      /go\s+func/m,
    ],
    keywords: ["defer", "chan", "struct"],
  },
  rust: {
    regexes: [/fn\s+\w+\s*\(/m, /let\s+mut\s+/m, /impl\s+/m, /pub\s+fn/m],
    keywords: ["crate", "match", "Vec", "Result"],
  },
  java: {
    regexes: [
      /package\s+[\w.]+;/m,
      /public\s+(class|interface)/m,
      /System\.out\.print/m,
      /@Override/m,
    ],
    keywords: ["implements", "extends", "throws"],
  },
  csharp: {
    regexes: [
      /using\s+[\w.]+;/m,
      /namespace\s+[\w.]+/m,
      /public\s+(class|interface)/m,
      /async\s+Task/m,
    ],
    keywords: ["Console.WriteLine", "IEnumerable"],
  },
  cpp: {
    regexes: [/#include\s+<[^>]+>/m, /std::/m, /template\s*<[^>]+>/m],
    keywords: ["cout", "nullptr", "constexpr"],
  },
  php: {
    regexes: [/<\?php/m, /echo\s+\$/m, /function\s+\w+\(/m, /->/m],
    keywords: ["use", "namespace", "array"],
  },
  ruby: {
    regexes: [/def\s+\w+/m, /class\s+\w+/m, /puts\s+/m, /end\s*$/m],
    keywords: ["module", "include", "self"],
  },
  swift: {
    regexes: [
      /import\s+Swift/m,
      /func\s+\w+\(/m,
      /let\s+\w+\s*=/m,
      /struct\s+\w+/m,
    ],
    keywords: ["guard", "defer", "mutating"],
  },
  kotlin: {
    regexes: [/fun\s+\w+\(/m, /val\s+\w+/m, /var\s+\w+/m, /data\s+class/m],
    keywords: ["companion", "suspend", "sealed"],
  },
  sql: {
    regexes: [
      /SELECT\s+[\s\S]+?FROM/im,
      /INSERT\s+INTO/im,
      /CREATE\s+TABLE/im,
      /WHERE\s+/im,
    ],
  },
  html: {
    regexes: [/<!(DOCTYPE|--)/i, /<html/i, /<head>/i, /<body>/i, /<div/i],
  },
  css: {
    regexes: [/^[^{]+\{[^}]+\}/m, /@media\s+/m, /:[a-z-]+\s*\{/m],
  },
  json: {
    regexes: [/^\s*\{/m, /"\w+"\s*:/m, /^\s*\[/m],
  },
  yaml: {
    regexes: [/^\s*\w+:\s+/m, /^-\s+\w+/m, /:\s*\|/m],
  },
  markdown: {
    regexes: [/^#\s+/m, /^\*\s+/m, /```[a-zA-Z]*/m],
  },
  bash: {
    regexes: [
      /^#!\/bin\/(bash|sh)/m,
      /^\s*echo\s+/m,
      /\$\{?\w+\}?/m,
      /\|\s*grep/m,
    ],
  },
};

export function detectLanguage(code: string): string {
  const sample = code.slice(0, 4000);
  const lowerSample = sample.toLowerCase();

  let bestLanguage = "javascript";
  let bestScore = 0;

  for (const [language, { regexes, keywords }] of Object.entries(
    LANGUAGE_PATTERNS,
  )) {
    let score = 0;

    regexes.forEach((regex) => {
      if (regex.test(sample)) {
        score += 3;
      }
    });

    if (keywords?.length) {
      const keywordHits = keywords.filter((keyword) =>
        lowerSample.includes(keyword.toLowerCase()),
      ).length;
      score += keywordHits * 1.2;
    }

    if (language === "json" && /^\s*[\[{]/.test(sample)) {
      score += 1.5;
    }

    if (language === "yaml" && /^\s*\w+:\s+/m.test(sample)) {
      score += 1.5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestLanguage = language;
    }
  }

  if (bestScore === 0) {
    if (sample.includes("<") && sample.includes(">")) {
      return "html";
    }
    if (sample.includes("def ") || sample.includes("import ")) {
      return "python";
    }
    if (sample.includes("function") || sample.includes("const ")) {
      return "javascript";
    }
  }

  return bestLanguage;
}

// Simple syntax highlighter with Palenight theme
export function highlightCode(code: string, language: string): string {
  const keywords = {
    javascript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "import",
      "export",
      "from",
      "async",
      "await",
      "try",
      "catch",
      "new",
      "this",
    ],
    typescript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "import",
      "export",
      "from",
      "async",
      "await",
      "try",
      "catch",
      "interface",
      "type",
      "enum",
      "new",
      "this",
    ],
    python: [
      "def",
      "class",
      "import",
      "from",
      "return",
      "if",
      "else",
      "elif",
      "for",
      "while",
      "try",
      "except",
      "with",
      "as",
      "lambda",
      "yield",
    ],
    jsx: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "import",
      "export",
      "from",
      "class",
      "extends",
    ],
    tsx: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "import",
      "export",
      "from",
      "interface",
      "type",
      "class",
      "extends",
    ],
  };

  const langKeywords =
    keywords[language as keyof typeof keywords] || keywords.javascript;

  let highlighted = code
    // Comments
    .replace(
      /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
      `<span style="color: ${palenightTheme.comment}; font-style: italic;">$1</span>`,
    )
    // Strings
    .replace(
      /(['"`])((?:\\.|(?!\1).)*?)\1/g,
      `<span style="color: ${palenightTheme.string}; font-style: italic;">$&</span>`,
    )
    // Numbers
    .replace(
      /\b(\d+\.?\d*)\b/g,
      `<span style="color: ${palenightTheme.number};">$1</span>`,
    );

  // Keywords
  langKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      `<span style="color: ${palenightTheme.keyword}; font-style: italic;">$1</span>`,
    );
  });

  return highlighted;
}
