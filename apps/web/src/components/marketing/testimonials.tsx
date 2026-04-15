import { Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    quote:
      "We used to pay three interpreters every Sunday. Lingora handles nine languages now, for a fraction of the price, and the Spanish-speaking aunties actually prefer the Cartesia voice to the human one.",
    name: 'Pastor Lydia Okon',
    role: 'Family Worship Center, Houston',
    initials: 'LO',
  },
  {
    quote:
      "A keynote with 40 nationalities in the room used to mean pre-recorded dubs an hour after the talk. With Lingora it's live — and the Q&A works too. Game changer for hybrid events.",
    name: 'Marcus Lindqvist',
    role: 'Head of Events, Nordic Founder Summit',
    initials: 'ML',
  },
  {
    quote:
      "I teach graduate physics to students from 22 countries. Lingora means my Mandarin students don't lose the last 10% of every lecture to translation lag. Their exam scores went up.",
    name: 'Dr. Priya Ranganathan',
    role: 'Professor, ETH Zürich',
    initials: 'PR',
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            What customers are saying
          </div>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Built with multilingual communities.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="absolute right-4 top-4 h-12 w-12 text-border" />
              <p className="relative text-balance text-base leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
