import { CounterButton } from '@/components/counter-button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8">
          Next.js + Tailwind + Zustand
        </h1>
        <p className="text-xl mb-8">A starter template</p>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Counter Example</h2>
          <p className="mb-4">This counter uses Zustand for state management</p>
          <CounterButton />
        </div>
      </div>
    </main>
  );
}
