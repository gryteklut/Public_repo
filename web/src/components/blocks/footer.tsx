import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/consts";
import { withBase } from "@/lib/base";

export function Footer() {
  const navigation = [
    { name: "Hub", href: withBase("/") },
    { name: "AB-650 portal", href: withBase("/AB-650/") },
  ];

  return (
    <footer className="flex flex-col items-center gap-14 pt-20 lg:pt-28">
      <div className="container space-y-3 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl">
          Public tools hub
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
          Built with the Mainline Astro theme (shadcn/ui + Tailwind). Root stays
          a hub; tools live under their own paths.
        </p>
        <div>
          <Button size="lg" className="mt-4" asChild>
            <a href={withBase("/AB-650/")}>Open AB-650</a>
          </Button>
        </div>
      </div>

      <nav className="container flex flex-col items-center gap-4 pb-10">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
          <li>
            <a
              href={GITHUB_URL}
              className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
            >
              GitHub <ArrowUpRight className="size-4" />
            </a>
          </li>
        </ul>
        <p className="text-muted-foreground text-sm">
          Theme:{" "}
          <a
            href="https://github.com/shadcnblocks/mainline-astro-template"
            className="underline-offset-4 hover:underline"
          >
            Mainline (MIT)
          </a>
        </p>
      </nav>
    </footer>
  );
}
