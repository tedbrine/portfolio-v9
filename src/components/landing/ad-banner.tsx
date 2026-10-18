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
        className="ad-banner-link relative block overflow-hidden px-4 py-2.5 sm:px-6 sm:py-5 md:py-6"
        style={{ "--ad-brand-colour": ad.brand.colour } as CSSProperties}
      >
        <div
          className="pointer-events-none absolute inset-px overflow-hidden"
          aria-hidden
        >
          <div className="ad-banner-pattern" />
          <div className="ad-banner-pattern-mid" />
        </div>

        <div className="relative flex flex-col items-center gap-2 text-center sm:grid sm:grid-cols-[8rem_minmax(0,1fr)_2.5rem] sm:items-center sm:gap-6 sm:text-left md:grid-cols-[9rem_minmax(0,1fr)_3rem]">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="hidden font-medium text-[10px] text-white/55 uppercase tracking-[0.2em] sm:inline">
              Sponsored
            </span>
            <Image
              src={ad.brand.logo}
              alt={ad.brand.name}
              width={112}
              height={24}
              unoptimized
              className="h-5 max-w-24 shrink-0 object-contain sm:h-6 sm:max-w-28"
            />
          </div>

          <p className="min-w-0 break-words text-sm text-white/95 tracking-tight sm:text-lg sm:leading-snug md:text-xl">
            {ad.header}
          </p>

          <ArrowUpRight
            aria-hidden
            className="ad-banner-action hidden size-10 shrink-0 rounded-full border border-white/20 p-2 text-white sm:block md:size-12 md:p-2.5"
          />
        </div>
      </a>
    </ContentBox>
  );
};
