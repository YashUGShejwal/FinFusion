'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { FilterOptions } from '@/types';
import { INVESTMENT_APPS } from '@/lib/calculations';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = (filters.apps && filters.apps.length > 0) || filters.dateFrom || filters.dateTo;

  const removeApp = (appToRemove: string) => {
    const currentApps = filters.apps || [];
    const newApps = currentApps.filter(app => app !== appToRemove);
    onFiltersChange({ 
      ...filters, 
      apps: newApps.length > 0 ? newApps : undefined 
    });
  };

  const handleAppSelect = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, apps: undefined });
    } else {
      onFiltersChange({ ...filters, apps: [value] });
    }
  };

  const getSelectedApp = () => {
    if (!filters.apps || filters.apps.length === 0) {
      return 'all';
    } else if (filters.apps.length === 1) {
      return filters.apps[0];
    } else {
      return 'multiple';
    }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Selected Apps Bubbles */}
      {filters.apps && filters.apps.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Selected Apps</Label>
          <div className="flex flex-wrap gap-2">
            {filters.apps.map((app) => (
              <Badge 
                key={app} 
                className="flex items-center gap-1 px-3 py-1 cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 shadow-md"
                onClick={() => removeApp(app)}
              >
                {app}
                <X className="w-3 h-3 hover:scale-110 transition-transform" />
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>App</Label>
          <Select
            value={getSelectedApp()}
            onValueChange={handleAppSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Apps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apps</SelectItem>
              {INVESTMENT_APPS.map((app) => (
                <SelectItem key={app} value={app}>
                  {app}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>From Date</Label>
          <Input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value || undefined })}
          />
        </div>

        <div className="space-y-2">
          <Label>To Date</Label>
          <Input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value || undefined })}
          />
        </div>
      </div>
    </div>
  );
}