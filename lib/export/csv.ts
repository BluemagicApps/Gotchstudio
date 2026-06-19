/**
 * Minimal, correct CSV serializer for audit + marketing exports.
 * Quotes fields containing commas, quotes, or newlines (RFC 4180) and renders
 * dates as ISO strings. Prepends a UTF-8 BOM so Excel opens it cleanly.
 */
function escape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = value instanceof Date ? value.toISOString() : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export interface CsvColumn {
  key: string;
  header: string;
}

export function toCsv(
  rows: Record<string, unknown>[],
  columns: CsvColumn[],
): string {
  const head = columns.map((c) => escape(c.header)).join(",");
  const body = rows
    .map((r) => columns.map((c) => escape(r[c.key])).join(","))
    .join("\n");
  return `﻿${head}\n${body}\n`;
}
