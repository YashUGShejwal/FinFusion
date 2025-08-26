import { NextApiRequest, NextApiResponse } from 'next';
import { getPortfolios, addPortfolio } from '@/lib/storage';
import { PortfolioSnapshot } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const portfolios = await getPortfolios();
        res.status(200).json(portfolios);
        break;

      case 'POST':
        const newPortfolio: PortfolioSnapshot = {
          id: Date.now().toString(),
          app: req.body.app,
          date: new Date().toISOString(),
          currentValue: parseFloat(req.body.currentValue),
        };
        await addPortfolio(newPortfolio);
        res.status(201).json(newPortfolio);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}