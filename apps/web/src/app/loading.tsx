export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="absolute inset-2 animate-ping rounded-full bg-primary/30 [animation-delay:200ms]" />
        <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_30px_hsl(270_91%_65%/0.6)]" />
      </div>
    </div>
  );
}
