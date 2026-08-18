import { site } from "@/lib/site";

export const Signature = () => {
  return (
    <div
      role="img"
      aria-label="Signature"
      className="mx-auto my-16 aspect-[752/436] w-28 bg-foreground/7 [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      style={{
        maskImage: `url(${site.assets.signature})`,
        WebkitMaskImage: `url(${site.assets.signature})`,
      }}
    />
  );
};
