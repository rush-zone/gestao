
import React from 'react';
import { 
  Target, PiggyBank, Plus, ArrowUpRight, 
  ChevronRight, BarChart3, Wallet, Star, Info
} from 'lucide-react';
import { useApp } from '../AppContext';

const Goals: React.FC = () => {
  const { currentWorkspace } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Metas & Economia</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Transforme seus sonhos em planos financeiros executáveis.</p>
        </div>
        <button className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
          <Plus size={18} className="inline mr-2" /> Criar Objetivo
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Metas Ativas */}
        <div className="lg:col-span-8 space-y-6">
           <GoalProgressCard 
             title="Reserva de Emergência" 
             target={20000} 
             current={18400} 
             color="text-emerald-500" 
             icon={<PiggyBank size={24}/>} 
           />
           <GoalProgressCard 
             title="Viagem Japão 2026" 
             target={15000} 
             current={4500} 
             color="text-blue-500" 
             icon={<Star size={24}/>} 
           />
           <GoalProgressCard 
             title="Troca de Carro" 
             target={60000} 
             current={12000} 
             color="text-indigo-500" 
             icon={<Target size={24}/>} 
           />
        </div>

        {/* Widgets e Sugestões */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                 <BarChart3 size={200} />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacidade de Aporte</p>
                 <h3 className="text-3xl font-black tracking-tighter mb-4">R$ 2.450,00</h3>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">Você pode atingir sua meta de <b>Reserva</b> em 2 meses se mantiver esse ritmo.</p>
                 <button className="w-full mt-8 py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                    Simular Aportes
                 </button>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-[40px] shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Educação Financeira</h4>
              <div className="space-y-4">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex gap-3 group cursor-pointer hover:bg-blue-50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                       <Info size={18}/>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Regra 50-30-20</p>
                       <p className="text-[10px] text-slate-400">Como dividir sua renda de forma inteligente.</p>
                    </div>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex gap-3 group cursor-pointer hover:bg-blue-50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0">
                       <Wallet size={18}/>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Juros Compostos</p>
                       <p className="text-[10px] text-slate-400">O segredo para multiplicar patrimônio.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const GoalProgressCard: React.FC<{ title: string; target: number; current: number; color: string; icon: React.ReactNode }> = ({ title, target, current, color, icon }) => {
  const percent = Math.round((current / target) * 100);
  const formatValue = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:border-blue-500/50 transition-all">
       <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-50 dark:text-slate-800" />
             <circle 
               cx="50" cy="50" r="44" 
               fill="transparent" 
               stroke="currentColor" 
               strokeWidth="8" 
               strokeDasharray="276.5" 
               strokeDashoffset={276.5 - (276.5 * percent) / 100}
               className={`${color} transition-all duration-1000`} 
             />
          </svg>
          <div className={`text-xl font-black ${color}`}>{percent}%</div>
       </div>

       <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3">
             <span className={`${color}`}>{icon}</span>
             <h3 className="text-xl font-black text-slate-800 dark:text-white">{title}</h3>
          </div>
          <p className="text-sm font-bold text-slate-400">Objetivo: {formatValue(target)}</p>
          <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
             <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Aportar</button>
             <button className="px-6 py-2 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Detalhes</button>
          </div>
       </div>

       <div className="text-right hidden md:block">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Acumulado</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{formatValue(current)}</p>
          <div className="text-[10px] font-bold text-emerald-500 mt-1 flex items-center justify-end gap-1">
             <ArrowUpRight size={14}/> +R$ 450,00 este mês
          </div>
       </div>
    </div>
  );
};

export default Goals;
