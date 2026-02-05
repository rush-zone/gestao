
import { 
  Workspace, WorkspaceType, Account, Transaction, 
  TransactionType, TransactionStatus, Category, 
  BankImportItem, Goal, User, UserRole 
} from './types';

export const mockWorkspaces: Workspace[] = [
  // Fix: Added ownerId to mock data to match Workspace interface
  { id: 'ws-personal', ownerId: 'u1', name: 'Minhas Finanças', type: WorkspaceType.PERSONAL, currency: 'BRL', regime: 'CAIXA' },
  { id: 'ws-business', ownerId: 'u2', name: 'Tech Solutions Ltda', type: WorkspaceType.BUSINESS, currency: 'BRL', regime: 'COMPETENCIA' }
];

export const mockUsers: User[] = [
  { id: 'u1', name: 'João Silva', email: 'joao@example.com', role: UserRole.OWNER, workspaceId: 'ws-personal' },
  { id: 'u2', name: 'Admin Tech', email: 'admin@techsolutions.com', role: UserRole.ADMIN, workspaceId: 'ws-business' },
  { id: 'u3', name: 'Maria Gestora', email: 'maria@techsolutions.com', role: UserRole.GESTOR, workspaceId: 'ws-business' },
  { id: 'u4', name: 'Carlos Operador', email: 'carlos@techsolutions.com', role: UserRole.OPERADOR, workspaceId: 'ws-business' },
];

export const mockAccounts: Account[] = [
  { id: 'acc-1', workspaceId: 'ws-personal', name: 'Nubank Corrente', type: 'BANK', balance: 4500.50, currency: 'BRL' },
  { id: 'acc-2', workspaceId: 'ws-personal', name: 'Carteira', type: 'CASH', balance: 120.00, currency: 'BRL' },
  { id: 'acc-3', workspaceId: 'ws-business', name: 'Itaú Business', type: 'BANK', balance: 85400.00, currency: 'BRL' },
  { id: 'acc-4', workspaceId: 'ws-business', name: 'Caixa Empresa', type: 'BANK', balance: 12300.25, currency: 'BRL' }
];

// Fix: Added missing 'type' property to Category entries
export const mockCategories: Category[] = [
  { id: 'cat-1', workspaceId: 'ws-personal', name: 'Alimentação', color: '#ef4444', type: TransactionType.EXPENSE },
  { id: 'cat-2', workspaceId: 'ws-personal', name: 'Moradia', color: '#3b82f6', type: TransactionType.EXPENSE },
  { id: 'cat-3', workspaceId: 'ws-personal', name: 'Lazer', color: '#10b981', type: TransactionType.EXPENSE },
  { id: 'cat-4', workspaceId: 'ws-business', name: 'Serviços', color: '#8b5cf6', type: TransactionType.EXPENSE },
  { id: 'cat-5', workspaceId: 'ws-business', name: 'Marketing', color: '#f59e0b', type: TransactionType.EXPENSE },
  { id: 'cat-6', workspaceId: 'ws-business', name: 'Folha Pagto', color: '#ec4899', type: TransactionType.EXPENSE },
];

export const generateTransactions = (wsId: string, count: number): Transaction[] => {
  const txs: Transaction[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(now.getDate() - (i % 30));
    txs.push({
      id: `tx-${wsId}-${i}`,
      workspaceId: wsId,
      accountId: wsId === 'ws-personal' ? 'acc-1' : 'acc-3',
      date: d.toISOString().split('T')[0],
      competenceDate: d.toISOString().split('T')[0],
      description: i % 2 === 0 ? `Pagamento item ${i}` : `Recebimento serviço ${i}`,
      value: Math.floor(Math.random() * 500) + 50,
      type: i % 3 === 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
      status: TransactionStatus.CONFIRMED,
      categoryId: wsId === 'ws-personal' ? 'cat-1' : 'cat-4',
      tags: ['tag1', 'tag2'],
      isRecurring: false
    });
  }
  return txs;
};

export const mockBankItems: BankImportItem[] = [
  { id: 'bi-1', workspaceId: 'ws-personal', date: '2024-05-10', description: 'SUPERMERCADO BH', value: -150.20, status: 'PENDING' },
  { id: 'bi-2', workspaceId: 'ws-personal', date: '2024-05-11', description: 'POSTO IPIRANGA', value: -200.00, status: 'PENDING' },
  { id: 'bi-3', workspaceId: 'ws-business', date: '2024-05-12', description: 'ALUGUEL ESCRITORIO', value: -2500.00, status: 'PENDING' },
];

export const mockGoals: Goal[] = [
  { id: 'g1', workspaceId: 'ws-personal', categoryId: 'cat-1', targetValue: 1200, currentValue: 850, period: '2024-05' },
  { id: 'g2', workspaceId: 'ws-personal', categoryId: 'cat-3', targetValue: 500, currentValue: 420, period: '2024-05' },
];
