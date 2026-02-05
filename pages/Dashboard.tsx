
import React, { useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, 
  Wallet, Calendar, AlertCircle, RefreshCcw, Info, ChevronRight, Check,
  Plus, ArrowRightLeft, CreditCard, Landmark, PieChart as PieChartIcon, 
  ArrowUpRight, Target, MoreHorizontal
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';
import { useApp } from '../AppContext';
import { TransactionType } from '../types';

const Dashboard: React.FC = () => {
  const { transactions, currentWorkspace, accounts, addTransaction } = useApp();

  const currentWsTransactions = useMemo(() => 
    transactions.filter(t => t.workspaceId === currentWorkspace.id),
    [transactions, currentWorkspace.id]
  );
  
  const incomeMonth = useMemo(() => 
    currentWsTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + Number(t.value), 0),
    [currentWsTransactions]
  );

  const expenseMonth = useMemo(() => 
    currentWsTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + Number(t.value), 0),
    [currentWsTransactions]
  );

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currentWorkspace.currency }).format(val);

  const chartData = [
    { name: '01/02', total: 4000 },
    { name: '05/02', total: 3000 },
    { name: '10/02', total: 2000 },
    { name: '15/02', total: 2780 },
    { name: '20/02', total: 1890 },
    { name: '25/02', total: 2390 },
    { name: '28/02', total: 3490 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Quick Actions & High Level Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <SummaryCard 
                title="Saldo em Contas" 
                value={formatCurrency(incomeMonth - expenseMonth)} 
                trend="+2.5%" 
                icon={<Wallet className="text-emerald-500" size={20}/>}
                bgColor="bg-emerald-50/50 dark:bg-emerald-950/20"
             />
             <SummaryCard 
                title="Receitas no Mês" 
                value={formatCurrency(incomeMonth)} 
                trend="+12%" 
                icon={<ArrowUpCircle className="text-blue-500" size={20}/>}
                bgColor="bg-blue-50/50 dark:bg-blue-950/20"
             />
             <SummaryCard 
                title="Despesas no Mês" 
                value={formatCurrency(expenseMonth)} 
                trend="-4%" 
                icon={<ArrowDownCircle className="text-rose-500" size={20}/>}
                bgColor="bg-rose-50/50 dark:bg-rose-950/20"
             />
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-4 flex flex-col justify-center gap-3 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ações Rápidas</p>
           <div className="flex justify-around">
              <ActionButton icon={<Plus size={20}/>} label="Ganho" color="text-emerald-500" onClick={() => addTransaction({ type: TransactionType.INCOME })} />
              <ActionButton icon={<Plus size={20}/>} label="Gasto" color="text-rose-500" onClick={() => addTransaction({ type: TransactionType.EXPENSE })} />
              <ActionButton icon={<ArrowRightLeft size={20}/>} label="Transf." color="text-slate-500" />
              <ActionButton icon={<Landmark size={20}/>} label="Conciliar" color="text-blue-500" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[32px] p-8 shadow-sm group">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Fluxo de Disponibilidade</h3>
                  <p className="text-xs text-slate-400 font-medium">Projeção baseada em lançamentos confirmados e previstos.</p>
               </div>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">Mensal</button>
                  <button className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-400">Anual</button>
               </div>
            </div>
            
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                    />
                    <YAxis 
                      hide
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Próximos Vencimentos</h4>
                <div className="space-y-3">
                   <UpcomingItem label="Aluguel Escritório" value="R$ 4.500,00" date="Em 2 dias" type="EXPENSE" />
                   <UpcomingItem label="Fatura Nubank" value="R$ 1.230,50" date="Em 5 dias" type="EXPENSE" />
                   <UpcomingItem label="Serviços Tech" value="R$ 8.900,00" date="Amanhã" type="INCOME" />
                </div>
             </div>
             <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Target size={80}/></div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Meta de Economia</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-2xl font-black">75%</span>
                      <span className="text-[10px] font-bold text-slate-400">Faltam R$ 2.400,00</span>
                   </div>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[75%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                   </div>
                   <p className="text-[10px] text-slate-400 leading-tight">Você está economizando 15% mais que no mês passado. Continue assim!</p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Suas Contas</h4>
                 <button className="text-blue-600"><Plus size={18}/></button>
              </div>
              <div className="space-y-4">
                 {accounts.slice(0, 3).map(acc => (
                   <AccountItem key={acc.id} name={acc.name} balance={formatCurrency(acc.balance)} type={acc.type} />
                 ))}
              </div>
              <button className="w-full mt-6 py-3 border-2 border-slate-50 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Ver todas</button>
           </div>

           <div className="bg-indigo-600 rounded-[32px] p-8 text-white space-y-6 shadow-xl shadow-indigo-500/20">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <PieChartIcon size={24}/>
                 </div>
                 <div>
                    <h4 className="font-black text-sm">Review Semanal</h4>
                    <p className="text-[10px] text-indigo-100 uppercase font-bold tracking-widest">IA Insights</p>
                 </div>
              </div>
              <p className="text-sm text-indigo-50 leading-relaxed font-medium">Seus gastos com <b>Refeições</b> subiram 14% nesta semana. Gostaria de ajustar sua meta?</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Analisar agora</button>
           </div>
        </div>

      </div>
    </div>
  );
};

// Componentes Auxiliares Refinados
const SummaryCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; bgColor: string }> = ({ title, value, trend, icon, bgColor }) => (
  <div className={`p-6 rounded-[32px] border dark:border-slate-800 transition-all hover:scale-[1.02] shadow-sm bg-white dark:bg-slate-900`}>
    <div className="flex items-center justify-between mb-4">
       <div className={`p-3 rounded-2xl ${bgColor}`}>
          {icon}
       </div>
       <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'}`}>
          {trend}
       </span>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{value}</h3>
  </div>
);

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick?: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 ${color} group-hover:scale-110 group-hover:shadow-lg transition-all`}>
      {icon}
    </div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </button>
);

const UpcomingItem: React.FC<{ label: string; value: string; date: string; type: 'INCOME' | 'EXPENSE' }> = ({ label, value, date, type }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
     <div className="flex items-center gap-3">
        <div className={`w-1.5 h-10 rounded-full ${type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
        <div>
           <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</p>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{date}</p>
        </div>
     </div>
     <span className={`text-xs font-black ${type === 'INCOME' ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>{value}</span>
  </div>
);

const AccountItem: React.FC<{ name: string; balance: string; type: string }> = ({ name, balance, type }) => (
  <div className="flex items-center justify-between group cursor-pointer">
     <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
           {type === 'BANK' ? <Landmark size={18}/> : <Wallet size={18}/>}
        </div>
        <div>
           <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{name}</p>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{type}</p>
        </div>
     </div>
     <span className="text-xs font-black text-slate-800 dark:text-slate-200">{balance}</span>
  </div>
);

export default Dashboard;
