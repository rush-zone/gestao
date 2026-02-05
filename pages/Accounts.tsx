
import React, { useState } from 'react';
import { 
  Plus, Landmark, CreditCard, ArrowRightLeft, 
  MoreVertical, ShieldCheck, Wallet, ChevronRight,
  TrendingUp, PiggyBank, Receipt, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useApp } from '../AppContext';

const Accounts: React.FC = () => {
  const { accounts, currentWorkspace, addAccount } = useApp();

  const filteredAccounts = accounts.filter(a => a.workspaceId === currentWorkspace.id);
  const totalBalance = filteredAccounts.reduce((acc, a) => acc + Number(a.balance), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Patrimônio</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Visão consolidada de suas contas e cartões.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => addAccount({ name: 'Nova Conta', type: 'BANK', balance: 0 })}
            className="flex-1 sm:flex-none px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} className="inline mr-2" /> Adicionar Conta
          </button>
        </div>
      </header>

      {/* Hero Balance Card */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border dark:border-slate-800 shadow-sm relative overflow-hidden group">
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-50 dark:bg-blue-900/10 rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-fit">
                  <TrendingUp size={14}/>
                  <span className="text-[10px] font-black uppercase tracking-widest">Saldo Consolidado</span>
               </div>
               <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currentWorkspace.currency }).format(totalBalance)}
               </h2>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                     <ArrowUpRight size={16}/> +R$ 2.450,20
                  </div>
                  <div className="text-slate-400 font-medium text-xs">em relação ao mês passado</div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <MiniStat label="Rendimentos" value="R$ 145,00" color="text-emerald-500" />
               <MiniStat label="Projetado" value="R$ 42.100" color="text-blue-500" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Account List */}
         <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Contas Correntes</h3>
               <button className="text-xs font-bold text-blue-600">Configurar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {filteredAccounts.map(acc => (
                 <AccountCard key={acc.id} name={acc.name} balance={acc.balance} type={acc.type} currency={acc.currency} />
               ))}
            </div>
         </div>

         {/* Card List */}
         <div className="lg:col-span-5 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Seus Cartões</h3>
            <div className="space-y-4">
               <PremiumCreditCard 
                 bank="Nubank" 
                 name="João Silva" 
                 lastDigits="4521" 
                 used="R$ 1.450,00" 
                 limit="R$ 10.000,00" 
                 color="bg-purple-700" 
                 brand="mastercard"
               />
               <PremiumCreditCard 
                 bank="Santander" 
                 name="JS Tech Ltda" 
                 lastDigits="8842" 
                 used="R$ 8.900,00" 
                 limit="R$ 50.000,00" 
                 color="bg-rose-600" 
                 brand="visa"
               />
               <button className="w-full py-8 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] text-slate-300 font-black uppercase tracking-widest text-[10px] hover:border-blue-500 hover:text-blue-500 transition-all">
                  + Adicionar novo cartão
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const MiniStat: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border dark:border-slate-800">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className={`text-sm font-black ${color}`}>{value}</p>
  </div>
);

const AccountCard: React.FC<{ name: string; balance: number; type: string; currency: string }> = ({ name, balance, type, currency }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all group">
     <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
           {type === 'BANK' ? <Landmark size={24}/> : <Wallet size={24}/>}
        </div>
        <button className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={20}/></button>
     </div>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{name}</p>
     <h4 className="text-xl font-black text-slate-800 dark:text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(balance)}</h4>
  </div>
);

const PremiumCreditCard: React.FC<{ bank: string; name: string; lastDigits: string; used: string; limit: string; color: string; brand: string }> = ({ bank, name, lastDigits, used, limit, color, brand }) => (
  <div className={`${color} p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer`}>
     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <CreditCard size={120} />
     </div>
     <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
           <span className="text-xs font-black uppercase tracking-widest opacity-80">{bank}</span>
           <div className="flex gap-1">
              <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-md"></div>
              <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md -ml-3"></div>
           </div>
        </div>
        
        <div className="space-y-1 mb-8">
           <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Fatura Atual</p>
           <h4 className="text-2xl font-black tracking-tighter">{used}</h4>
        </div>

        <div className="space-y-3">
           <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '35%' }}></div>
           </div>
           <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
              <span className="opacity-60">Final {lastDigits}</span>
              <span>Limite {limit}</span>
           </div>
        </div>
     </div>
  </div>
);

export default Accounts;
