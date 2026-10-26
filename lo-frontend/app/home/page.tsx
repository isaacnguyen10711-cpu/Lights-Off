export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-center text-4xl font-bold tracking-tight text-strong sm:text-6xl">
          Lights Off
        </h1>
        <p className="text-center text-lg leading-8 text-muted">
          A sleep tracker for people whose nights do not follow the clock.
        </p>
      </div>
    </div>
  );
}