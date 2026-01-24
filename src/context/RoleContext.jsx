import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export function useRole() {
  return useContext(RoleContext);
}

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null); // 'admin', 'seller', 'user', 'delivery'

  const value = {
    role,
    setRole
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}
