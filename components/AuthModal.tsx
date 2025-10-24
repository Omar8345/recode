import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { appwriteAuth } from "@/lib/appwrite";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (user: any) => void;
}

export function AuthModal({
  open,
  onOpenChange,
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (mode === "signup") {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
      });
    }
  };

  const isPasswordValid =
    mode === "signin" || Object.values(passwordValidation).every(Boolean);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuth = async (isSignUp: boolean) => {
    if (
      !isEmailValid ||
      (mode === "signup" && (!name.trim() || !isPasswordValid))
    ) {
      setError("Please fill in all fields correctly");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isSignUp) {
        await appwriteAuth.signUpWithEmail(email, password, name);
        setSuccess("Verification email sent. Please check your inbox.");
        return;
      } else {
        await appwriteAuth.loginWithEmail(email, password);
      }
      const user = await appwriteAuth.getCurrentUser();
      onAuthSuccess(user);
      onOpenChange(false);
      setEmail("");
      setPassword("");
      setName("");
      setShowPassword(false);
    } catch (err: any) {
      if (isSignUp && err?.message?.includes("already exists")) {
        setError("Email is already registered. Please sign in.");
      } else {
        setError(
          err?.message || (isSignUp ? "Sign up failed" : "Sign in failed"),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!isEmailValid) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await appwriteAuth.forgotPassword(email);
      setSuccess("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      setError(err?.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({
    isValid,
    text,
  }: {
    isValid: boolean;
    text: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-xs"
    >
      {isValid ? (
        <CheckCircle className="h-3 w-3 text-emerald-500" />
      ) : (
        <XCircle className="h-3 w-3 text-muted-foreground/40" />
      )}
      <span
        className={
          isValid
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground/70"
        }
      >
        {text}
      </span>
    </motion.div>
  );

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
    setError(null);
    setSuccess(null);
    setPasswordValidation({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
    });
  };

  const handleModeChange = (newMode: "signin" | "signup" | "forgot") => {
    resetForm();
    setMode(newMode);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6">
          <DialogHeader className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
            >
              {mode === "signin" ? (
                <Lock className="h-6 w-6 text-primary" />
              ) : mode === "signup" ? (
                <User className="h-6 w-6 text-primary" />
              ) : (
                <Mail className="h-6 w-6 text-primary" />
              )}
            </motion.div>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogTitle className="text-xl font-semibold">
                {mode === "signin"
                  ? "Welcome back"
                  : mode === "signup"
                    ? "Create account"
                    : "Reset password"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to your account to continue"
                  : mode === "signup"
                    ? "Join us today and start saving your code snippets"
                    : "Enter your email to receive a password reset link"}
              </p>
            </motion.div>
          </DialogHeader>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {mode === "forgot" ? (
                <motion.form
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                  }}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="forgot-email"
                      className="text-sm font-medium"
                    >
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
                      >
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-sm text-emerald-600 dark:text-emerald-400"
                      >
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !isEmailValid}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : null}
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>

                  <div className="mt-4 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleModeChange("signin")}
                      disabled={loading}
                      className="text-sm"
                    >
                      <ArrowLeft className="mr-2 h-3 w-3" />
                      Back to sign in
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAuth(mode === "signup");
                  }}
                >
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          disabled={loading}
                          className="pl-10"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          mode === "signin"
                            ? "Enter your password"
                            : "Create a password"
                        }
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {mode === "signup" && password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3"
                    >
                      <h4 className="text-xs font-medium text-muted-foreground">
                        Password requirements:
                      </h4>
                      <div className="space-y-1">
                        <ValidationItem
                          isValid={passwordValidation.length}
                          text="At least 8 characters"
                        />
                        <ValidationItem
                          isValid={passwordValidation.uppercase}
                          text="One uppercase letter"
                        />
                        <ValidationItem
                          isValid={passwordValidation.lowercase}
                          text="One lowercase letter"
                        />
                        <ValidationItem
                          isValid={passwordValidation.number}
                          text="One number"
                        />
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
                      >
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-sm text-emerald-600 dark:text-emerald-400"
                      >
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      loading ||
                      !isEmailValid ||
                      (mode === "signup" && (!name.trim() || !isPasswordValid))
                    }
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : null}
                    {loading
                      ? mode === "signin"
                        ? "Signing in..."
                        : "Creating account..."
                      : mode === "signin"
                        ? "Sign in"
                        : "Create account"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {mode !== "forgot" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center text-sm">
                  {mode === "signin" ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-muted-foreground">
                          New here?{" "}
                        </span>
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                          onClick={() => handleModeChange("signup")}
                          disabled={loading}
                        >
                          Create an account
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                          onClick={() => handleModeChange("forgot")}
                          disabled={loading}
                        >
                          Forgot your password?
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-muted-foreground">
                        Already have an account?{" "}
                      </span>
                      <button
                        type="button"
                        className="font-medium text-primary hover:underline"
                        onClick={() => handleModeChange("signin")}
                        disabled={loading}
                      >
                        Sign in
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
