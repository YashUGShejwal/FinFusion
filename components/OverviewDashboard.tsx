'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { AppSummary } from '@/types';
import { calculateOverallSummary } from '@/lib/calculations';

interface OverviewDashboardProps {
  summaries: AppSummary[];
}

export default function OverviewDashboard({ summaries }: OverviewDashboardProps) {
  const overall = calculateOverallSummary(summaries);
  const overallReturn = overall.currentValue - overall.netInvestment;
  const overallReturnPercentage = overall.netInvestment > 0 ? (overallReturn / overall.netInvestment) * 100 : 0;
  const isPositive = overallReturn >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (summaries.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p>Add some transactions and portfolio values to see your overview.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(overall.netInvestment)}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(overall.totalDeposits)} deposits - {formatCurrency(overall.totalWithdrawals)} withdrawals
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(overall.currentValue)}</div>
          <p className="text-xs text-muted-foreground">
            Across {summaries.length} investment {summaries.length === 1 ? 'app' : 'apps'}
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{formatCurrency(overallReturn)}
          </div>
          <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{overallReturnPercentage.toFixed(2)}% return
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
          {(() => {
            if (summaries.length === 0) return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
            
            const best = summaries.reduce((best, current) => 
              current.percentageReturn > best.percentageReturn ? current : best
            , summaries[0]);
            const isPositive = best?.percentageReturn && best.percentageReturn > 0;
            
            return isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            );
          })()}
        </CardHeader>
        <CardContent>
          {(() => {
            if (summaries.length === 0) {
              return (
                <>
                  <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                  <p className="text-xs text-muted-foreground">No data</p>
                </>
              );
            }
            
            const best = summaries.reduce((best, current) => 
              current.percentageReturn > best.percentageReturn ? current : best
            , summaries[0]);
            const isPositive = best?.percentageReturn && best.percentageReturn > 0;
            
            return (
              <>
                <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {best?.app || 'N/A'}
                </div>
                <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{best?.percentageReturn.toFixed(2) || '0'}% return
                </p>
              </>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}