"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Code2,
  Search,
  Share2,
  Zap,
  ArrowRight,
  Sparkles,
  Github,
  Heart,
  Star,
  Terminal,
  Layers,
  Lock,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppIcon } from "@/components/app-icon";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/AuthModal";

export function LandingPage() {
  const [isStarHovered, setIsStarHovered] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenAuth = () => {
    if (loading) return;
    if (isAuthenticated) {
      router.push("/dashboard");
      return;
    }
    setAuthOpen(true);
  };

  const primaryCtaLabel = isAuthenticated
    ? "Go to Dashboard"
    : "Sign In / Sign Up";
  const headerCtaLabel = isAuthenticated
    ? "Go to Dashboard"
    : "Sign In / Sign Up";

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-accent to-blue-500 p-1.5 shadow-lg">
              <AppIcon className="h-full w-full text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary via-accent to-blue-500 bg-clip-text text-xl font-bold text-transparent">
              recode
            </span>
          </motion.div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              onClick={handleOpenAuth}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {headerCtaLabel}
            </Button>
          </div>
        </div>
      </header>

      <section className="relative container mx-auto px-6 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -bottom-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-medium text-transparent">
              Your personal snippet brain
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-5xl font-bold leading-tight text-balance sm:text-6xl lg:text-7xl"
          >
            <span className="text-foreground">Save. Search. </span>
            <span className="bg-gradient-to-r from-primary via-accent to-blue-500 bg-clip-text text-transparent">
              Share
            </span>
            <span className="text-foreground">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10 text-xl text-muted-foreground text-balance leading-relaxed"
          >
            The modern developer tool for managing your code snippets.
            <br />
            Lightning fast, beautifully designed, and built for productivity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mx-auto mt-12 max-w-3xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-background/60 via-card/70 to-background/60 p-6 shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:justify-between sm:gap-10">
              <div className="space-y-2 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Start in seconds
                </p>
                <h2 className="text-2xl font-semibold text-foreground">
                  Save your next snippet with zero friction.
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to capture snippets, tag them instantly, and find them
                  later with lightning-fast search.
                </p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:mt-0 sm:w-56">
                <Button
                  size="lg"
                  onClick={handleOpenAuth}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/80 via-accent/70 to-primary/80 px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-primary/40"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),transparent_65%)] opacity-40 dark:opacity-60 group-hover:opacity-60 dark:group-hover:opacity-80" />
                  <span className="relative flex items-center gap-2">
                    {primaryCtaLabel}
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToFeatures}
                  className="rounded-2xl border border-border/70 bg-background/70 text-sm font-semibold text-foreground transition hover:border-primary/30 dark:hover:border-primary/40 dark:hover:text-primary"
                >
                  Explore features
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-20"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
            >
              <div className="flex items-center gap-2 border-b border-border bg-gradient-to-r from-muted/80 to-muted/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-lg shadow-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-lg shadow-green-500/50" />
                <div className="ml-auto text-xs text-muted-foreground font-mono">
                  snippet.ts
                </div>
              </div>
              <div className="bg-card p-0 font-mono text-sm">
                <div className="grid grid-cols-[auto_1fr] border-t border-border/60">
                  {[
                    {
                      delay: 0.7,
                      indent: "",
                      content: (
                        <>
                          <span className="text-purple-400 italic">const</span>
                          <span className="text-foreground ml-2">snippet</span>
                          <span className="text-muted-foreground ml-2">=</span>
                          <span className="text-yellow-400 ml-2">{`{`}</span>
                        </>
                      ),
                    },
                    {
                      delay: 0.8,
                      indent: "  ",
                      content: (
                        <>
                          <span className="text-cyan-400">title</span>
                          <span className="text-muted-foreground ml-2">:</span>
                          <span className="text-green-400 ml-2">
                            "React Hook"
                          </span>
                          <span className="text-muted-foreground ml-1">,</span>
                        </>
                      ),
                    },
                    {
                      delay: 0.9,
                      indent: "  ",
                      content: (
                        <>
                          <span className="text-cyan-400">language</span>
                          <span className="text-muted-foreground ml-2">:</span>
                          <span className="text-green-400 ml-2">
                            "typescript"
                          </span>
                          <span className="text-muted-foreground ml-1">,</span>
                        </>
                      ),
                    },
                    {
                      delay: 1.0,
                      indent: "  ",
                      content: (
                        <>
                          <span className="text-cyan-400">tags</span>
                          <span className="text-muted-foreground ml-2">:</span>
                          <span className="text-muted-foreground ml-2">[</span>
                          <span className="text-green-400 ml-1">"hooks"</span>
                          <span className="text-muted-foreground ml-1">,</span>
                          <span className="text-green-400 ml-1">"react"</span>
                          <span className="text-muted-foreground ml-1">]</span>
                        </>
                      ),
                    },
                    {
                      delay: 1.1,
                      indent: "",
                      content: <span className="text-yellow-400">{`}`}</span>,
                    },
                  ].map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: line.delay }}
                      className="contents"
                    >
                      <div className="select-none border-r border-border/60 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
                        {index + 1}
                      </div>
                      <div className="flex items-center border-b border-border/60 px-4 py-2 last:border-b-0">
                        <span className="whitespace-pre text-muted-foreground/70">
                          {line.indent}
                        </span>
                        {line.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl"
        >
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need
          </h2>
          <p className="mb-12 text-center text-lg text-muted-foreground">
            Built for developers who value speed and simplicity
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Code2,
                title: "Save",
                description:
                  "Store your code snippets with syntax highlighting and tags for easy organization.",
                gradient: "from-purple-500/10 to-blue-500/10",
              },
              {
                icon: Search,
                title: "Search",
                description:
                  "Find any snippet instantly with powerful search and smart filtering.",
                gradient: "from-blue-500/10 to-cyan-500/10",
              },
              {
                icon: Share2,
                title: "Share",
                description:
                  "Export and share your snippets with your team or the community.",
                gradient: "from-cyan-500/10 to-purple-500/10",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 dark:hover:border-primary/50 dark:hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg"
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { icon: Terminal, text: "Syntax Highlighting" },
              { icon: Layers, text: "Smart Organization" },
              { icon: Lock, text: "Secure & Private" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-4 backdrop-blur-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/10 to-blue-500/10 p-12 text-center backdrop-blur-sm"
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          </div>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Zap className="mx-auto mb-4 h-12 w-12 text-primary" />
          </motion.div>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join developers who are already organizing their code better.
          </p>
          <Button
            size="lg"
            onClick={handleOpenAuth}
            className="gap-2 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
          >
            Start Free <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Made with{" "}
              <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />{" "}
              by developers, for developers
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Omar8345/recode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/30 dark:hover:border-primary/50 dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                onMouseEnter={() => mounted && setIsStarHovered(true)}
                onMouseLeave={() => mounted && setIsStarHovered(false)}
                suppressHydrationWarning
              >
                <Github className="h-4 w-4" />
                <span>Star on GitHub</span>
                <motion.div
                  animate={{
                    rotate: mounted && isStarHovered ? [0, -15, 15, -15, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Star
                    className={`h-4 w-4 transition-all duration-300 ${
                      mounted && isStarHovered
                        ? "fill-yellow-400 text-yellow-400"
                        : ""
                    }`}
                  />
                </motion.div>
              </a>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Powered by
                <a
                  href="https://appwrite.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
                  suppressHydrationWarning
                >
                  Appwrite
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthSuccess={(user) => {
          setAuthOpen(false);
          router.push("/dashboard");
        }}
      />
    </div>
  );
}
