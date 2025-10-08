import React from 'react';

export interface BrowseState {
  orderedNames: string[];
  setOrderedNames: (names: string[]) => void;
}

export const BrowseContext = React.createContext<BrowseState | undefined>(
  undefined
);

export function useBrowse() {
  const ctx = React.useContext(BrowseContext);
  if (!ctx) throw new Error('BrowseContext not provided');
  return ctx;
}

export function BrowseProvider({ children }: { children: React.ReactNode }) {
  const [orderedNames, setOrderedNames] = React.useState<string[]>([]);
  const value = React.useMemo(() => ({ orderedNames, setOrderedNames }), [orderedNames]);
  return <BrowseContext.Provider value={value}>{children}</BrowseContext.Provider>;
}

