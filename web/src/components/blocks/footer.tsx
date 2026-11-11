import { ArrowUpRight } from "lucide-react";

import { GITHUB_URL } from "@/consts";
import { withBase } from "@/lib/base";

export function Footer({
  items = [
    { label: "Hub", href: "/" },
    { label: "Courses", href: "/courses/" },
  ],
}: {
  items?: { label: string; href: string }[];
}) {
  const navigation = items.map((item) => ({
    name: item.label,
    href: withBase(item.href),
  }));

  return (
    <footer className="pt-16 lg:pt-20">
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
      </nav>
    </footer>
  );
};
