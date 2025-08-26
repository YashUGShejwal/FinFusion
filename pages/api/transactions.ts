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

      case 'POST':
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          date: req.body.date,
          app: req.body.app,
          type: req.body.type,
          amount: parseFloat(req.body.amount),
          note: req.body.note || undefined,
        };
        await addTransaction(newTransaction);
        res.status(201).json(newTransaction);
        break;

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