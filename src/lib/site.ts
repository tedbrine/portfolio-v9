const fullName = "Ted Brine";

export const site = {
  name: { first: "Ted", last: "Brine", full: fullName },
  title: "Software Engineer",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ted.ac",
  birthDate: new Date("2009-01-22"),
  location: {
    label: "Great Britain",
    countryCode: "GB",
    flagUrl: "https://ted.ac/api/emoji/gb",
  },
  seo: {
    tagline:
      "Building distributed software systems focused on infrastructure, real-time communication, and scalable web applications.",
    description: `${fullName} is a software engineer from Great Britain specialising in distributed systems, infrastructure, real-time communication, and scalable web applications.`,
    keywords: [
      fullName,
      "Ted Brine portfolio",
      "software engineer",
      "software engineer UK",
      "software engineer Great Britain",
      "distributed systems engineer",
      "infrastructure engineer",
      "real-time communication",
      "scalable web applications",
      "Next.js developer",
      "React developer",
      "TypeScript developer",
      "full stack developer",
      "web developer portfolio",
    ],
    locale: "en_GB",
    twitterHandle: "@tedbrine",
  },
  social: [
    {
      label: "X",
      href: "https://x.com/tedbrine",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/tedbrine",
    },
    {
      label: "Calendar",
      href: "https://els.cal.com/ted",
    },
  ] as const,
  assets: {
    figure: "/figure.jpg",
    icon: "/icon.jpg",
    signature: "/signature.png",
  },
  status: {
    timezone: "Europe/London",
    timezoneLabel: "London",
    lastfmUsername: "callmehSpear",
    discordUserId: "1104076205105365064",
    hackatimeApiUrl: "https://hackatime.hackclub.com/api/hackatime/v1",
  },
} as const;
