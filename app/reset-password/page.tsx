import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ResetPasswordContent } from "@/components/reset-password-content";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSuspenseFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordSuspenseFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border/40 bg-card p-8 text-center shadow-lg space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <h1 className="text-2xl font-semibold">Loading reset form...</h1>
        <p className="text-muted-foreground">
          Hold tight while we load your reset details.
        </p>
      </div>
    </div>
  );
}
