import { createContext, useContext, useState, ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export interface BillingConfig {
  pricePerMinute: number;
  minimumCharge: number;
  currency: Currency;
  billingEnabled: boolean;
  freeMinutes: number;
  maxCallDuration: number;
  dailySpendingCap: number;
  taxRate: number;
  autoTopUpEnabled: boolean;
  autoTopUpThreshold: number;
  autoTopUpAmount: number;
}

interface BillingContextType {
  config: BillingConfig;
  updateConfig: (data: Partial<BillingConfig>) => void;
}

const defaultConfig: BillingConfig = {
  pricePerMinute: 50,
  minimumCharge: 0,
  currency: { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
  billingEnabled: true,
  freeMinutes: 0,
  maxCallDuration: 60,
  dailySpendingCap: 0,
  taxRate: 0,
  autoTopUpEnabled: false,
  autoTopUpThreshold: 500,
  autoTopUpAmount: 2000,
};

const BillingContext = createContext<BillingContextType>({
  config: defaultConfig,
  updateConfig: () => {},
});

export function BillingProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<BillingConfig>(defaultConfig);

  const updateConfig = (data: Partial<BillingConfig>) => {
    setConfig((prev) => ({ ...prev, ...data }));
  };

  return (
    <BillingContext.Provider value={{ config, updateConfig }}>
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  return useContext(BillingContext);
}
