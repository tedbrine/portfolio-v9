import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ContentBox } from "@/components/layout/shell";

const PRIORITY_AD_URL = "https://api.ads.i.els.re/api/ads/priority";
const AD_DOT_FIELD_WIDTH = 1000;
const AD_DOT_FIELD_HEIGHT = 180;

const AD_SCATTER_DOTS = (() => {
  let seed = 0x4d595df4;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x1_0000_0000;
  };

  return Array.from({ length: 84 }, () => {
    const lighter = random() < 0.08;

    return {
      x: random() * AD_DOT_FIELD_WIDTH,
      y: random() * AD_DOT_FIELD_HEIGHT,
      radius: 0.8 + random() * 0.8,
      opacity: lighter ? 0.18 + random() * 0.2 : 0.68 + random() * 0.3,
    };
  });
})();

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
          <div className="ad-banner-pattern-mid">
            <svg
              viewBox={`0 0 ${AD_DOT_FIELD_WIDTH} ${AD_DOT_FIELD_HEIGHT}`}
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-hidden="true"
            >
              {AD_SCATTER_DOTS.map((dot) => (
                <circle
                  key={`${dot.x}-${dot.y}`}
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.radius}
                  fill="var(--ad-brand-colour)"
                  opacity={dot.opacity}
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-2 text-center sm:grid sm:grid-cols-[8rem_minmax(0,1fr)_2rem] sm:items-center sm:gap-6 md:grid-cols-[9rem_minmax(0,1fr)_2.25rem]">
          <div className="flex flex-col items-center gap-0 sm:items-start">
            <span className="hidden font-medium text-[9px] text-white/55 uppercase leading-none tracking-[0.16em] sm:inline">
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

          <p className="min-w-0 break-words text-center text-sm text-white/95 tracking-tight sm:text-base sm:leading-snug md:text-lg">
            {ad.header}
          </p>

          <ArrowUpRight
            aria-hidden
            className="ad-banner-action hidden size-8 shrink-0 rounded-full border border-white/20 p-1.5 text-white sm:block md:size-9 md:p-2"
          />
        </div>
      </a>
    </ContentBox>
  );
};
