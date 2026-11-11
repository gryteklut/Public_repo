import { ArrowRight, BookOpenCheck, Layers3, ShieldCheck } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/base";

const features = [
  {
    title: "Learn-first modules",
    description:
      "Study panels before control questions, with all-correct gating.",
    icon: BookOpenCheck,
  },
  {
    title: "Hub-ready paths",
    description: "Root stays open for more tools; AB-650 lives under /AB-650/.",
    icon: Layers3,
  },
  {
    title: "Local progress",
    description: "Export/import JSON so you can move between devices.",
    icon: ShieldCheck,
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        <div className="flex-1">
          <p className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
            gryteklut / Public_repo
          </p>
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl">
            Public tools hub
          </h1>

          <p className="text-muted-foreground mt-5 text-xl md:text-2xl">
            GitHub Pages hub powered by the Mainline Astro theme. Start with the
            AB-650 study portal.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <Button asChild>
              <a href={withBase("/AB-650/")}>Open AB-650 portal</a>
            </Button>
            <Button
              variant="outline"
              className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md"
              asChild
            >
              <a
                href="https://github.com/shadcnblocks/mainline-astro-template"
                className="max-w-56 truncate text-start md:max-w-none"
              >
                Mainline theme
                <ArrowRight className="stroke-3" />
              </a>
            </Button>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-2.5 lg:gap-5">
                <Icon className="text-foreground mt-1 size-4 shrink-0 lg:size-5" />
                <div>
                  <h2 className="font-text text-foreground font-semibold">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground max-w-76 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
