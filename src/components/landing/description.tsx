import { Num, T } from "gt-next";
import { ContentBox } from "@/components/layout/shell";
import { getAge } from "@/lib/date";
import { site } from "@/lib/site";

export const Description = () => {
  return (
    <ContentBox
      className="flex flex-col gap-3 px-6 py-6 sm:px-10 sm:py-8"
      position="middle"
      label="Bio"
    >
      <p className="text-foreground/80">
        I&apos;m a <Num>{getAge(site.birthDate)}</Num> year old{" "}
        <span className="text-foreground">{site.title}</span> from{" "}
        <span className="inline-flex items-baseline gap-1 text-foreground">
          {/** biome-ignore lint/performance/noImgElement: img */}
          <img
            src={site.location.flagUrl}
            alt={`${site.location.label} flag`}
            className="inline-block h-4 w-4 shrink-0 translate-y-0.5"
          />
          {site.location.label}
        </span>
        .
      </p>
      <p className="text-foreground/80">
        <T>
          I build distributed software systems focused on infrastructure,
          real-time communication, and scalable web applications.
        </T>
      </p>
    </ContentBox>
  );
};
