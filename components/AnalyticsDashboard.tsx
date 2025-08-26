'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, PortfolioSnapshot, AppSummary, FilterOptions } from '@/types';
import { PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  transactions: Transaction[];
  portfolios: PortfolioSnapshot[];
  summaries: AppSummary[];
  filters: FilterOptions;
}

export default function AnalyticsDashboard({ portfolios, summaries }: AnalyticsDashboardProps) {
  // Portfolio allocation pie chart data
  const totalCurrentValue = summaries.reduce((sum, summary) => sum + summary.currentValue, 0);
  const portfolioAllocation = summaries.map((summary, index) => ({
    name: summary.app,
    value: summary.currentValue,
    percentage: totalCurrentValue > 0 ? (summary.currentValue / totalCurrentValue) * 100 : 0,
    color: `hsl(${(index * 60) % 360}, 70%, 60%)`
  })).filter(item => item.value > 0);

  // Portfolio value trends over time - prepare data for line chart
  const uniqueApps = Array.from(new Set(portfolios.map(p => p.app)));
  
  // Get all unique dates and sort them
  const allDates = Array.from(new Set(portfolios.map(p => p.date))).sort();
  
  // Create data structure for each app's timeline
  const appTimelines = uniqueApps.reduce((acc, app) => {
    const appPortfolios = portfolios.filter(p => p.app === app).sort((a, b) => a.date.localeCompare(b.date));
    acc[app] = appPortfolios;
    return acc;
  }, {} as Record<string, PortfolioSnapshot[]>);
  
  // Convert to array format for Recharts - only include dates that have data
  const lineChartData = allDates.map(date => {
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
    
    const dataPoint: any = {
      date: formattedDate,
      fullDate: date
    };
    
    // For each app, find the current value at this date or carry forward from previous
    uniqueApps.forEach(app => {
      const appData = appTimelines[app];
      const exactMatch = appData.find(p => p.date === date);
      
      if (exactMatch) {
        // If we have data for this exact date, use it
        dataPoint[app] = exactMatch.currentValue;
      } else {
        // Find the most recent data before this date
        const previousData = appData.filter(p => p.date < date).sort((a, b) => b.date.localeCompare(a.date))[0];
        if (previousData) {
          dataPoint[app] = previousData.currentValue;
        }
        // If no previous data exists, don't add this app to this data point (will be undefined)
      }
    });
    
    return dataPoint;
  }).filter(dataPoint => {
    // Only include data points that have at least one app with actual data
    return uniqueApps.some(app => dataPoint[app] !== undefined);
  });

  // Colors for line chart
  const lineColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', 
    '#d084d0', '#ffb347', '#87d068', '#ff6b6b', '#4ecdc4'
  ];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p>{data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Portfolio Analytics</h1>
        <p className="text-muted-foreground">Portfolio allocation and value trends</p>
      </div>

      {/* Top Section: Pie Chart and App List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Allocation Pie Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-500" />
              Portfolio Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {portfolioAllocation.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <PieChartIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No portfolio data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* App List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-green-500" />
              Broker Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            {portfolioAllocation.length > 0 ? (
              <div className="space-y-4 h-80 overflow-y-auto">
                {portfolioAllocation.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border hover:bg-white/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <span className="font-medium text-lg">{item.name}</span>
                        <div className="text-sm text-muted-foreground">
                          {item.percentage.toFixed(1)}% of portfolio
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">{formatCurrency(item.value)}</div>
                      <div className="text-sm text-muted-foreground">Current Value</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <PieChartIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No broker apps data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Line Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-blue-500" />
            Portfolio Value Trends Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lineChartData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {uniqueApps.map((app, index) => (
                    <Line
                      key={app}
                      type="monotone"
                      dataKey={app}
                      stroke={lineColors[index % lineColors.length]}
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <LineChartIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No portfolio trend data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
