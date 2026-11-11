import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Github } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { GITHUB_URL } from "@/consts";
import { withBase } from "@/lib/base";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Hub", href: "/" },
  { label: "Courses", href: "/courses/" },
  { label: "AB-650", href: "/courses/ab-650/" },
  { label: "Labs", href: "/courses/ab-650/labs/" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const current = ITEMS.filter((link) => {
    const path = withBase(link.href).replace(/\/$/, "") || "/";
    const here = pathname.replace(/\/$/, "") || "/";
    if (link.href === "/") return here === path;
    return here === path || here.startsWith(`${path}/`);
  }).sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <section
      className={cn(
        "bg-background/70 absolute left-1/2 z-50 w-[min(90%,700px)] -translate-x-1/2 rounded-4xl border backdrop-blur-md transition-all duration-300",
        "top-5 lg:top-12",
      )}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <a href={withBase("/")} className="flex shrink-0 items-center gap-2">
          <img
            src={withBase("/logo.svg")}
            alt="Public repo"
            width={112}
            height={18}
            className="dark:invert"
          />
        </a>

        <NavigationMenu className="max-lg:hidden">
          <NavigationMenuList>
            {ITEMS.map((link) => (
              <NavigationMenuItem key={link.label}>
                <a
                  href={withBase(link.href)}
                  aria-current={current?.href === link.href ? "page" : undefined}
                  className={cn(
                    "relative bg-transparent px-1.5 text-sm font-medium transition-opacity hover:opacity-75",
                    current?.href === link.href &&
                      "font-semibold text-[var(--ms-accent)]",
                  )}
                >
                  {link.label}
                </a>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href={GITHUB_URL}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="size-4" />
            <span className="sr-only">GitHub</span>
          </a>

          <button
            className="text-muted-foreground relative flex size-8 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <div className="absolute top-1/2 left-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "rotate-45" : "-translate-y-1.5"}`}
              ></span>
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                aria-hidden="true"
                className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? "-rotate-45" : "translate-y-1.5"}`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {isMenuOpen &&
        createPortal(
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/25 lg:hidden"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          />,
          document.body,
        )}

      <div
        className={cn(
          "bg-card absolute inset-x-0 top-[calc(100%+0.75rem)] z-50 flex flex-col rounded-2xl border p-6 shadow-xl transition-all duration-300 ease-in-out lg:hidden",
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        )}
      >
        <nav className="divide-border flex flex-1 flex-col divide-y">
          {ITEMS.map((link) => (
            <a
              key={link.label}
              href={withBase(link.href)}
              className="text-foreground hover:text-foreground/80 py-4 text-base font-medium transition-colors first:pt-0 last:pb-0"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
};
