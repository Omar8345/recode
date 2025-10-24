"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appwriteAuth } from "@/lib/appwrite";

type VerificationStatus = "idle" | "verifying" | "success" | "error";

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    if (!userId || !secret) {
      setStatus("error");
      setMessage(
        "Missing verification details. Please use the link from your email."
      );
      return;
    }

    const verify = async () => {
      setStatus("verifying");
      setMessage("Hang tight while we verify your email.");
      try {
        await appwriteAuth.verifyEmail(userId, secret);
        setStatus("success");
        setMessage("Email successfully verified. You're all set!");
      } catch {
        setStatus("error");
        setMessage(
          "Email verification failed. The link might be expired or already used."
        );
      }
    };

    void verify();
  }, [searchParams]);

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const renderIcon = () => {
    if (status === "verifying") {
      return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
    }
    if (status === "success") {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    return <XCircle className="h-6 w-6 text-destructive" />;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-xl border border-border/40 bg-card p-8 shadow-lg text-center space-y-6">
        <div className="flex justify-center">{renderIcon()}</div>
        <h1 className="text-2xl font-semibold">
          {status === "success"
            ? "Email Verified"
            : status === "verifying"
              ? "Verifying Email"
              : "Verification Error"}
        </h1>
        <p className="text-muted-foreground">{message}</p>
        <div className="flex flex-col gap-3">
          {status === "success" ? (
            <>
              <Button onClick={handleGoToDashboard}>Go to Dashboard</Button>
              <Button variant="ghost" onClick={handleGoHome}>
                Back to Home
              </Button>
            </>
          ) : status === "verifying" ? (
            <Button disabled className="justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying…
            </Button>
          ) : (
            <>
              <Button onClick={handleGoHome}>Back to Home</Button>
              <Button variant="ghost" onClick={() => router.refresh()}>
                Try Again
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
