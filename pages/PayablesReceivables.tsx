
import React, { useState } from 'react';
import { 
  Plus, Calendar, Filter, Search, ArrowUpCircle, ArrowDownCircle,
  MoreVertical, CheckCircle2, Clock, AlertTriangle, FileText, X
} from 'lucide-react';
import { useApp } from '../AppContext';

const PayablesReceivables: React.FC = () => {
  const { payables, currentWorkspace, addPayable, markPayablePaid, removePayable, categories } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'PAYABLE' | 'RECEIVABLE'>('ALL');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    type: 'PAYABLE' as 'PAYABLE' | 'RECEIVABLE',
    status: 'PENDING' as any
  });

  const filteredItems = payables
    .filter(p => p.workspaceId === currentWorkspace.id)
    .filter(item => filter === 'ALL' || item.type === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayable(formData);
    setShowModal(false);
    setFormData({ title: '', amount: 0, dueDate: new Date().toISOString().split('T')[0], type: 'PAYABLE', status: 'PENDING' });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Pagar & Receber</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Controle de títulos em aberto e previsões futuras.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Novo Título
        </button>
      </header>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[24px] border-2 dark:border-slate-800 w-full sm:w-fit">
        <button onClick={() => setFilter('ALL')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}>Tudo</button>
        <button onClick={() => setFilter('PAYABLE')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'PAYABLE' ? 'bg-white dark:bg-slate-800 text-red-500 shadow-sm' : 'text-slate-400'}`}>A Pagar</button>
        <button onClick={() => setFilter('RECEIVABLE')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'RECEIVABLE' ? 'bg-white dark:bg-slate-800 text-green-500 shadow-sm' : 'text-slate-400'}`}>A Receber</button>
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Vencimento</th>
                <th className="px-8 py-6">Título</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Valor</th>
                <th className="px-8 py-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filteredItems.map(item => (
                <tr key={item.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-400">
                        <Calendar size={20} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{item.dueDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      {item.type === 'PAYABLE' ? <ArrowDownCircle size={18} className="text-red-500" /> : <ArrowUpCircle size={18} className="text-green-500" />}
                      <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={item.status as any} />
                  </td>
                  <td className={`px-8 py-6 text-right font-black text-lg ${item.type === 'PAYABLE' ? 'text-red-600' : 'text-green-600'}`}>
                    {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: currentWorkspace.currency })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                       {item.status !== 'PAID' && (
                         <button 
                          onClick={() => markPayablePaid(item.id)}
                          className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl hover:scale-110 transition-all"
                          title="Marcar como Pago/Recebido"
                         >
                          <CheckCircle2 size={20} />
                         </button>
                       )}
                       <button onClick={() => removePayable(item.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-300 hover:text-red-500 transition-all">
                        <MoreVertical size={20} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">
                    Nenhum título pendente. Clique em "Novo Título" para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Título */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Lançar Título</h3>
                <button onClick={() => setShowModal(false)}><X/></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Título / Descrição</label>
                   <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 font-bold" placeholder="Ex: Assinatura SaaS..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Valor</label>
                    <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Vencimento</label>
                    <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de Título</label>
                   <div className="flex gap-2">
                      <button type="button" onClick={() => setFormData({...formData, type: 'PAYABLE'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] border-2 transition-all ${formData.type === 'PAYABLE' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-400'}`}>CONTA A PAGAR</button>
                      <button type="button" onClick={() => setFormData({...formData, type: 'RECEIVABLE'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] border-2 transition-all ${formData.type === 'RECEIVABLE' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-400'}`}>CONTA A RECEBER</button>
                   </div>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Criar Título</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge: React.FC<{ status: 'PAID' | 'PENDING' | 'OVERDUE' }> = ({ status }) => {
  const config = {
    PAID: { label: 'Liquidado', class: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400', icon: <CheckCircle2 size={12}/> },
    PENDING: { label: 'Aberto', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: <Clock size={12}/> },
    OVERDUE: { label: 'Atrasado', class: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: <AlertTriangle size={12}/> }
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 w-fit ${config[status].class}`}>
      {config[status].icon} {config[status].label}
    </span>
  );
};

export default PayablesReceivables;
