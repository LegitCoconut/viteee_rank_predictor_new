import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const BMC_URL = 'https://buymeacoffee.com/legitcoconut';

const TIERS = [
  { amount: 99, title: 'A cup of chai', body: 'Keeps one free-tier server alive for a day.' },
  { amount: 199, title: 'A new mock set', body: 'Funds licensing a fresh batch of practice questions.' },
  { amount: 499, title: 'A new feature', body: 'Pays for a weekend of development on the next big thing.' },
];

const PRINCIPLES = [
  { title: 'Built by students', body: "We know what the grind feels like, because we're in it." },
  { title: 'Free, forever', body: 'No signup, no paywall, no upsell. The mock tests stay free.' },
  { title: 'No data games', body: 'Your attempts stay on your device. We never sell or trade data.' },
  { title: 'More on the way', body: 'Next up: JEE, NEET and CUET tools. Your support speeds us up.' },
];

export default function DonatePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="hero-mesh py-14 md:py-20">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              Help keep VIT RANKS <span className="gradient-text">free</span>.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              VIT RANKS is free and ad-free, and we want it to stay that way. If it helped you study and
              you can spare the price of a cup of chai, it keeps the servers running and the next feature coming.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              Student-built &middot; No ads, no paywall &middot; Genuinely free
            </p>
          </div>
        </section>

        <section id="donate-form" className="container mx-auto max-w-5xl scroll-mt-20 px-4">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center md:p-10">
            <Image src="/bmc/bmc-logo-yellow.png" alt="" width={72} height={72} className="rounded-2xl" />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">Buy us a coffee</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Pick any amount on Buy Me a Coffee. UPI, cards and more are supported, and it takes under a minute.
            </p>
            <a
              href={BMC_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy Malabar Matrix a coffee on Buy Me a Coffee"
              className="mt-6 inline-block rounded-2xl transition-transform hover:scale-105 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:scale-100"
            >
              <Image src="/bmc/bmc-button.png" alt="Buy me a coffee" width={240} height={67} priority />
            </a>
            <p className="mt-4 text-xs text-muted-foreground">Opens buymeacoffee.com/legitcoconut in a new tab.</p>
          </div>
        </section>

        <section className="container mx-auto mt-12 max-w-5xl px-4">
          <h2 className="text-xl font-semibold tracking-tight">Where the money goes</h2>
          <p className="mt-1 text-sm text-muted-foreground">Small sums, spent directly on keeping this live.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {TIERS.map((t) => (
              <div key={t.amount} className="rounded-2xl border border-border bg-card p-5">
                <span className="text-2xl font-semibold tabular-nums">&#8377;{t.amount}</span>
                <p className="mt-2 text-sm font-medium">{t.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Can&rsquo;t donate right now? That&rsquo;s fine. Sharing VIT RANKS with a friend preparing for VITEEE helps just as much.
          </p>
        </section>

        <section className="container mx-auto mt-16 max-w-5xl px-4 pb-20">
          <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-12">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">We&rsquo;re Malabar Matrix.</h2>
              <p className="mt-4 text-muted-foreground">
                A small collective of students, mostly from Kerala, who got tired of paywalled mock tests, shady
                coaching funnels, and basic educational material being harder to find than it should be.
              </p>
              <p className="mt-3 text-muted-foreground">
                So we build, quietly and for free, for anyone preparing for an exam that could change their life.
                This platform is the first of a few things we&rsquo;re putting out.
              </p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {PRINCIPLES.map((x) => (
                <div key={x.title} className="rounded-2xl border border-border bg-card p-4">
                  <dt className="text-sm font-medium">{x.title}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{x.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
