import { ArrowRight, FlaskConical, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/base";

const tools = [
  {
    kicker: "Study plan",
    title: "AB-650",
    description:
      "Ten days for the exam. Continue where you left off, or start at day 1.",
    href: "/courses/ab-650/",
    icon: GraduationCap,
  },
  {
    kicker: "Practice",
    title: "Hands-on labs",
    description:
      "The seven official Microsoft Learning labs. Later labs reuse what you create earlier.",
    href: "/courses/ab-650/labs/",
    icon: FlaskConical,
  },
];

export function Tools() {
  return (
    <section className="container pb-24 lg:pb-32">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl tracking-tight md:text-3xl">Where to start</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.title}
              href={withBase(tool.href)}
              className="bg-card group hover:border-foreground/20 block rounded-2xl border p-6 shadow-xs transition-colors"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-muted flex size-10 items-center justify-center rounded-xl">
                  <Icon className="size-5" />
                </div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {tool.kicker}
                </p>
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                {tool.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-5">
                <Button variant="outline" className="gap-2" asChild>
                  <span>
                    Open
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
