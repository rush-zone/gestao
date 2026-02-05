
import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Plus, 
  Trash2, Search, ArrowUpRight, DollarSign, PieChart,
  Target, ChevronRight, X, Info
} from 'lucide-react';
import { useApp } from '../AppContext';

const Investments: React.FC = () => {
  const { currentWorkspace, investments, addInvestment, removeInvestment } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newInv, setNewInv] = useState({
    name: '', symbol: '', type: 'STOCK' as any,
    quantity: 0, averagePrice: 0, currentPrice: 0, institution: ''
  });

  const filteredInv = investments.filter(i => i.workspaceId === currentWorkspace.id);
  
  const totalEquity = filteredInv.reduce((acc, i) => acc + (i.quantity * i.currentPrice), 0);
  const totalCost = filteredInv.reduce((acc, i) => acc + (i.quantity * i.averagePrice), 0);
  const totalProfit = totalEquity - totalCost;
  const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currentWorkspace.currency }).format(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvestment(newInv);
    setShowModal(false);
    setNewInv({ name: '', symbol: '', type: 'STOCK', quantity: 0, averagePrice: 0, currentPrice: 0, institution: '' });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Investimentos</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Sua carteira global de ativos.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Adicionar Ativo
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-[40px] text-white space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Patrimônio Investido</p>
          <h3 className="text-4xl font-black tracking-tighter">{formatCurrency(totalEquity)}</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
             Custo total: {formatCurrency(totalCost)}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rentabilidade Total</p>
          <h3 className={`text-4xl font-black tracking-tighter ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(totalProfit)}
          </h3>
          <div className={`flex items-center gap-1 text-xs font-black uppercase ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalProfit >= 0 ? <ArrowUpRight size={14}/> : <TrendingDown size={14}/>} {profitPercent.toFixed(2)}%
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-[40px] border-2 border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Composição</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{filteredInv.length} Ativos</h3>
            <button className="text-xs font-bold text-blue-600 flex items-center gap-1">Ver gráficos <ChevronRight size={14}/></button>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-3xl text-blue-600 shadow-sm">
             <PieChart size={32}/>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Ativo / Código</th>
                <th className="px-8 py-6">Tipo</th>
                <th className="px-8 py-6">Posição</th>
                <th className="px-8 py-6">Preço Médio</th>
                <th className="px-8 py-6">Preço Atual</th>
                <th className="px-8 py-6 text-right">Resultado</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800 font-medium">
              {filteredInv.map(inv => {
                const position = inv.quantity * inv.currentPrice;
                const result = position - (inv.quantity * inv.averagePrice);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white uppercase">{inv.symbol}</span>
                          <span className="text-xs text-slate-400">{inv.name}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{inv.type}</span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold">{inv.quantity} un.</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase">{formatCurrency(position)}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-sm">{formatCurrency(inv.averagePrice)}</td>
                    <td className="px-8 py-6 text-sm">{formatCurrency(inv.currentPrice)}</td>
                    <td className={`px-8 py-6 text-right font-black ${result >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                       {formatCurrency(result)}
                    </td>
                    <td className="px-8 py-6">
                       <button onClick={() => removeInvestment(inv.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                );
              })}
              {filteredInv.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">Nenhum ativo cadastrado. Comece adicionando suas Ações ou CDBs.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Ativo */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-[40px] w-full max-w-xl shadow-2xl animate-in zoom-in border-4 border-white dark:border-slate-900">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white">
                    <Plus size={24}/>
                  </div>
                  <h3 className="text-2xl font-black">Novo Ativo</h3>
               </div>
               <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
               <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nome do Ativo</label>
                  <input required type="text" value={newInv.name} onChange={e => setNewInv({...newInv, name: e.target.value})} placeholder="Ex: Itausa S.A." className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ticker / Símbolo</label>
                  <input required type="text" value={newInv.symbol} onChange={e => setNewInv({...newInv, symbol: e.target.value.toUpperCase()})} placeholder="Ex: ITSA4" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-black"/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo</label>
                  <select value={newInv.type} onChange={e => setNewInv({...newInv, type: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold appearance-none">
                     <option value="STOCK">Ações</option>
                     <option value="FII">FIIs</option>
                     <option value="FIXED">Renda Fixa</option>
                     <option value="CRYPTO">Criptomoedas</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Quantidade</label>
                  <input required type="number" value={newInv.quantity} onChange={e => setNewInv({...newInv, quantity: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Preço Médio (R$)</label>
                  <input required type="number" step="0.01" value={newInv.averagePrice} onChange={e => setNewInv({...newInv, averagePrice: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Preço Atual (R$)</label>
                  <input required type="number" step="0.01" value={newInv.currentPrice} onChange={e => setNewInv({...newInv, currentPrice: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Instituição</label>
                  <input type="text" value={newInv.institution} onChange={e => setNewInv({...newInv, institution: e.target.value})} placeholder="Ex: XP Investimentos" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"/>
               </div>
               <div className="col-span-2 pt-4">
                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                    Confirmar Ativo
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;
