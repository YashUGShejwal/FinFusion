export interface Transaction {
  id: string;
  date: string; // ISO string
  app: string;
  type: 'Deposit' | 'Withdrawal';
  amount: number;
  note?: string;
}

export interface PortfolioSnapshot {
  id: string;
  app: string;
  date: string;
  currentValue: number;
}

export interface AppSummary {
  app: string;
  totalDeposits: number;
  totalWithdrawals: number;
  netInvestment: number;
  currentValue: number;
  absoluteReturn: number;
  percentageReturn: number;
}

export interface FilterOptions {
  apps?: string[];
  dateFrom?: string;
  dateTo?: string;
}