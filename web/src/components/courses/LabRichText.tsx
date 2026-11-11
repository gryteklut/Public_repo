import { Fragment, type ReactNode } from "react";

const FILE_BASE =
  "https://github.com/MicrosoftLearning/AB-650T00_administer_microsoft_365_and_ai_services/blob/main/";

function absoluteLabUrl(url: string): string {
  const files = url.match(/(?:\.\.\/)+Allfiles\/(.+)$/);
  if (files) return `${FILE_BASE}Allfiles/${files[1]}`;
  return url;
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+)/g;
  let last = 0;
  let i = 0;
  for (const match of text.matchAll(re)) {
    const idx = match.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));
    const token = match[0];
    const key = `${keyPrefix}-${i}`;
    if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="ms-code">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("[")) {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        nodes.push(
          <a
            key={key}
            href={absoluteLabUrl(link[2])}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--ms-accent)] underline-offset-4 hover:underline"
          >
            {link[1]}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    } else {
      nodes.push(
        <a
          key={key}
          href={token}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[var(--ms-accent)] underline-offset-4 hover:underline"
        >
          {token}
        </a>,
      );
    }
    last = idx + token.length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function prose(text: string, key: string): ReactNode[] {
  const noteMatch = text.match(/>\s*\[!NOTE\]\s*>?\s*([\s\S]*)$/);
  let body = text.trim();
  let note: string | null = null;
  if (noteMatch && noteMatch.index != null) {
    body = text.slice(0, noteMatch.index).trim();
    note = noteMatch[1].replace(/^>\s?/gm, "").trim();
  }
  const out: ReactNode[] = [];
  if (body) out.push(<Fragment key={key}>{inline(body, key)}</Fragment>);
  if (note) {
    out.push(
      <span key={`${key}-note`} className="ms-note">
        {inline(note, `${key}-note`)}
      </span>,
    );
  }
  return out;
}

/** Renders official lab Markdown (bold, code, notes, fences) without changing the words. */
export function LabRichText({ text }: { text: string }) {
  const chunks: ReactNode[] = [];
  const fence = /```(\w+)?\s*([\s\S]*?)```/g;
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(fence)) {
    const idx = match.index ?? 0;
    if (idx > last) chunks.push(...prose(text.slice(last, idx), `p${n}`));
    const code = match[2].replace(/\s+$/, "");
    chunks.push(
      <pre key={`f${n}`} className="ms-pre">
        <code>{code}</code>
      </pre>,
    );
    last = idx + match[0].length;
    n += 1;
  }
  if (last < text.length) chunks.push(...prose(text.slice(last), `p${n}`));
  return <>{chunks}</>;
}
