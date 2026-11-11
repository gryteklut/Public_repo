import { BookOpenCheck, ClipboardCheck, Timer } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/base";

const features = [
  {
    title: "One hour each weekday",
    description: "A 60-minute session, then a knowledge check you must pass at 100%.",
    icon: BookOpenCheck,
  },
  {
    title: "Official labs",
    description: "Microsoft Learning labs, with each exercise checked off as you go.",
    icon: Timer,
  },
  {
    title: "Progress on this device",
    description: "Each course keeps its own progress. Export JSON when you switch browsers.",
    icon: ClipboardCheck,
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        <div className="flex-1">
          <p className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
            Course catalog
          </p>
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl">
            Certification study courses
          </h1>

          <p className="text-muted-foreground mt-5 text-xl md:text-2xl">
            One hour each weekday, official Microsoft Learning labs, and a
            companion course for each exam.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild>
              <a href="#catalog">Browse courses</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={withBase("/courses/")}>Open the catalog</a>
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
