
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, PieChart, Download, Calendar, 
  ArrowUpRight, ArrowDownRight, FileText, 
  ChevronRight, Filter, Receipt, Scale
} from 'lucide-react';
import { useApp } from '../AppContext';
import { WorkspaceType, TransactionType, Transaction } from '../types';

const Reports: React.FC = () => {
  const { currentWorkspace, transactions, categories } = useApp();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DRE' | 'BALANCE' | 'TAX'>('OVERVIEW');

  // Explicitly type filteredTransactions to ensure Transaction properties are correctly inferred
  const filteredTransactions = useMemo<Transaction[]>(() => 
    transactions.filter((t: Transaction) => t.workspaceId === currentWorkspace.id),
    [transactions, currentWorkspace.id]
  );

  // Fix: Explicitly type and ensure numeric arithmetic for statsByCategory calculation
  const statsByCategory = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    filteredTransactions.filter((t: Transaction) => t.type === TransactionType.EXPENSE).forEach((t: Transaction) => {
      const categoryId = t.categoryId || 'uncategorized';
      const currentVal = map[categoryId] || 0;
      const transactionValue = Number(t.value) || 0;
      map[categoryId] = currentVal + transactionValue;
    });
    return map;
  }, [filteredTransactions]);

  // Fix: Ensure the accumulator and current value are treated as numbers in totalExpense reduce
  const totalExpense = useMemo<number>(() => 
    filteredTransactions
      .filter((t: Transaction) => t.type === TransactionType.EXPENSE)
      .reduce<number>((acc, t) => acc + (Number(t.value) || 0), 0),
    [filteredTransactions]
  );

  // Fix: Explicitly type dreData return object and ensure numeric arithmetic in calculations
  const dreData = useMemo<{ income: number; expense: number; net: number }>(() => {
    const income = filteredTransactions
      .filter((t: Transaction) => t.type === TransactionType.INCOME)
      .reduce<number>((acc, t) => acc + (Number(t.value) || 0), 0);
    const expense = filteredTransactions
      .filter((t: Transaction) => t.type === TransactionType.EXPENSE)
      .reduce<number>((acc, t) => acc + (Number(t.value) || 0), 0);
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currentWorkspace.currency }).format(val);

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Inteligência Financeira</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Dados analíticos reais extraídos do seu workspace.</p>
        </div>
        <button className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95">
          <Download size={20} /> Exportar Relatório
        </button>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} label="Visão Geral" icon={<PieChart size={18}/>} />
        <TabButton active={activeTab === 'DRE'} onClick={() => setActiveTab('DRE')} label="DRE / Resultados" icon={<BarChart3 size={18}/>} />
        <TabButton active={activeTab === 'BALANCE'} onClick={() => setActiveTab('BALANCE')} label="Balanço Patrimonial" icon={<Scale size={18}/>} />
        {currentWorkspace.type === WorkspaceType.PERSONAL && <TabButton active={activeTab === 'TAX'} onClick={() => setActiveTab('TAX')} label="Carnê-Leão" icon={<FileText size={18}/>} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           {activeTab === 'OVERVIEW' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
               <div className="bg-white dark:bg-slate-950 p-8 rounded-[40px] border-2 border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-black mb-8 flex items-center justify-between">
                    Composição de Gastos
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total: {formatCurrency(totalExpense)}</span>
                  </h3>
                  <div className="space-y-6">
                    {/* Fix: Explicitly cast value to number to ensure arithmetic operations work correctly */}
                    {Object.entries(statsByCategory).map(([catId, value]) => {
                      const numValue = Number(value);
                      const cat = categories.find(c => c.id === catId);
                      const percent = totalExpense > 0 ? (numValue / totalExpense) * 100 : 0;
                      return (
                        <CategoryBar 
                          key={catId} 
                          label={cat?.name || 'Geral'} 
                          percent={percent} 
                          color={cat?.color || '#cbd5e1'} 
                          amount={formatCurrency(numValue)} 
                        />
                      );
                    })}
                    {Object.keys(statsByCategory).length === 0 && (
                      <div className="text-center py-10 text-slate-400 italic">Nenhum gasto registrado para análise.</div>
                    )}
                  </div>
               </div>
             </div>
           )}

           {activeTab === 'DRE' && (
             <div className="bg-white dark:bg-slate-950 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-6">Demonstrativo de Resultados (Regime Misto)</th>
                      <th className="px-8 py-6 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800 font-bold">
                    <DRERow label="Receita Bruta (Entradas)" value={dreData.income} type="INCOME" />
                    <DRERow label="Despesas Operacionais (Saídas)" value={-dreData.expense} type="EXPENSE" />
                    <tr className="bg-slate-900 text-white">
                      <td className="px-8 py-6 font-black uppercase tracking-widest text-xs">Resultado Líquido do Período</td>
                      <td className={`px-8 py-6 text-right font-black ${dreData.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(dreData.net)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-8 bg-blue-50 dark:bg-blue-900/10 text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest leading-relaxed">
                   * Este relatório consolida todos os lançamentos confirmados no workspace atual. Para relatórios contábeis oficiais (Competência), utilize a data de competência no filtro global.
                </div>
             </div>
           )}

           {activeTab === 'BALANCE' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in">
               <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-[40px] border-2 border-green-100 dark:border-green-900/30">
                 <h4 className="text-green-700 dark:text-green-400 font-black uppercase tracking-widest text-xs mb-6">Ativos Atuais</h4>
                 <div className="space-y-4">
                   <AssetSummary label="Saldo em Contas" value={formatCurrency(dreData.income - dreData.expense)} />
                   <AssetSummary label="Aplicações" value="R$ 0,00" />
                   <AssetSummary label="Contas a Receber" value="R$ 0,00" />
                 </div>
               </div>
               <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[40px] border-2 border-red-100 dark:border-red-900/30">
                 <h4 className="text-red-700 dark:text-red-400 font-black uppercase tracking-widest text-xs mb-6">Passivos Atuais</h4>
                 <div className="space-y-4">
                   <AssetSummary label="Faturas Próximas" value="R$ 0,00" />
                   <AssetSummary label="Contas a Pagar" value="R$ 0,00" />
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'TAX' && (
             <div className="bg-slate-950 p-10 rounded-[40px] text-white space-y-8 animate-in zoom-in">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-amber-500 rounded-3xl">
                     <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Carnê-Leão Automático</h3>
                    <p className="text-slate-400 text-sm">Resumo mensal para declaração de imposto de renda.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Base Tributável</p>
                      <p className="text-2xl font-bold">{formatCurrency(dreData.income)}</p>
                   </div>
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Deduções (Livro Caixa)</p>
                      <p className="text-2xl font-bold">{formatCurrency(dreData.expense)}</p>
                   </div>
                </div>
                <div className="p-6 bg-blue-600 rounded-2xl font-black text-center uppercase tracking-widest text-xs cursor-pointer hover:scale-105 transition-all">
                   Gerar DARF Simulado
                </div>
             </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white">
              <h3 className="font-black mb-4">Inteligência Financeira</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Seus gastos com <b>Moradia</b> representam <b>28%</b> da sua renda líquida. Especialistas recomendam manter abaixo de 30%.</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 w-[28%]"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3.5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-800'}`}
  >
    {icon} {label}
  </button>
);

const CategoryBar: React.FC<{ label: string; percent: number; color: string; amount: string }> = ({ label, percent, color, amount }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-900 dark:text-white">{label}</span>
      <span className="text-slate-400">{amount} ({percent.toFixed(1)}%)</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
      <div className="h-full transition-all duration-1000" style={{ backgroundColor: color, width: `${percent}%` }}></div>
    </div>
  </div>
);

const DRERow: React.FC<{ label: string; value: number; type: 'INCOME' | 'EXPENSE' }> = ({ label, value, type }) => (
  <tr>
    <td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-400">{label}</td>
    <td className={`px-8 py-5 text-right text-sm ${type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
       {value > 0 ? '+' : ''} {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </td>
  </tr>
);

const AssetSummary: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs font-bold text-slate-500">{label}</span>
    <span className="font-black text-slate-900 dark:text-white">{value}</span>
  </div>
);

export default Reports;
