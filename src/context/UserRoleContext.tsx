import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

type Role = 'entrepreneur' | 'officer';

interface UserRoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('entrepreneur');

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
