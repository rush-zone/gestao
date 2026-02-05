
import React, { useState } from 'react';
import { Wallet, Plus, Trash2, X, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useApp } from '../AppContext';

const PaymentMethods: React.FC = () => {
  const { paymentMethods, currentWorkspace, addPaymentMethod } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');

  const filteredPM = paymentMethods.filter(pm => pm.workspaceId === currentWorkspace.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addPaymentMethod({ name, type: 'OTHER' });
    setShowModal(false);
    setName('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Formas de Pagamento</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie como você paga e recebe seus lançamentos.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} className="inline mr-2" /> Adicionar Método
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredPM.map(pm => (
           <div key={pm.id} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border dark:border-slate-800 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {pm.type === 'PIX' ? <Smartphone size={24}/> : pm.type === 'CREDIT_CARD' ? <CreditCard size={24}/> : <Banknote size={24}/>}
                 </div>
                 <span className="font-bold text-slate-800 dark:text-white">{pm.name}</span>
              </div>
              <button className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20}/></button>
           </div>
         ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Novo Método</h3>
                <button onClick={() => setShowModal(false)}><X/></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Descrição</label>
                   <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Dinheiro em Espécie" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none font-bold" />
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl">Cadastrar</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
