import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'topup' | 'call' | 'refund' | 'transfer';
  recipientName?: string;
  recipientPhone?: string;
  amount: number;
  description: string;
  date: Date;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  incomeBalance: number;
  topUp: (amount: number) => void;
  deduct: (amount: number, description: string) => boolean;
  sendTransfer: (amount: number, recipientName: string, recipientPhone: string) => boolean;
  adminTopUp: (amount: number) => void;
  currency: { code: string; symbol: string; label: string };
}

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  incomeBalance: 0,
  topUp: () => {},
  deduct: () => false,
  sendTransfer: () => false,
  adminTopUp: () => {},
  currency: { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
});

const initialBalance = 2500;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(initialBalance);
  const [incomeBalance, setIncomeBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'topup',
      amount: 2500,
      description: 'Initial wallet funding',
      date: new Date(Date.now() - 86400000 * 2),
    },
  ]);

  const topUp = useCallback((amount: number) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: 'topup',
        amount,
        description: `Wallet top-up`,
        date: new Date(),
      },
      ...prev,
    ]);
  }, []);

  const deduct = useCallback((amount: number, description: string): boolean => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);
    setIncomeBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: 'call',
        amount,
        description,
        date: new Date(),
      },
      ...prev,
    ]);
    return true;
  }, [balance]);

  const sendTransfer = useCallback((amount: number, recipientName: string, recipientPhone: string): boolean => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: 'transfer',
        amount,
        description: `Transfer to ${recipientName}`,
        recipientName,
        recipientPhone,
        date: new Date(),
      },
      ...prev,
    ]);
    return true;
  }, [balance]);

  const adminTopUp = useCallback((amount: number) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: Date.now().toString(),
        type: 'topup',
        amount,
        description: 'Admin top-up',
        date: new Date(),
      },
      ...prev,
    ]);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        incomeBalance,
        topUp,
        deduct,
        sendTransfer,
        adminTopUp,
        currency: { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
