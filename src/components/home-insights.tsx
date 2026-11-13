// shortcut: figures are last season's snapshot from the public analytics report (May 2026), not live; wire to an API if they need to stay current.
const REPORT_URL = 'https://malabarmatrix.in/project/vitmocktest/analytics.html';

const STATS = [
  { value: '41,260+', label: 'mock tests started' },
  { value: '17,000+', label: 'students in exam week' },
  { value: '5,287', label: 'tests on the busiest day' },
  { value: '68', label: 'countries reached' },
];

export function HomeInsights() {
  return (
    <section id="insights" className="py-14 md:py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-10">
          <h2 className="text-center text-2xl font-semibold tracking-tight md:text-4xl">
            You&apos;re not preparing <span className="gradient-text">alone</span>.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Last year&apos;s numbers, from the VITEEE 2026 season.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse items-center gap-1 text-center">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center text-sm">
            <a
              href={REPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-coral"
            >
              See the full analytics report
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
