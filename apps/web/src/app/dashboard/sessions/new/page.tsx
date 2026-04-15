import { NewSessionForm } from '@/components/dashboard/new-session-form';

export default function NewSessionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Start a new session</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a name and the languages your audience will need. You can add more mid-event.
        </p>
      </div>
      <NewSessionForm />
    </div>
  );
}
