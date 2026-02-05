
export enum WorkspaceType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GESTOR = 'GESTOR',
  OPERADOR = 'OPERADOR',
  VISUALIZADOR = 'VISUALIZADOR',
  OWNER = 'OWNER'
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum TransactionStatus {
  CONFIRMED = 'CONFIRMED',
  PROJECTED = 'PROJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  workspaceId?: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INVITED';
}

export interface Investment {
  id: string;
  workspaceId: string;
  name: string;
  symbol: string;
  type: 'STOCK' | 'FIXED' | 'CRYPTO' | 'FII';
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  institution: string;
}

export interface CostCenter {
  id: string;
  workspaceId: string;
  name: string;
  type: 'COST' | 'PROFIT';
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  budget: number;
  spent: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
}

export interface Contact {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  phone?: string;
  document?: string; // CPF/CNPJ
  type: 'CLIENT' | 'SUPPLIER' | 'BOTH';
}

export interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
}

export interface PaymentMethod {
  id: string;
  workspaceId: string;
  name: string;
  type: 'CASH' | 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'OTHER';
}

export interface PayableReceivable {
  id: string;
  workspaceId: string;
  title: string;
  amount: number;
  dueDate: string;
  type: 'PAYABLE' | 'RECEIVABLE';
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  categoryId?: string;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  type: WorkspaceType;
  currency: string;
  regime: 'CAIXA' | 'COMPETENCIA';
}

export interface TransactionSplit {
  id: string;
  categoryId: string;
  value: number;
  description?: string;
}

export interface Transaction {
  id: string;
  workspaceId: string;
  accountId: string;
  date: string;
  competenceDate: string;
  description: string;
  value: number;
  type: TransactionType;
  status: TransactionStatus;
  categoryId: string;
  tags: string[];
  isRecurring: boolean;
  recurrenceFreq?: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceStartDate?: string;
  recurrenceEndDate?: string;
  splits?: TransactionSplit[];
}

export interface Account {
  id: string;
  workspaceId: string;
  name: string;
  type: 'BANK' | 'CASH' | 'INVESTMENT';
  balance: number;
  currency: string;
}

export interface Category {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
  type: TransactionType;
}

export interface BankImportItem {
  id: string;
  workspaceId: string;
  date: string;
  description: string;
  value: number;
  status: 'PENDING' | 'CONCILED' | 'IGNORED';
}

export interface Goal {
  id: string;
  workspaceId: string;
  categoryId: string;
  targetValue: number;
  currentValue: number;
  period: string;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}
