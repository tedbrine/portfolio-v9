import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContentBox } from "@/components/layout/shell";

const BAST_PURPLE = "#8B5CF6";

const edgeFadeMask =
  "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 22%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0.95) 100%)";

const dotPatternStyle = {
  backgroundImage: `radial-gradient(circle, ${BAST_PURPLE} 1.25px, transparent 1.25px)`,
  backgroundSize: "6px 6px",
  maskImage: edgeFadeMask,
  WebkitMaskImage: edgeFadeMask,
} as const;

export const BastBanner = () => {
  return (
    <ContentBox className="relative overflow-hidden p-0" position="middle">
      <Link
        href="https://bast.sh"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Check out Bast"
        className="group relative block overflow-hidden px-6 py-2.5 transition-opacity hover:opacity-90 sm:px-10 sm:py-3"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0" style={dotPatternStyle} />
          <div
            className="absolute inset-y-0 left-0 w-2/3 animate-[bast-shimmer_9s_ease-in-out_infinite]"
            style={{
              backgroundImage:
                "linear-gradient(105deg, transparent 35%, rgba(139, 92, 246, 0.14) 50%, transparent 65%)",
            }}
          />
        </div>

        <div className="relative flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          <span className="inline-flex items-baseline font-mono font-semibold text-sm tracking-tight text-white">
            Bast
            <span
              className="animate-[bast-cursor-blink_1.1s_step-end_infinite]"
              style={{ color: BAST_PURPLE }}
              aria-hidden
            >
              _
            </span>
          </span>

          <span className="hidden text-white/30 sm:inline" aria-hidden>
            ·
          </span>

          <p className="text-sm text-white/95 tracking-tight">
            The fast way into the servers you use every day.
          </p>

          <ArrowUpRight
            aria-hidden
            className="hidden size-3.5 text-white transition-transform group-hover:translate-x-px group-hover:-translate-y-px sm:inline"
          />
        </div>
      </Link>
    </ContentBox>
  );
};
