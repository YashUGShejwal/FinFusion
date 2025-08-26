'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpDown } from 'lucide-react';
import { AppSummary } from '@/types';

interface AppSummaryCardProps {
  summary: AppSummary;
}

export default function AppSummaryCard({ summary }: AppSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isPositive = summary.absoluteReturn >= 0;

  return (
    <Card className="glass-card hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{summary.app}</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {summary.percentageReturn.toFixed(2)}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Net Investment</p>
            <p className="font-semibold text-blue-600">{formatCurrency(summary.netInvestment)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Current Value</p>
            <p className="font-semibold">{formatCurrency(summary.currentValue)}</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Returns</p>
          <p className={`font-bold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{formatCurrency(summary.absoluteReturn)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Deposits</p>
              <p className="text-sm font-medium">{formatCurrency(summary.totalDeposits)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Withdrawals</p>
              <p className="text-sm font-medium">{formatCurrency(summary.totalWithdrawals)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}