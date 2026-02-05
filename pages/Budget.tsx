
import React, { useMemo } from 'react';
import { 
  Target, PieChart, AlertTriangle, TrendingUp, 
  Plus, ChevronRight, Info, CheckCircle2, Filter
} from 'lucide-react';
import { useApp } from '../AppContext';
import { TransactionType } from '../types';

const Budget: React.FC = () => {
  const { transactions, categories, currentWorkspace } = useApp();

  const budgetData = useMemo(() => {
    return categories
      .filter(cat => cat.workspaceId === currentWorkspace.id)
      .map(cat => {
        const spent = transactions
          .filter(t => t.categoryId === cat.id && t.type === TransactionType.EXPENSE)
          .reduce((acc, t) => acc + Number(t.value), 0);
        
        // Mocking a limit of 1500 for demo purposes if not defined in Context
        const limit = 1500; 
        const percent = (spent / limit) * 100;
        
        return { ...cat, spent, limit, percent };
      });
  }, [transactions, categories, currentWorkspace.id]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currentWorkspace.currency }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Orçamento Mensal</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Controle seus limites e evite surpresas no fim do mês.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-300 shadow-sm flex items-center gap-2">
              <Filter size={18}/> Fevereiro
           </button>
           <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
              Ajustar Limites
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Orçamentos por Categoria */}
        <div className="lg:col-span-8 space-y-4">
           {budgetData.map(item => (
             <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border dark:border-slate-800 shadow-sm group hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <h4 className="font-black text-slate-800 dark:text-white">{item.name}</h4>
                   </div>
                   <div className="text-right">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Gasto: </span>
                      <span className="text-sm font-black text-slate-800 dark:text-white">{formatCurrency(item.spent)}</span>
                      <span className="text-xs font-bold text-slate-300"> / {formatCurrency(item.limit)}</span>
                   </div>
                </div>

                <div className="relative h-3 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                   <div 
                     className={`h-full rounded-full transition-all duration-1000 ${
                       item.percent > 90 ? 'bg-rose-500' : item.percent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                     }`}
                     style={{ width: `${Math.min(item.percent, 100)}%` }}
                   ></div>
                </div>

                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {item.percent > 100 ? 'Orçamento Estourado' : `${Math.round(100 - item.percent)}% restante`}
                   </span>
                   {item.percent > 90 && <AlertTriangle size={14} className="text-rose-500 animate-pulse" />}
                </div>
             </div>
           ))}
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
                 <Target size={160} />
              </div>
              <h3 className="text-xl font-black mb-6">Insight de IA</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                 Baseado nos seus gastos de Fevereiro, você deve atingir o limite de <b>Alimentação</b> em 4 dias. 
                 <br/><br/>
                 Sugerimos reduzir jantares fora para manter o plano.
              </p>
              <button className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30">
                 Ver Detalhes
              </button>
           </div>

           <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[40px] p-8 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Resumo do Planejamento</h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Total Planejado</span>
                    <span className="font-black text-slate-800 dark:text-white">R$ 12.500,00</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500">Total Gasto</span>
                    <span className="font-black text-rose-500">R$ 8.120,00</span>
                 </div>
                 <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-800 dark:text-white">Disponível</span>
                    <span className="font-black text-emerald-500">R$ 4.380,00</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Budget;
