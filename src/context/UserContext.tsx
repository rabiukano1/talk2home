import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
  name: 'Home User',
  email: 'user@talk2home',
  phone: '+1 555 000 000',
  bio: 'Smart home enthusiast',
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  updateUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
