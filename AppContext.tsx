
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Workspace, User, Transaction, Account, Category, BankImportItem, 
  Goal, AuditLog, WorkspaceType, UserRole, WorkspaceMember, CostCenter, Project, 
  Investment, PayableReceivable, TransactionType, TransactionStatus, Contact, Tag, PaymentMethod 
} from './types';
import { useAuth } from './AuthContext';
import { supabase } from './lib/supabase';

interface AppContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (ws: Workspace) => void;
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  bankItems: BankImportItem[];
  goals: Goal[];
  auditLogs: AuditLog[];
  members: WorkspaceMember[];
  costCenters: CostCenter[];
  projects: Project[];
  investments: Investment[];
  payables: PayableReceivable[];
  contacts: Contact[];
  tags: Tag[];
  paymentMethods: PaymentMethod[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  addTransaction: (tx: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  concileBankItem: (itemId: string, txId?: string) => void;
  logAudit: (action: string, details: string) => void;
  isOnboarded: boolean;
  completeOnboarding: (ws: any) => Promise<void>;
  addAccount: (acc: Partial<Account>) => Promise<void>;
  addMember: (m: Omit<WorkspaceMember, 'id' | 'workspaceId' | 'status'>) => void;
  removeMember: (id: string) => void;
  addCostCenter: (cc: Omit<CostCenter, 'id' | 'workspaceId'>) => Promise<void>;
  removeCostCenter: (id: string) => Promise<void>;
  addProject: (p: Omit<Project, 'id' | 'workspaceId' | 'spent'>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  addInvestment: (inv: Omit<Investment, 'id' | 'workspaceId'>) => Promise<void>;
  removeInvestment: (id: string) => Promise<void>;
  addPayable: (p: Omit<PayableReceivable, 'id' | 'workspaceId'>) => Promise<void>;
  markPayablePaid: (id: string) => Promise<void>;
  removePayable: (id: string) => Promise<void>;
  addContact: (c: Omit<Contact, 'id' | 'workspaceId'>) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  addTag: (t: Omit<Tag, 'id' | 'workspaceId'>) => void;
  removeTag: (id: string) => void;
  addCategory: (c: Omit<Category, 'id' | 'workspaceId'>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addPaymentMethod: (pm: Omit<PaymentMethod, 'id' | 'workspaceId'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bankItems, setBankItems] = useState<BankImportItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [payables, setPayables] = useState<PayableReceivable[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  // Mapeamento Snake Case (DB) -> Camel Case (App)
  const mapData = (data: any[]) => data?.map(item => {
    const mapped: any = {};
    for (const key in item) {
      const camelKey = key.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
      mapped[camelKey] = item[key];
    }
    return mapped;
  }) || [];

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: wsData } = await supabase.from('workspaces').select('*');
      if (wsData && wsData.length > 0) {
        const mappedWs = mapData(wsData);
        setWorkspaces(mappedWs);
        setCurrentWorkspace(mappedWs[0]);

        const wsId = wsData[0].id;
        const [acc, cat, tx, cc, proj, inv, pay, cont] = await Promise.all([
          supabase.from('accounts').select('*').eq('workspace_id', wsId),
          supabase.from('categories').select('*').eq('workspace_id', wsId),
          supabase.from('transactions').select('*').eq('workspace_id', wsId).order('date', { ascending: false }),
          supabase.from('cost_centers').select('*').eq('workspace_id', wsId),
          supabase.from('projects').select('*').eq('workspace_id', wsId),
          supabase.from('investments').select('*').eq('workspace_id', wsId),
          supabase.from('payables_receivables').select('*').eq('workspace_id', wsId),
          supabase.from('contacts').select('*').eq('workspace_id', wsId)
        ]);

        if (acc.data) setAccounts(mapData(acc.data));
        if (cat.data) setCategories(mapData(cat.data));
        if (tx.data) setTransactions(mapData(tx.data));
        if (cc.data) setCostCenters(mapData(cc.data));
        if (proj.data) setProjects(mapData(proj.data));
        if (inv.data) setInvestments(mapData(inv.data));
        if (pay.data) setPayables(mapData(pay.data));
        if (cont.data) setContacts(mapData(cont.data));
      }
    };

    fetchData();
  }, [user]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const completeOnboarding = async (wsConfig: any) => {
    if (!user) return;
    const { data, error } = await supabase.from('workspaces').insert([{
      name: wsConfig.name,
      type: wsConfig.type,
      currency: wsConfig.currency,
      regime: wsConfig.regime,
      owner_id: user.id
    }]).select();
    
    if (data) {
      const mapped = mapData(data);
      setWorkspaces(mapped);
      setCurrentWorkspace(mapped[0]);
    }
  };

  const addTransaction = async (tx: Partial<Transaction>) => {
    if (!currentWorkspace) return;
    const dbTx = {
      workspace_id: currentWorkspace.id,
      account_id: tx.accountId || null,
      category_id: tx.categoryId || null,
      date: tx.date || new Date().toISOString().split('T')[0],
      description: tx.description || 'Lançamento',
      value: tx.value || 0,
      type: tx.type || TransactionType.EXPENSE,
      status: tx.status || TransactionStatus.CONFIRMED,
      is_recurring: tx.isRecurring || false
    };
    const { data } = await supabase.from('transactions').insert([dbTx]).select();
    if (data) setTransactions(prev => [mapData(data)[0], ...prev]);
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addAccount = async (acc: Partial<Account>) => {
    if (!currentWorkspace) return;
    const { data } = await supabase.from('accounts').insert([{
      name: acc.name,
      type: acc.type,
      balance: acc.balance,
      currency: acc.currency,
      workspace_id: currentWorkspace.id
    }]).select();
    if (data) setAccounts(prev => [...prev, mapData(data)[0]]);
  };

  const addCategory = async (c: any) => {
    if (!currentWorkspace) return;
    const { data } = await supabase.from('categories').insert([{
      name: c.name,
      color: c.color,
      type: c.type,
      workspace_id: currentWorkspace.id
    }]).select();
    if (data) setCategories(prev => [...prev, mapData(data)[0]]);
  };

  const removeCategory = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addProject = async (p: any) => {
    if (!currentWorkspace) return;
    const { data } = await supabase.from('projects').insert([{
      name: p.name,
      budget: p.budget,
      status: p.status,
      workspace_id: currentWorkspace.id
    }]).select();
    if (data) setProjects(prev => [...prev, mapData(data)[0]]);
  };

  const removeProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addCostCenter = async (cc: any) => {
    if (!currentWorkspace) return;
    const { data } = await supabase.from('cost_centers').insert([{
      name: cc.name,
      type: cc.type,
      workspace_id: currentWorkspace.id
    }]).select();
    if (data) setCostCenters(prev => [...prev, mapData(data)[0]]);
  };

  const removeCostCenter = async (id: string) => {
    await supabase.from('cost_centers').delete().eq('id', id);
    setCostCenters(prev => prev.filter(c => c.id !== id));
  };

  const addInvestment = async (inv: any) => {
    if (!currentWorkspace) return;
    const { data } = await supabase.from('investments').insert([{
      name: inv.name,
      symbol: inv.symbol,
      type: inv.type,
      quantity: inv.quantity,
      average_price: inv.averagePrice,
      current_price: inv.currentPrice,
      institution: inv.institution,
      workspace_id: currentWorkspace.id
    }]).select();
    if (data) setInvestments(prev => [...prev, mapData(data)[0]]);
  };

  const removeInvestment = async (id: string) => {
    await supabase.from('investments').delete().eq('id', id);
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  const addPayable = async (p: any) => {
    if (!currentWorkspace) return;
    const { data } = await supabase.from('payables_receivables').insert([{
      title: p.title,
      amount: p.amount,
      due_date: p.dueDate,
      type: p.type,
      status: p.status,
      workspace_id: currentWorkspace.id
    }]).select();
    if (data) setPayables(prev => [...prev, mapData(data)[0]]);
  };

  const markPayablePaid = async (id: string) => {
    const { data } = await supabase.from('payables_receivables').update({ status: 'PAID' }).eq('id', id).select();
    if (data) setPayables(prev => prev.map(p => p.id === id ? mapData(data)[0] : p));
  };

  const removePayable = async (id: string) => {
    await supabase.from('payables_receivables').delete().eq('id', id);
    setPayables(prev => prev.filter(p => p.id !== id));
  };

  const addContact = async (c: any) => {
    if (!currentWorkspace) return;
    const { data } = await supabase.from('contacts').insert([{
      name: c.name,
      email: c.email,
      phone: c.phone,
      document: c.document,
      type: c.type,
      workspace_id: currentWorkspace.id
    }]).select();
    if (data) setContacts(prev => [...prev, mapData(data)[0]]);
  };

  const removeContact = async (id: string) => {
    await supabase.from('contacts').delete().eq('id', id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const logAudit = (action: string, details: string) => console.log(`[Audit] ${action}: ${details}`);
  const addMember = (m: any) => {};
  const removeMember = (id: string) => {};
  const addTag = (t: any) => {};
  const removeTag = (id: string) => {};
  const addPaymentMethod = (pm: any) => {};
  const concileBankItem = (itemId: string) => {};

  return (
    <AppContext.Provider value={{
      workspaces, currentWorkspace, setCurrentWorkspace,
      transactions, accounts, categories, bankItems, goals, auditLogs, members, costCenters, projects, investments, payables,
      contacts, tags, paymentMethods,
      darkMode, toggleDarkMode, addTransaction, deleteTransaction,
      concileBankItem, logAudit, isOnboarded: workspaces.length > 0, completeOnboarding, addAccount,
      addMember, removeMember, addCostCenter, removeCostCenter, addProject, removeProject, addInvestment, removeInvestment,
      addPayable, markPayablePaid, removePayable, addContact, removeContact, addTag, removeTag, addCategory, removeCategory, addPaymentMethod
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
