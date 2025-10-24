import { useMemo, useState } from "react";
import type { Models } from "appwrite";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Code2, Calendar, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileStats {
  snippetCount: number;
  languageCount: number;
  tagCount: number;
}

interface ProfilePageProps {
  user: Models.User<Models.Preferences>;
  stats: ProfileStats;
  onLogout: () => Promise<void>;
  loadingStats?: boolean;
}

export function ProfilePage({
  user,
  stats,
  onLogout,
  loadingStats = false,
}: ProfilePageProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const displayName = user.name || user.email || "User";
  const avatarUrl =
    typeof (user.prefs as any)?.avatarUrl === "string"
      ? (user.prefs as any).avatarUrl
      : undefined;

  const joinedDate = useMemo(() => {
    const created = new Date(user.$createdAt);
    if (isNaN(created.getTime())) return "Unknown";
    return created.toLocaleString("en-US", { month: "long", year: "numeric" });
  }, [user.$createdAt]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      toast({
        title: "Logout failed",
        description:
          error instanceof Error
            ? error.message
            : "We could not sign you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} showSearch={false} />

      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="mb-8 text-3xl font-bold text-foreground">Profile</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your personal details and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {displayName}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <span className="text-foreground">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    <span className="text-foreground">Joined {joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Code2 className="h-4 w-4" />
                    <span className="text-foreground">
                      {stats.snippetCount} snippet
                      {stats.snippetCount === 1 ? "" : "s"} saved
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-border/70 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Your activity overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "Total Snippets",
                      value: stats.snippetCount,
                    },
                    {
                      label: "Languages Used",
                      value: stats.languageCount,
                    },
                    {
                      label: "Unique Tags",
                      value: stats.tagCount,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border/60 bg-gradient-to-br from-background/80 via-card/75 to-background/70 p-5 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </p>
                      {loadingStats ? (
                        <div className="mt-4 h-7 w-16 animate-pulse rounded-md bg-muted" />
                      ) : (
                        <p className="mt-3 text-3xl font-semibold text-foreground">
                          {item.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="gap-2"
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
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
                      Logging out…
                    </motion.div>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
