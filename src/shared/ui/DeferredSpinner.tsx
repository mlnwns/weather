import { useEffect, useState } from 'react';

interface DeferredSpinnerProps {
  delay?: number;
}

function DeferredSpinner({ delay = 300 }: DeferredSpinnerProps) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  if (!showSpinner) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin" />
    </div>
  );
}

export default DeferredSpinner;
