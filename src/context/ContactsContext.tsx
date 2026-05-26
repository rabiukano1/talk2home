import { createContext, useContext, useState, ReactNode } from 'react';

const avatarColors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#0D9488', '#6366F1', '#0891B2', '#84CC16', '#D946EF'];

export interface Contact {
  name: string;
  phone: string;
  color: string;
}

interface ContactsContextType {
  contacts: Contact[];
  addContact: (name: string, phone: string) => void;
}

const ContactsContext = createContext<ContactsContextType>({
  contacts: [],
  addContact: () => {},
});

const defaultContacts: Contact[] = [
  { name: 'Alice Johnson', phone: '+1 234 567 890', color: '#3B82F6' },
  { name: 'Bob Smith', phone: '+1 987 654 321', color: '#8B5CF6' },
  { name: 'Charlie Brown', phone: '+1 555 123 456', color: '#F59E0B' },
  { name: 'Dad', phone: '+1 555 999 888', color: '#EF4444' },
  { name: 'Emma Watson', phone: '+1 555 444 333', color: '#EC4899' },
  { name: 'Frank Miller', phone: '+1 555 222 111', color: '#0D9488' },
  { name: 'Home Hub', phone: 'Internal', color: '#6366F1' },
];

export function ContactsProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);

  const addContact = (name: string, phone: string) => {
    const color = avatarColors[contacts.length % avatarColors.length];
    setContacts((prev) => [...prev, { name, phone, color }]);
  };

  return (
    <ContactsContext.Provider value={{ contacts, addContact }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  return useContext(ContactsContext);
}
