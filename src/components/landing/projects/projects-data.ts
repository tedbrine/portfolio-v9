export type Project = {
  name: string;
  description: string;
  href: string;
  icon: string;
};

export const projects: Project[] = [
  {
    name: "ellipse Software",
    description:
      "We build intuitive software to help teams and enterprise thrive.",
    href: "https://els.re",
    icon: "/ellipse.svg",
  },
  {
    name: "Helios",
    description: "We are building an ambitious platform for lighting control.",
    href: "https://els.re/helios",
    icon: "/helios.svg",
  },
];
