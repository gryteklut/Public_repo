import { BookOpenCheck, ClipboardCheck, Timer } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/base";

const features = [
  {
    title: "Ten study days",
    description: "One topic a day, then a knowledge check you must pass at 100%.",
    icon: BookOpenCheck,
  },
  {
    title: "Official labs",
    description: "Seven Microsoft Learning labs, 450 minutes, in order.",
    icon: Timer,
  },
  {
    title: "Progress on this device",
    description: "Export or import a JSON file when you switch browsers.",
    icon: ClipboardCheck,
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        <div className="flex-1">
          <p className="text-muted-foreground mb-3 text-sm font-medium tracking-wide uppercase">
            Exam AB-650
          </p>
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl">
            Administer Microsoft 365 and AI services
          </h1>

          <p className="text-muted-foreground mt-5 text-xl md:text-2xl">
            Microsoft Learn modules, the official hands-on labs, and a
            knowledge check for each day.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild>
              <a href={withBase("/courses/ab-650/")}>Start AB-650</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={withBase("/courses/ab-650/labs/")}>Open the labs</a>
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
