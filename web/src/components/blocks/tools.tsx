import { ArrowRight, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { withBase } from "@/lib/base";

const tools = [
  {
    kicker: "Learning",
    title: "Courses",
    description:
      "Reusable study courses with soft-contrast day players, Udemy watch checklists, Microsoft Learn / SkillsUp, and gated knowledge checks.",
    href: "/courses/",
    icon: GraduationCap,
  },
  {
    kicker: "Certification",
    title: "AB-650",
    description:
      "Administering Microsoft 365 and AI Services — ten 60-minute days on the courses platform.",
    href: "/courses/ab-650/",
    icon: GraduationCap,
  },
];

export function Tools() {
  return (
    <section className="container pb-24 lg:pb-32">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl tracking-tight md:text-3xl">Available tools</h2>
        <p className="text-muted-foreground mt-2">
          More cards can land here later without moving AB-650 off its path.
        </p>
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
}
