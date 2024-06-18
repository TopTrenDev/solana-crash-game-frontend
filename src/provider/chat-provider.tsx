'use client';
import { ReactNode, createContext, useContext, useState } from 'react';

type MarketplaceContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = createContext<MarketplaceContextType | null>(null);

export const useOpen = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useOpen must be used within a chatprovider');
  }

  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <Context.Provider value={{ open, setOpen }}>{children}</Context.Provider>
  );
};
