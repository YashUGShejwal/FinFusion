'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, TrendingUp, Target } from 'lucide-react';
import TransactionForm from '@/components/TransactionForm';
import PortfolioInput from '@/components/PortfolioInput';
import AppSummaryCard from '@/components/AppSummaryCard';
import FilterBar from '@/components/FilterBar';
import OverviewDashboard from '@/components/OverviewDashboard';
import TransactionList from '@/components/TransactionList';
import { Transaction, PortfolioSnapshot, AppSummary, FilterOptions } from '@/types';
import { calculateAppSummary } from '@/lib/calculations';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioSnapshot[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, portfoliosRes] = await Promise.all([
          fetch('/api/transactions'),
          fetch('/api/portfolios'),
        ]);
        
        const transactionsData = await transactionsRes.json();
        const portfoliosData = await portfoliosRes.json();
        
        setTransactions(transactionsData);
        setPortfolios(portfoliosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add transaction
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      
      if (response.ok) {
        const newTransaction = await response.json();
        setTransactions(prev => [...prev, newTransaction]);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Update portfolio
  const handleUpdatePortfolio = async (portfolio: Omit<PortfolioSnapshot, 'id' | 'date'>) => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolio),
      });
      
      if (response.ok) {
        const newPortfolio = await response.json();
        setPortfolios(prev => {
          const filtered = prev.filter(p => p.app !== portfolio.app);
          return [...filtered, newPortfolio];
        });
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.app && transaction.app !== filters.app) return false;
    if (filters.dateFrom && transaction.date < filters.dateFrom) return false;
    if (filters.dateTo && transaction.date > filters.dateTo) return false;
    return true;
  });

  // Calculate summaries
  const apps = [...new Set(transactions.map(t => t.app))];
  const summaries: AppSummary[] = apps.map(app => 
    calculateAppSummary(app, filteredTransactions, portfolios)
  ).sort((a, b) => b.currentValue - a.currentValue);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="hero-gradient text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Fin<span className="text-yellow-300">Fusion</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-2">
              Investment Portfolio Tracker
            </p>
            <p className="text-blue-200">
              Track your investments across multiple apps with ease
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-1/2 mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <OverviewDashboard summaries={summaries} />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">App Performance</h2>
              </div>
              
              <FilterBar filters={filters} onFiltersChange={setFilters} />
              
              {summaries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {summaries.map((summary) => (
                    <AppSummaryCard key={summary.app} summary={summary} />
                  ))}
                </div>
              ) : (
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Investment Data</h3>
                      <p>Add transactions and portfolio values to see your performance.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TransactionForm onAdd={handleAddTransaction} />
              <TransactionList 
                transactions={filteredTransactions} 
                onDelete={handleDeleteTransaction} 
              />
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PortfolioInput onUpdate={handleUpdatePortfolio} />
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Current Portfolio Values</CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolios.length > 0 ? (
                    <div className="space-y-3">
                      {portfolios.map((portfolio) => (
                        <div
                          key={portfolio.app}
                          className="flex justify-between items-center p-3 rounded-lg bg-background/50 border"
                        >
                          <span className="font-medium">{portfolio.app}</span>
                          <span className="font-semibold text-green-600">
                            ₹{portfolio.currentValue.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No portfolio values added yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}