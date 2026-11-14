import { Loader2, TriangleAlert } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { CodeBlock } from "@/components/content/prose";
import { getPgpFingerprint } from "@/lib/pgp/fingerprint";

const FingerprintContent = async () => {
  await connection();
  const data = await getPgpFingerprint();

  if (!data) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <TriangleAlert className="size-4" />
        <span>Error downloading fingerprint</span>
      </div>
    );
  }

  return <CodeBlock>{data}</CodeBlock>;
};

const FingerprintFallback = () => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Loader2 className="size-4 animate-spin" />
      <span>Downloading fingerprint…</span>
    </div>
  );
};

export const PgpFingerprint = () => {
  return (
    <Suspense fallback={<FingerprintFallback />}>
      <FingerprintContent />
    </Suspense>
  );
};
