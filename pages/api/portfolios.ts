import { NextApiRequest, NextApiResponse } from 'next';
import { getPortfolios, addPortfolio, deletePortfolio } from '@/lib/storage';
import { PortfolioSnapshot } from '@/types';

// Returns today's local date as YYYY-MM-DD
function todayLocalISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Resolves date input to an ISO timestamp.
// - If the chosen date is today → use the actual current time so the display is accurate.
// - If it's a historical/future date → use noon UTC of that date (time is meaningless for backfill).
// - If no date given → actual current time.
function toSnapshotDate(dateInput: string | undefined): string {
  const now = new Date();
  const today = todayLocalISO();

  if (!dateInput || typeof dateInput !== 'string') {
    return now.toISOString();
  }

  const trimmed = dateInput.trim();
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? trimmed
    : trimmed.includes('T')
      ? trimmed.split('T')[0]
      : null;

  if (dateOnly) {
    // Today → real current timestamp; historical → noon UTC of that date
    return dateOnly === today
      ? now.toISOString()
      : new Date(`${dateOnly}T12:00:00.000Z`).toISOString();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return now.toISOString();
  }
  return parsed.toISOString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const portfolios = await getPortfolios();
        res.status(200).json(portfolios);
        break;

      case 'POST': {
        const app = typeof req.body?.app === 'string' ? req.body.app.trim() : '';
        const currentValue =
          typeof req.body?.currentValue === 'number'
            ? req.body.currentValue
            : parseFloat(req.body?.currentValue);
        const dateInput = typeof req.body?.date === 'string' ? req.body.date : undefined;

        if (!app) {
          res.status(400).json({ error: 'app is required and must be a non-empty string' });
          return;
        }
        if (Number.isNaN(currentValue) || req.body?.currentValue === undefined || req.body?.currentValue === null) {
          res.status(400).json({ error: 'currentValue is required and must be a valid number' });
          return;
        }
        if (currentValue < 0) {
          res.status(400).json({ error: 'currentValue must be >= 0' });
          return;
        }
        if (dateInput) {
          const parsed = new Date(dateInput.trim());
          if (Number.isNaN(parsed.getTime())) {
            res.status(400).json({ error: 'date must be a valid date (e.g. YYYY-MM-DD or ISO string)' });
            return;
          }
        }

        const date = toSnapshotDate(dateInput);
        const newPortfolio: PortfolioSnapshot = {
          id: Date.now().toString(),
          app,
          date,
          currentValue,
        };
        await addPortfolio(newPortfolio);
        res.status(201).json(newPortfolio);
        break;
      }

      case 'DELETE': {
        const id = typeof req.query?.id === 'string' ? req.query.id : null;
        if (!id) {
          res.status(400).json({ error: 'id query parameter is required' });
          return;
        }
        await deletePortfolio(id);
        res.status(200).json({ success: true });
        break;
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}