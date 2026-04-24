'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { INVESTMENT_APPS } from '@/lib/calculations';
import { PortfolioSnapshot } from '@/types';

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export type PortfolioUpdatePayload = Omit<PortfolioSnapshot, 'id'> & { date?: string };

interface PortfolioInputProps {
  onUpdate: (portfolio: PortfolioUpdatePayload) => void;
}

export default function PortfolioInput({ onUpdate }: PortfolioInputProps) {
  const [formData, setFormData] = useState({
    app: '',
    currentValue: '',
    date: getTodayString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.app || !formData.currentValue) return;

    onUpdate({
      app: formData.app,
      currentValue: parseFloat(formData.currentValue),
      date: formData.date,
    });

    setFormData({
      app: '',
      currentValue: '',
      date: getTodayString(),
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          Add Portfolio Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Add a new portfolio snapshot to track your investment value over time. All historical snapshots are preserved.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portfolio-app">Investment App</Label>
            <Select value={formData.app} onValueChange={(value) => setFormData({ ...formData, app: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select app" />
              </SelectTrigger>
              <SelectContent>
                {INVESTMENT_APPS.map((app) => (
                  <SelectItem key={app} value={app}>
                    {app}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="snapshot-date">Snapshot date</Label>
            <Input
              id="snapshot-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use a past date to backfill historical snapshots.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-value">Current Portfolio Value (₹)</Label>
            <Input
              id="current-value"
              type="number"
              step="0.01"
              placeholder="Enter current value"
              value={formData.currentValue}
              onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full theme-gradient hover:theme-gradient-hover text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            Add Snapshot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}