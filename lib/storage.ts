import { Transaction, PortfolioSnapshot } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const PORTFOLIOS_FILE = path.join(DATA_DIR, 'portfolios.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TRANSACTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  const transactions = await getTransactions();
  transactions.push(transaction);
  await saveTransactions(transactions);
}

export async function deleteTransaction(id: string): Promise<void> {
  const transactions = await getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  await saveTransactions(filtered);
}

// Portfolio Snapshots
export async function getPortfolios(): Promise<PortfolioSnapshot[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PORTFOLIOS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function savePortfolios(portfolios: PortfolioSnapshot[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PORTFOLIOS_FILE, JSON.stringify(portfolios, null, 2));
}

export async function addPortfolio(portfolio: PortfolioSnapshot): Promise<void> {
  const portfolios = await getPortfolios();
  // Remove existing entry for same app (keep only latest)
  const filtered = portfolios.filter(p => p.app !== portfolio.app);
  filtered.push(portfolio);
  await savePortfolios(filtered);
}