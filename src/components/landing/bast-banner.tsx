import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContentBox } from "@/components/layout/shell";

const BAST_PURPLE = "#8B5CF6";

export const BastBanner = () => {
  return (
    <ContentBox className="relative overflow-hidden p-0" position="middle">
      <Link
        href="https://bast.sh"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Check out Bast"
        className="bast-banner-link relative block overflow-hidden px-4 py-2.5 sm:px-5 sm:py-3"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="bast-banner-pattern" />
          <div className="bast-banner-pattern-mid" />
        </div>

        <div className="relative grid grid-cols-[1fr_auto] items-center gap-3">
          <div className="flex min-w-0 items-baseline justify-center gap-2 sm:gap-3">
            <span className="inline-flex shrink-0 items-baseline font-mono font-semibold text-sm tracking-tight text-white">
              Bast
              <span
                className="relative -top-0.5 animate-[bast-cursor-blink_1.1s_step-end_infinite]"
                style={{ color: BAST_PURPLE }}
                aria-hidden
              >
                _
              </span>
            </span>

            <span className="shrink-0 text-white/30" aria-hidden>
              ·
            </span>

            <p className="text-sm text-white/95 tracking-tight">
              The fast way into the servers you use every day.
            </p>
          </div>

          <span className="flex shrink-0">
            <ArrowUpRight aria-hidden className="size-5 text-white" />
          </span>
        </div>
      </Link>
    </ContentBox>
  );
};
