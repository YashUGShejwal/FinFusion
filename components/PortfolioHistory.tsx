'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { PortfolioSnapshot } from '@/types';

interface PortfolioHistoryProps {
  portfolios: PortfolioSnapshot[];
  filters?: {
    apps?: string[];
  };
}

export default function PortfolioHistory({ portfolios, filters }: PortfolioHistoryProps) {
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get latest portfolio value for each app
  const getLatestPortfolios = () => {
    const latestByApp = new Map<string, PortfolioSnapshot>();
    
    // Filter portfolios based on selected apps
    let filteredPortfolios = portfolios;
    if (filters?.apps && filters.apps.length > 0) {
      filteredPortfolios = portfolios.filter(p => filters.apps!.includes(p.app));
    }
    
    filteredPortfolios.forEach(portfolio => {
      const existing = latestByApp.get(portfolio.app);
      if (!existing || new Date(portfolio.date) > new Date(existing.date)) {
        latestByApp.set(portfolio.app, portfolio);
      }
    });
    
    return Array.from(latestByApp.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  // Get all snapshots for a specific app
  const getAppHistory = (app: string) => {
    return portfolios
      .filter(p => p.app === app)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const latestPortfolios = getLatestPortfolios();

  if (latestPortfolios.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Portfolio Values</h3>
            <p>Add portfolio values to see your current investments.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          Current Portfolio Values
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latestPortfolios.map((portfolio) => {
            const isExpanded = expandedApp === portfolio.app;
            const appHistory = getAppHistory(portfolio.app);
            
            return (
              <div key={portfolio.app} className="space-y-2">
                {/* Current Value Row */}
                <div
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors cursor-pointer"
                  onClick={() => setExpandedApp(isExpanded ? null : portfolio.app)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {portfolio.app}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(portfolio.date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      {formatCurrency(portfolio.currentValue)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* History Section */}
                {isExpanded && appHistory.length > 1 && (
                  <div className="ml-4 space-y-2">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      History ({appHistory.length} snapshots)
                    </div>
                    {appHistory.slice(1).map((snapshot) => (
                      <div
                        key={snapshot.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-border/30"
                      >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(snapshot.date)}
                        </div>
                        <span className="font-medium">
                          {formatCurrency(snapshot.currentValue)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
