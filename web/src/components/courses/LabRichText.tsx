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

function isRuleRow(cells: string[]): boolean {
  return cells.every((cell) => /^:?-+:?$/.test(cell));
}

function renderTable(rows: string[], key: string): ReactNode {
  const parsed = rows
    .map((row) =>
      row
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim()),
    )
    .filter((cells) => !isRuleRow(cells));
  if (parsed.length === 0) return null;
  const [head, ...body] = parsed;
  return (
    <div key={key} className="ms-table-wrap">
      <table className="ms-table">
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th key={index}>{inline(cell, `${key}-h${index}`)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {inline(cell, `${key}-r${rowIndex}c${cellIndex}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function noteLabel(text: string): string {
  return text
    .replace(/^\[!(?:NOTE|WARNING|IMPORTANT|TIP)\]\s*/i, "")
    .replace(/^\*\*(?:Note|NOTE|Warning|Important|Tip)\*\*:?\s*/i, "")
    .trim();
}

function renderProse(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let n = 0;
  while (i < lines.length) {
    if (!lines[i].trim()) {
      i += 1;
      continue;
    }
    if (lines[i].trim().startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim());
        i += 1;
      }
      out.push(renderTable(rows, `${key}-t${n}`));
      n += 1;
      continue;
    }
    if (lines[i].trim().startsWith(">")) {
      const note: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        note.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      out.push(
        <span key={`${key}-n${n}`} className="ms-note">
          {inline(noteLabel(note.join(" ")), `${key}-n${n}`)}
        </span>,
      );
      n += 1;
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith(">")
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    let body = para.join(" ");
    const noteMatch = body.match(/\s*>\s*\[!NOTE\]\s*>?\s*([\s\S]*)$/);
    let trailing: string | null = null;
    if (noteMatch && noteMatch.index != null) {
      trailing = noteMatch[1].replace(/^>\s?/g, "").trim();
      body = body.slice(0, noteMatch.index).trim();
    }
    if (body) {
      out.push(
        <Fragment key={`${key}-p${n}`}>{inline(body, `${key}-p${n}`)}</Fragment>,
      );
    }
    if (trailing) {
      out.push(
        <span key={`${key}-pn${n}`} className="ms-note">
          {inline(trailing, `${key}-pn${n}`)}
        </span>,
      );
    }
    n += 1;
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
    if (idx > last) chunks.push(...renderProse(text.slice(last, idx), `p${n}`));
    const code = match[2].replace(/\s+$/, "");
    chunks.push(
      <pre key={`f${n}`} className="ms-pre">
        <code>{code}</code>
      </pre>,
    );
    last = idx + match[0].length;
    n += 1;
  }
  if (last < text.length) chunks.push(...renderProse(text.slice(last), `p${n}`));
  return <>{chunks}</>;
}
