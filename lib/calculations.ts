import { Transaction, PortfolioSnapshot, AppSummary } from '@/types';

export function calculateAppSummary(
  app: string,
  transactions: Transaction[],
  portfolios: PortfolioSnapshot[]
): AppSummary {
  const appTransactions = transactions.filter(t => t.app === app);
  const portfolio = portfolios.find(p => p.app === app);

  const totalDeposits = appTransactions
    .filter(t => t.type === 'Deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = appTransactions
    .filter(t => t.type === 'Withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const netInvestment = totalDeposits - totalWithdrawals;
  const currentValue = portfolio?.currentValue || 0;
  const absoluteReturn = currentValue - netInvestment;
  const percentageReturn = netInvestment > 0 ? (absoluteReturn / netInvestment) * 100 : 0;

  return {
    app,
    totalDeposits,
    totalWithdrawals,
    netInvestment,
    currentValue,
    absoluteReturn,
    percentageReturn,
  };
}

export function calculateOverallSummary(summaries: AppSummary[]) {
  return summaries.reduce(
    (acc, summary) => ({
      totalDeposits: acc.totalDeposits + summary.totalDeposits,
      totalWithdrawals: acc.totalWithdrawals + summary.totalWithdrawals,
      netInvestment: acc.netInvestment + summary.netInvestment,
      currentValue: acc.currentValue + summary.currentValue,
      absoluteReturn: acc.absoluteReturn + summary.absoluteReturn,
    }),
    {
      totalDeposits: 0,
      totalWithdrawals: 0,
      netInvestment: 0,
      currentValue: 0,
      absoluteReturn: 0,
    }
  );
}

export const INVESTMENT_APPS = [
  'Groww',
  'Groww SGB',
  'Groww MF',
  'Kotak Neo',
  'Dhan',
  'INDmoney US',
  'INDMoney Indian',
  'Zerodha Kite',
  'Other'
];