import { site } from "@/lib/site";

export const Signature = () => {
  return (
    // biome-ignore lint/performance/noImgElement: decorative signature svg
    <img
      src={site.assets.signature}
      className="mx-auto my-16 h-auto w-36"
      alt="Signature"
      width={752}
      height={436}
    />
  );
};
