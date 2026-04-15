import { Church, GraduationCap, Building2, Trophy, Mic2, Landmark } from 'lucide-react';

const cases = [
  {
    icon: Church,
    title: 'Churches & ministries',
    copy: 'Sunday services, conferences, revivals. Reach every immigrant community in your neighborhood without hiring interpreters.',
  },
  {
    icon: Mic2,
    title: 'Conferences & keynotes',
    copy: 'Every attendee hears the speaker in their own language. No booth interpreters, no headsets to rent, no audio feedback.',
  },
  {
    icon: Trophy,
    title: 'Sports & e-sports',
    copy: 'Broadcast a play-by-play in the home language of every fan in the stadium. Commentary that travels farther than the camera.',
  },
  {
    icon: GraduationCap,
    title: 'Universities & lectures',
    copy: 'International students follow lectures in their mother tongue. Professors focus on the material, not translation logistics.',
  },
  {
    icon: Building2,
    title: 'Corporate all-hands',
    copy: 'Your global team hears the CEO in Spanish, Mandarin, Hindi, or Polish — without replaying a dubbed recording an hour later.',
  },
  {
    icon: Landmark,
    title: 'Government & public events',
    copy: 'Town halls, press briefings, parliamentary sessions. Language access as a civil right, at the cost of a phone plan.',
  },
];

export function UseCases() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Built for every live event
          </div>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            If people gather to listen, Lingora is for you.
          </h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <div
              key={c.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40"
            >
              <c.icon className="h-6 w-6 text-primary" />
              <div className="mt-4 font-semibold">{c.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
