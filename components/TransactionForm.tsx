'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle } from 'lucide-react';
import { INVESTMENT_APPS } from '@/lib/calculations';
import { Transaction } from '@/types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    app: '',
    type: 'Deposit' as 'Deposit' | 'Withdrawal',
    amount: '',
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.app || !formData.amount) return;

    onAdd({
      date: new Date(formData.date).toISOString(),
      app: formData.app,
      type: formData.type,
      amount: parseFloat(formData.amount),
      note: formData.note || undefined,
    });

    setFormData({
      date: new Date().toISOString().split('T')[0],
      app: '',
      type: 'Deposit',
      amount: '',
      note: '',
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-500" />
          Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="app">Investment App</Label>
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
          </div>

          <div className="space-y-3">
            <Label>Transaction Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: 'Deposit' | 'Withdrawal') => setFormData({ ...formData, type: value })}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Deposit" id="deposit" />
                <Label htmlFor="deposit" className="text-green-600 font-medium">Deposit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Withdrawal" id="withdrawal" />
                <Label htmlFor="withdrawal" className="text-red-600 font-medium">Withdrawal</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this transaction"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full theme-gradient hover:theme-gradient-hover text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}