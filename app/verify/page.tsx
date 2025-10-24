import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VerifyEmailContent } from "@/components/verify-email-content";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailSuspenseFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailSuspenseFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-xl border border-border/40 bg-card p-8 shadow-lg text-center space-y-6">
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">Loading verification...</h1>
        <p className="text-muted-foreground">
          One moment while we prepare your verification details.
        </p>
      </div>
    </div>
  );
}
