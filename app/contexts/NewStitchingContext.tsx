'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NewStitchingContextType {
  resetKey: number;
  triggerReset: () => void;
}

const NewStitchingContext = createContext<NewStitchingContextType | undefined>(undefined);

export function NewStitchingProvider({ children }: { children: ReactNode }) {
  const [resetKey, setResetKey] = useState(0);

  const triggerReset = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <NewStitchingContext.Provider value={{ resetKey, triggerReset }}>
      {children}
    </NewStitchingContext.Provider>
  );
}

export function useNewStitching() {
  const context = useContext(NewStitchingContext);
  if (context === undefined) {
    throw new Error('useNewStitching must be used within a NewStitchingProvider');
  }
  return context;
}