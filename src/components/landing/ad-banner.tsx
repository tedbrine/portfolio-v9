import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ContentBox } from "@/components/layout/shell";

const PRIORITY_AD_URL = "https://api.ads.i.els.re/api/ads/priority";

type PriorityAd = {
  header: string;
  link: string;
  brand: {
    name: string;
    logo: string;
    colour: string;
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isHttpsUrl = (value: unknown): value is string => {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
};

const parsePriorityAd = (value: unknown): PriorityAd | null => {
  if (!isRecord(value) || !isRecord(value.brand)) return null;

  const { header, link, brand } = value;
  const { name, logo, colour } = brand;

  if (
    typeof header !== "string" ||
    !header.trim() ||
    !isHttpsUrl(link) ||
    typeof name !== "string" ||
    !name.trim() ||
    !isHttpsUrl(logo) ||
    typeof colour !== "string" ||
    !/^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(colour)
  ) {
    return null;
  }

  return {
    header,
    link,
    brand: { name, logo, colour },
  };
};

const getPriorityAd = async (): Promise<PriorityAd | null> => {
  try {
    const response = await fetch(PRIORITY_AD_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) return null;

    return parsePriorityAd(await response.json());
  } catch {
    return null;
  }
};

export const AdBanner = async () => {
  const ad = await getPriorityAd();

  if (!ad) return null;

  return (
    <ContentBox className="relative overflow-hidden p-0" position="middle">
      <a
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer"
        className="ad-banner-link relative block overflow-hidden px-4 py-2.5 sm:px-5 sm:py-3"
        style={{ "--ad-brand-colour": ad.brand.colour } as CSSProperties}
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="ad-banner-pattern" />
          <div className="ad-banner-pattern-mid" />
        </div>

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={ad.brand.logo}
              alt={ad.brand.name}
              width={112}
              height={24}
              unoptimized
              className="h-6 max-w-28 shrink-0 object-contain"
            />

            <span
              className="hidden shrink-0 text-white/30 sm:inline"
              aria-hidden
            >
              ·
            </span>

            <p className="min-w-0 break-words text-sm text-white/95 tracking-tight">
              {ad.header}
            </p>
          </div>

          <ArrowUpRight aria-hidden className="size-5 shrink-0 text-white" />
        </div>
      </a>
    </ContentBox>
  );
};
