/** Renders a list of legal sections with consistent typographic rhythm. */
export function LegalBody({
  sections,
}: {
  sections: { h: string; p: string }[];
}) {
  return (
    <div className="mt-12 space-y-10">
      {sections.map((s) => (
        <section key={s.h}>
          <h2 className="font-serif text-xl font-light">{s.h}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{s.p}</p>
        </section>
      ))}
    </div>
  );
}
