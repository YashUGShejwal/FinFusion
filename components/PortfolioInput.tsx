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

interface PortfolioInputProps {
  onUpdate: (portfolio: Omit<PortfolioSnapshot, 'id' | 'date'>) => void;
}

export default function PortfolioInput({ onUpdate }: PortfolioInputProps) {
  const [formData, setFormData] = useState({
    app: '',
    currentValue: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.app || !formData.currentValue) return;

    onUpdate({
      app: formData.app,
      currentValue: parseFloat(formData.currentValue),
    });

    setFormData({
      app: '',
      currentValue: '',
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

          <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
            Add Snapshot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}