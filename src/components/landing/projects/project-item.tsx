import Link from "next/link";
import type { Project } from "@/components/landing/projects/projects-data";

type ProjectItemProps = Project & {
  onInteract: () => void;
};

export const ProjectItem = ({
  name,
  description,
  href,
  icon,
  onInteract,
}: ProjectItemProps) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onInteract}
      className="group flex gap-3 bg-background px-5 py-5 transition-colors hover:bg-foreground/[0.02] sm:px-6 sm:py-6"
    >
      {/** biome-ignore lint/performance/noImgElement: local SVG brand mark */}
      <img
        src={icon}
        alt=""
        aria-hidden
        className="mt-0.5 size-4 shrink-0 opacity-80 transition-opacity group-hover:opacity-100"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-medium text-foreground text-sm tracking-tight">
          {name}
        </span>
        <span className="text-foreground/80 text-sm leading-relaxed">
          {description}
        </span>
      </div>
    </Link>
  );
};
