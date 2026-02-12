import React from 'react';

export const StoreContext = React.createContext(null as any);

export const StoreProvider = ({ children }: any) => {
  return (
    <StoreContext.Provider value={{}}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  return {};
};