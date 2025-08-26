'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, PortfolioSnapshot, AppSummary, FilterOptions } from '@/types';
import { PieChart, LineChart } from 'lucide-react';

interface AnalyticsDashboardProps {
  transactions: Transaction[];
  portfolios: PortfolioSnapshot[];
  summaries: AppSummary[];
  filters: FilterOptions;
}

export default function AnalyticsDashboard({ portfolios, summaries }: AnalyticsDashboardProps) {
  // Portfolio allocation pie chart data
  const totalCurrentValue = summaries.reduce((sum, summary) => sum + summary.currentValue, 0);
  const portfolioAllocation = summaries.map(summary => ({
    app: summary.app,
    value: summary.currentValue,
    percentage: totalCurrentValue > 0 ? (summary.currentValue / totalCurrentValue) * 100 : 0
  })).filter(item => item.value > 0);

  // Portfolio value trends over time
  const portfolioTrends = portfolios.reduce((acc, portfolio) => {
    const date = portfolio.date;
    if (!acc[date]) {
      acc[date] = {};
    }
    acc[date][portfolio.app] = portfolio.currentValue;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const sortedDates = Object.keys(portfolioTrends).sort();
  const uniqueApps = Array.from(new Set(portfolios.map(p => p.app)));

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Portfolio Analytics</h1>
        <p className="text-muted-foreground">Portfolio allocation and value trends</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Allocation */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Portfolio Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {portfolioAllocation.length > 0 ? (
              <div className="space-y-4">
                {portfolioAllocation.map((item, index) => (
                  <div key={item.app} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)`
                        }}
                      />
                      <span className="font-medium">{item.app}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.value)}</div>
                      <div className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No portfolio data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Value Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-500" />
              Portfolio Value Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedDates.length > 0 ? (
              <div className="space-y-4">
                {sortedDates.map((date, index) => {
                  const dateData = portfolioTrends[date];
                  const totalValue = Object.values(dateData).reduce((sum, value) => sum + value, 0);
                  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <div key={date} className="p-3 rounded-lg bg-white/50 border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{formattedDate}</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(totalValue)}</span>
                      </div>
                      <div className="space-y-1">
                        {uniqueApps.map((app, appIndex) => {
                          const value = dateData[app] || 0;
                          if (value === 0) return null;
                          
                          return (
                            <div key={app} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: `hsl(${(appIndex * 60) % 360}, 70%, 60%)`
                                  }}
                                />
                                <span className="text-muted-foreground">{app}</span>
                              </div>
                              <span className="font-medium">{formatCurrency(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <LineChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No portfolio trend data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
