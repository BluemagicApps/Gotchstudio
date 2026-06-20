"use client";

import { useCallback, useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type RecordType = "inquiries" | "subscribers" | "consultations" | "audit";

interface Stats {
  generatedAt: string;
  inquiries: Tally;
  subscribers: Tally;
  consultations: Tally;
  auditEvents: number;
}
interface Tally {
  total: number;
  last7Days: number;
  byStatus: Record<string, number>;
}

const KEY_STORAGE = "gotch-admin-key";

// Display columns per record type.
const COLUMNS: Record<RecordType, { key: string; label: string }[]> = {
  inquiries: [
    { key: "createdAt", label: "Date" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "type", label: "Type" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
    { key: "source", label: "Source" },
  ],
  subscribers: [
    { key: "createdAt", label: "Date" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "locale", label: "Locale" },
    { key: "source", label: "Source" },
  ],
  consultations: [
    { key: "date", label: "Date" },
    { key: "slot", label: "Slot" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "service", label: "Service" },
    { key: "status", label: "Status" },
  ],
  audit: [
    { key: "createdAt", label: "Date" },
    { key: "action", label: "Action" },
    { key: "entity", label: "Entity" },
    { key: "status", label: "Status" },
    { key: "message", label: "Message" },
  ],
};

const TYPES: RecordType[] = ["inquiries", "subscribers", "consultations", "audit"];

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const [type, setType] = useState<RecordType>("inquiries");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const authHeader = useCallback(
    (k: string) => ({ Authorization: `Bearer ${k}` }),
    [],
  );

  const dateQS = useCallback(() => {
    const p = new URLSearchParams();
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return p.toString() ? `&${p.toString()}` : "";
  }, [from, to]);

  const loadStats = useCallback(
    async (k: string) => {
      const res = await fetch("/api/admin/stats", { headers: authHeader(k) });
      if (!res.ok) throw new Error(res.status === 401 ? "Invalid key." : "Error.");
      setStats((await res.json()) as Stats);
    },
    [authHeader],
  );

  const loadRows = useCallback(
    async (t: RecordType) => {
      if (!key) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/export?type=${t}&format=json${dateQS()}`,
          { headers: authHeader(key) },
        );
        const data = (await res.json()) as { rows?: Record<string, unknown>[] };
        setRows(data.rows ?? []);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [key, dateQS, authHeader],
  );

  async function authenticate(k: string) {
    setError(null);
    try {
      await loadStats(k);
      setKey(k);
      setAuthed(true);
      localStorage.setItem(KEY_STORAGE, k);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error.");
      setAuthed(false);
    }
  }

  // Try a saved key on first load.
  useEffect(() => {
    const saved = localStorage.getItem(KEY_STORAGE);
    if (saved) {
      setKey(saved);
      loadStats(saved)
        .then(() => setAuthed(true))
        .catch(() => localStorage.removeItem(KEY_STORAGE));
    }
  }, [loadStats]);

  // Load rows when authed or the type/date filter changes.
  useEffect(() => {
    if (authed) loadRows(type);
  }, [authed, type, loadRows]);

  function signOut() {
    localStorage.removeItem(KEY_STORAGE);
    setKey("");
    setAuthed(false);
    setStats(null);
    setRows([]);
  }

  async function download(format: "csv" | "json") {
    const res = await fetch(
      `/api/admin/export?type=${type}&format=${format}${dateQS()}`,
      { headers: authHeader(key) },
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gotch-${type}-${new Date().toISOString().slice(0, 10)}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Login ──
  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            authenticate(key);
          }}
          className="w-full max-w-sm rounded-lg border border-border bg-card p-8"
        >
          <h1 className="font-serif text-2xl font-light">Gotch Studio — Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your admin key to continue.
          </p>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            autoFocus
            className="mt-6 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            className="mt-4 h-11 w-full rounded-md bg-primary text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  // ── Dashboard ──
  const cards: { label: string; t: Tally }[] = stats
    ? [
        { label: "Inquiries", t: stats.inquiries },
        { label: "Subscribers", t: stats.subscribers },
        { label: "Consultations", t: stats.consultations },
      ]
    : [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-light">Back office</h1>
        <button
          onClick={signOut}
          className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign out
        </button>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {c.label}
            </p>
            <p className="mt-2 font-serif text-4xl font-light">{c.t.total}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              +{c.t.last7Days} in last 7 days
            </p>
          </div>
        ))}
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Audit events
          </p>
          <p className="mt-2 font-serif text-4xl font-light">
            {stats?.auditEvents ?? 0}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-wrap items-end gap-4 border-b border-border pb-6">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((tt) => (
            <button
              key={tt}
              onClick={() => setType(tt)}
              className={
                "rounded-full border px-4 py-1.5 text-sm capitalize transition-colors " +
                (type === tt
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground")
              }
            >
              {tt}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <label className="text-xs text-muted-foreground">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 block h-9 rounded-md border border-border bg-background px-2 text-sm outline-none"
            />
          </label>
          <label className="text-xs text-muted-foreground">
            To
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 block h-9 rounded-md border border-border bg-background px-2 text-sm outline-none"
            />
          </label>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => download("csv")}
            className="rounded-md bg-accent px-4 py-2 text-sm text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Download CSV
          </button>
          <button
            onClick={() => download("json")}
            className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No records.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {COLUMNS[type].map((c) => (
                  <th
                    key={c.key}
                    className="whitespace-nowrap px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 100).map((r, i) => (
                <tr key={i} className="border-b border-border/60">
                  {COLUMNS[type].map((c) => (
                    <td key={c.key} className="max-w-xs truncate px-3 py-2">
                      {formatCell(c.key, r[c.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {rows.length > 100 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Showing first 100 of {rows.length}. Use Download for the full set.
        </p>
      )}
    </main>
  );
}

function formatCell(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (key === "createdAt" || key === "date") {
    const d = new Date(String(value));
    return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
  }
  return String(value);
}
