import { NextApiRequest, NextApiResponse } from 'next';
import { getTransactions, addTransaction, deleteTransaction } from '@/lib/storage';
import { Transaction } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const transactions = await getTransactions();
        res.status(200).json(transactions);
        break;

      case 'POST': {
        const date = typeof req.body?.date === 'string' ? req.body.date.trim() : '';
        const app = typeof req.body?.app === 'string' ? req.body.app.trim() : '';
        const type = req.body?.type;
        const amount =
          typeof req.body?.amount === 'number'
            ? req.body.amount
            : parseFloat(req.body?.amount);
        const note =
          typeof req.body?.note === 'string' ? req.body.note.trim() || undefined : undefined;

        if (!date) {
          res.status(400).json({ error: 'date is required' });
          return;
        }
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
          res.status(400).json({ error: 'date must be a valid date (e.g. ISO string)' });
          return;
        }
        if (!app) {
          res.status(400).json({ error: 'app is required and must be a non-empty string' });
          return;
        }
        if (type !== 'Deposit' && type !== 'Withdrawal') {
          res.status(400).json({ error: 'type must be "Deposit" or "Withdrawal"' });
          return;
        }
        if (Number.isNaN(amount) || req.body?.amount === undefined || req.body?.amount === null) {
          res.status(400).json({ error: 'amount is required and must be a valid number' });
          return;
        }

        const newTransaction: Transaction = {
          id: Date.now().toString(),
          date: parsedDate.toISOString(),
          app,
          type,
          amount,
          note,
        };
        await addTransaction(newTransaction);
        res.status(201).json(newTransaction);
        break;
      }

      case 'DELETE':
        const { id } = req.query;
        if (typeof id === 'string') {
          await deleteTransaction(id);
          res.status(200).json({ success: true });
        } else {
          res.status(400).json({ error: 'Invalid ID' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}