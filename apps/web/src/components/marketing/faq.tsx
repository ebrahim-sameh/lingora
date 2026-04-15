import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: "How fast is 'real-time,' actually?",
    a: "Under one second, end to end, on a normal event Wi-Fi. Gladia Solaria-1 streams partial transcripts, Gemini 2.5 Flash translates them as they grow, and Cartesia Sonic-3 starts speaking the translation before your sentence is finished. Listeners typically hear the translated audio 600–900 ms behind your voice.",
  },
  {
    q: "Does my audience need to install anything?",
    a: 'No. They scan a QR code with their phone camera, tap the link that pops up, pick their language, and tap Listen. Works in Safari, Chrome, Firefox, and every other modern browser — no account, no signup, no download.',
  },
  {
    q: 'How many listeners can one event support?',
    a: 'Thousands. Lingora uses LiveKit Cloud for WebRTC fan-out, which is proven to handle 10,000+ concurrent listeners in a single room. Your pricing is not affected by audience size — you only pay for speaker minutes, never per listener.',
  },
  {
    q: 'Which languages do you support?',
    a: "100+ languages in both directions (speech-to-text and text-to-speech). All the European majors, plus Arabic, Chinese (Mandarin + Cantonese), Japanese, Korean, Hindi, Bengali, Urdu, Tamil, Swahili, Turkish, Persian, Vietnamese, Thai, Indonesian, and many more. You can see the full list when you create a session.",
  },
  {
    q: 'What does a "minute" mean on the pricing page?',
    a: 'One minute of speaker audio, in one target language. If you speak for 30 minutes with 4 target languages active, that\'s 30 × 4 = 120 billable minutes. Unlimited listeners per language are always included — you only pay for the speaking side.',
  },
  {
    q: 'What happens when I hit my free trial limit?',
    a: "You get 10 minutes of speaker audio total on the free trial. When you run out, your session ends gracefully and you're prompted to upgrade. You can come back anytime — your account, session history, and QR codes stay available.",
  },
  {
    q: 'Can I clone the speaker\'s own voice?',
    a: "Voice cloning is on the roadmap for v2 (coming Q3 2026). For now, every language uses a high-quality Cartesia Sonic-3 multilingual voice that matches the register of most live events. Enterprise plans get early access to voice cloning.",
  },
  {
    q: 'Is the translation private? Where does the audio go?',
    a: "Your speaker audio streams directly to LiveKit Cloud (SOC 2 Type II), then to Gladia for transcription and Cartesia for synthesis — all over encrypted WebSocket. We don't train models on your audio. Transcripts are stored for 30 days for session recordings, then deleted. Enterprise plans can opt for zero-retention.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Frequently asked
          </div>
          <h2 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Questions we hear a lot.
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-base sm:text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
