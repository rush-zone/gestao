
import React, { useState } from 'react';
import { 
  CircleDot, Plus, TrendingUp, TrendingDown, 
  MoreHorizontal, ArrowUpRight, ArrowDownLeft, 
  Filter, Search, Download, Trash2, X
} from 'lucide-react';
import { useApp } from '../AppContext';

const CostCenters: React.FC = () => {
  const { currentWorkspace, costCenters, addCostCenter, removeCostCenter } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'COST' as 'COST' | 'PROFIT' });

  const filteredCC = costCenters.filter(c => c.workspaceId === currentWorkspace.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addCostCenter(formData);
    setFormData({ name: '', type: 'COST' });
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Centros de Resultado</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Análise de performance por departamentos ou unidades.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} className="inline mr-2" /> Novo Centro
        </button>
      </header>

      {/* Grid de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <PerformanceCard label="Departamentos de Lucro" count={filteredCC.filter(c => c.type === 'PROFIT').length} icon={<TrendingUp size={20}/>} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-950/20" />
         <PerformanceCard label="Centros de Custo" count={filteredCC.filter(c => c.type === 'COST').length} icon={<TrendingDown size={20}/>} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-950/20" />
         <PerformanceCard label="Maior Margem" count="Vendas" icon={<ArrowUpRight size={20}/>} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-950/20" />
         <PerformanceCard label="Maior Despesa" count="ADM" icon={<ArrowDownLeft size={20}/>} color="text-rose-500" bgColor="bg-rose-50 dark:bg-rose-950/20" />
      </div>

      {/* Lista de Centros */}
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-8 py-6">Identificação</th>
                     <th className="px-8 py-6">Classificação</th>
                     <th className="px-8 py-6">Performance (Mês)</th>
                     <th className="px-8 py-6 text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y dark:divide-slate-800">
                  {filteredCC.map(cc => (
                    <tr key={cc.id} className="group hover:bg-slate-50/50 transition-all">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className={`p-3 rounded-xl ${cc.type === 'PROFIT' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                                <CircleDot size={18}/>
                             </div>
                             <span className="font-bold text-slate-800 dark:text-white">{cc.name}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${cc.type === 'PROFIT' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                             {cc.type === 'PROFIT' ? 'Gerador de Lucro' : 'Centro de Custo'}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <div className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estável</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button onClick={() => removeCostCenter(cc.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                             <Trash2 size={18}/>
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Modal Novo Centro */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Configurar Centro</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X/></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nome Amigável</label>
                   <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Marketing Digital" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de Impacto</label>
                   <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setFormData({...formData, type: 'COST'})} className={`py-4 rounded-2xl font-black text-[10px] border-2 transition-all ${formData.type === 'COST' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 border-transparent text-slate-400'}`}>CENTRO DE CUSTO</button>
                      <button type="button" onClick={() => setFormData({...formData, type: 'PROFIT'})} className={`py-4 rounded-2xl font-black text-[10px] border-2 transition-all ${formData.type === 'PROFIT' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-transparent text-slate-400'}`}>GERADOR DE LUCRO</button>
                   </div>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Criar Unidade</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PerformanceCard: React.FC<{ label: string; count: number | string; icon: React.ReactNode; color: string; bgColor: string }> = ({ label, count, icon, color, bgColor }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border dark:border-slate-800 shadow-sm">
     <div className={`w-10 h-10 rounded-xl ${bgColor} ${color} flex items-center justify-center mb-4`}>
        {icon}
     </div>
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className="text-xl font-black text-slate-800 dark:text-white">{count}</p>
  </div>
);

export default CostCenters;
