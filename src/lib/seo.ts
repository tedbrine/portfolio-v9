import type { Metadata } from "next";
import { site } from "@/lib/site";

type MetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

const titleTemplate = `%s · ${site.name.full}`;

export function getCanonicalUrl(path = "/") {
  return new URL(path, site.url).toString();
}

export function createMetadata({
  title,
  description = site.seo.description,
  path = "/",
  noIndex = false,
}: MetadataOptions = {}): Metadata {
  const canonical = getCanonicalUrl(path);
  const pageTitle = title ?? site.name.full;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name.full} · ${site.title}`,
      template: titleTemplate,
    },
    description,
    keywords: [...site.seo.keywords],
    authors: [{ name: site.name.full, url: site.url }],
    creator: site.name.full,
    publisher: site.name.full,
    applicationName: site.name.full,
    category: "technology",
    icons: {
      icon: site.assets.icon,
      apple: site.assets.icon,
    },
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "en-GB": canonical,
      },
    },
    openGraph: {
      type: "profile",
      locale: site.seo.locale,
      url: canonical,
      siteName: site.name.full,
      title: pageTitle,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${site.name.full} — ${site.title}`,
        },
      ],
      firstName: site.name.first,
      lastName: site.name.last,
      username: site.seo.twitterHandle.replace("@", ""),
    },
    twitter: {
      card: "summary_large_image",
      site: site.seo.twitterHandle,
      creator: site.seo.twitterHandle,
      title: pageTitle,
      description,
      images: ["/opengraph-image"],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    other: {
      "ai-content-declaration": "human-authored",
    },
  };
}

export function createJsonLd() {
  const profileUrl = getCanonicalUrl("/");

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${profileUrl}#website`,
      url: profileUrl,
      name: site.name.full,
      description: site.seo.description,
      inLanguage: "en-GB",
      publisher: { "@id": `${profileUrl}#person` },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${profileUrl}#profilepage`,
      url: profileUrl,
      name: `${site.name.full} — ${site.title}`,
      description: site.seo.description,
      inLanguage: "en-GB",
      isPartOf: { "@id": `${profileUrl}#website` },
      mainEntity: { "@id": `${profileUrl}#person` },
      dateModified: new Date().toISOString(),
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${profileUrl}#person`,
      name: site.name.full,
      givenName: site.name.first,
      familyName: site.name.last,
      url: profileUrl,
      image: getCanonicalUrl(site.assets.figure),
      jobTitle: site.title,
      description: site.seo.tagline,
      nationality: {
        "@type": "Country",
        name: site.location.label,
      },
      homeLocation: {
        "@type": "Country",
        name: site.location.label,
      },
      knowsAbout: [
        "Distributed systems",
        "Infrastructure",
        "Real-time communication",
        "Scalable web applications",
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Cloudflare",
      ],
      sameAs: site.social.map((link) => link.href),
    },
  ];
}