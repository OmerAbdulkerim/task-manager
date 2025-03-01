'use client';

import { useCounterStore } from '@/store/counter-store';
import { PlusIcon, MinusIcon, RotateCcwIcon } from 'lucide-react';

export function CounterButton() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl font-bold mb-4">{count}</div>
      <div className="flex space-x-2">
        <button
          onClick={decrement}
          className="flex items-center justify-center p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          aria-label="Decrement"
        >
          <MinusIcon className="h-5 w-5" />
        </button>
        <button
          onClick={increment}
          className="flex items-center justify-center p-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          aria-label="Increment"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          aria-label="Reset"
        >
          <RotateCcwIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
