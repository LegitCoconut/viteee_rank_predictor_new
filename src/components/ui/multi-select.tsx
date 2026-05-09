'use client';

import * as React from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export interface MultiSelectOption<T extends string> {
  value: T;
  label: string;
}

interface MultiSelectProps<T extends string> {
  options: MultiSelectOption<T>[];
  value: T[];
  onChange: (next: T[]) => void;
  placeholder?: string;
  allLabel?: string;
  className?: string;
  disabled?: boolean;
  maxBadges?: number;
}

export function MultiSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  allLabel = 'All',
  className,
  disabled,
  maxBadges = 2,
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const allSelected = value.length === 0 || value.length === options.length;

  const toggle = (v: T) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  const selectAll = () => onChange([]);
  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const selected = options.filter((o) => value.includes(o.value));
  const showBadges = !allSelected && selected.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          aria-expanded={open}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1 overflow-hidden">
            {showBadges ? (
              <>
                {selected.slice(0, maxBadges).map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="rounded-md px-1.5 py-0 text-xs font-normal"
                  >
                    {opt.label}
                  </Badge>
                ))}
                {selected.length > maxBadges && (
                  <Badge variant="outline" className="rounded-md px-1.5 py-0 text-xs">
                    +{selected.length - maxBadges}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">
                {allSelected ? allLabel : placeholder}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {showBadges && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear selection"
                onClick={clear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange([]);
                  }
                }}
                className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1"
        align="start"
        sideOffset={4}
      >
        <button
          type="button"
          onClick={selectAll}
          className={cn(
            'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
            allSelected && 'bg-accent/50 font-medium',
          )}
        >
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
              allSelected && 'bg-primary text-primary-foreground',
            )}
          >
            {allSelected && <Check className="h-3 w-3" />}
          </span>
          {allLabel}
        </button>
        <div className="my-1 h-px bg-border" />
        <div className="max-h-64 overflow-y-auto">
          {options.map((opt) => {
            const checked = !allSelected && value.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    checked && 'bg-primary text-primary-foreground',
                  )}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span className="flex-1 text-left">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
