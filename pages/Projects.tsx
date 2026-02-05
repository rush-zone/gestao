
import React, { useState } from 'react';
import { 
  FolderKanban, Plus, Briefcase, TrendingUp, 
  MoreVertical, CheckCircle, Clock, BarChart2, Trash2, X,
  AlertTriangle, DollarSign, Target, ChevronRight, Info
} from 'lucide-react';
import { useApp } from '../AppContext';
import { Project } from '../types';

const Projects: React.FC = () => {
  const { currentWorkspace, costCenters, projects, addCostCenter, removeCostCenter, addProject, removeProject } = useApp();
  
  // States for Project Modal
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    budget: 0,
    status: 'ACTIVE' as 'ACTIVE' | 'COMPLETED' | 'ON_HOLD'
  });

  // States for Cost Center Modal
  const [showCCModal, setShowCCModal] = useState(false);
  const [ccName, setCcName] = useState('');
  const [ccType, setCcType] = useState<'COST' | 'PROFIT'>('COST');

  const filteredProjects = projects.filter(p => p.workspaceId === currentWorkspace.id);
  const filteredCC = costCenters.filter(c => c.workspaceId === currentWorkspace.id);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currentWorkspace.currency }).format(val);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name) return;
    addProject(projectForm);
    setProjectForm({ name: '', budget: 0, status: 'ACTIVE' });
    setShowProjectModal(false);
  };

  const handleAddCC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ccName) return;
    addCostCenter({ name: ccName, type: ccType });
    setCcName('');
    setShowCCModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Projetos & Centros</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gestão de orçamentos e rentabilidade corporativa.</p>
        </div>
        <button 
          onClick={() => setShowProjectModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} className="inline mr-2" /> Novo Projeto
        </button>
      </header>

      {/* Estatísticas Rápidas de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatCard label="Total Projetos" value={filteredProjects.length} color="text-blue-600" />
         <StatCard label="Em Andamento" value={filteredProjects.filter(p => p.status === 'ACTIVE').length} color="text-emerald-500" />
         <StatCard label="Orçamento Total" value={formatCurrency(filteredProjects.reduce((acc, p) => acc + p.budget, 0))} color="text-slate-900 dark:text-white" />
         <StatCard label="Estourados" value={filteredProjects.filter(p => p.spent > p.budget).length} color="text-rose-500" />
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(proj => (
          <div key={proj.id} className="bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 p-8 rounded-[40px] hover:border-blue-500 transition-all shadow-sm group relative overflow-hidden">
            {proj.spent > proj.budget && (
              <div className="absolute top-0 right-0 p-4">
                 <AlertTriangle size={24} className="text-rose-500 animate-pulse" />
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
                <FolderKanban size={24} />
              </div>
              <div className="flex items-center gap-2">
                 <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                   proj.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                   proj.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                 }`}>
                  {proj.status === 'ACTIVE' ? 'Em andamento' : proj.status === 'COMPLETED' ? 'Concluído' : 'Pausado'}
                 </span>
                 <button onClick={() => removeProject(proj.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors">
                    <Trash2 size={16}/>
                 </button>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{proj.name}</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Utilização do Verba</span>
                <span className={proj.spent > proj.budget ? 'text-rose-500 font-black' : 'text-slate-900 dark:text-white'}>
                  {proj.budget > 0 ? ((proj.spent / proj.budget) * 100).toFixed(1) : '0'}%
                </span>
              </div>
              
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${proj.spent > proj.budget ? 'bg-rose-500' : 'bg-blue-600'}`} 
                  style={{ width: `${Math.min(100, proj.budget > 0 ? (proj.spent / proj.budget) * 100 : 0)}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                  <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(proj.budget)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Realizado</p>
                  <p className={`font-bold ${proj.spent > proj.budget ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>{formatCurrency(proj.spent)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-[40px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400">
             <FolderKanban size={48} className="mb-4 opacity-20"/>
             <p className="font-bold">Nenhum projeto registrado no momento.</p>
             <button onClick={() => setShowProjectModal(true)} className="mt-4 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline">Criar Primeiro Projeto</button>
          </div>
        )}
      </div>

      <section className="pt-12">
        <div className="flex items-center justify-between mb-8 border-b dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Briefcase size={28} className="text-purple-600" />
            Centros de Resultado
          </h2>
          <button 
            onClick={() => setShowCCModal(true)}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"
          >
            <Plus size={16}/> Novo Centro
          </button>
        </div>
        
        <div className="bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-sm">
          <table className="w-full text-left">
             <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Identificação do Centro</th>
                <th className="px-8 py-6">Tipo de Impacto</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800 font-medium">
              {filteredCC.map(cc => (
                <tr key={cc.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">{cc.name}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${cc.type === 'PROFIT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {cc.type === 'PROFIT' ? 'Gerador de Lucro' : 'Centro de Custo'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => removeCostCenter(cc.id)} className="text-slate-300 hover:text-rose-500 p-2 transition-colors">
                       <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCC.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-400 italic text-sm">Nenhum centro de custo/lucro cadastrado ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal para Novo Projeto */}
      {showProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] w-full max-w-lg shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                      <Plus size={24}/>
                   </div>
                   <h3 className="text-2xl font-black">Configurar Projeto</h3>
                </div>
                <button onClick={() => setShowProjectModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X/></button>
             </div>
             
             <form onSubmit={handleAddProject} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nome Amigável do Projeto</label>
                   <input 
                     required 
                     type="text" 
                     value={projectForm.name} 
                     onChange={e => setProjectForm({...projectForm, name: e.target.value})} 
                     className="w-full bg-slate-50 dark:bg-slate-900 p-5 rounded-[24px] outline-none border-2 border-transparent focus:border-blue-500 font-bold text-lg" 
                     placeholder="Ex: Reforma Escritório 2024" 
                   />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Orçamento Previsto (R$)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01"
                      value={projectForm.budget} 
                      onChange={e => setProjectForm({...projectForm, budget: parseFloat(e.target.value)})} 
                      className="w-full bg-slate-50 dark:bg-slate-900 p-5 rounded-[24px] outline-none border-2 border-transparent focus:border-blue-500 font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Status Inicial</label>
                    <select 
                      value={projectForm.status} 
                      onChange={e => setProjectForm({...projectForm, status: e.target.value as any})} 
                      className="w-full bg-slate-50 dark:bg-slate-900 p-5 rounded-[24px] outline-none border-2 border-transparent focus:border-blue-500 font-bold appearance-none"
                    >
                       <option value="ACTIVE">Ativo</option>
                       <option value="ON_HOLD">Em Pausa</option>
                       <option value="COMPLETED">Finalizado</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/20 flex gap-4 text-blue-700 dark:text-blue-400 text-xs">
                   {/* Fix: Added missing Info icon import from lucide-react */}
                   <Info size={24} className="shrink-0"/>
                   <p className="font-medium">O orçamento ajudará o Gestão Fácil a monitorar se os lançamentos vinculados a este projeto estão dentro do limite planejado.</p>
                </div>

                <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                  Publicar Projeto
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Modal para Centro de Custo */}
      {showCCModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black">Novo Centro</h3>
               <button onClick={() => setShowCCModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X/></button>
            </div>
            <form onSubmit={handleAddCC} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nome do Centro</label>
                  <input type="text" value={ccName} onChange={e => setCcName(e.target.value)} placeholder="Ex: Marketing Digital" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"/>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de Unidade</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setCcType('COST')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${ccType === 'COST' ? 'bg-amber-50 border-amber-500 text-white shadow-lg' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>Custo</button>
                    <button type="button" onClick={() => setCcType('PROFIT')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase border-2 transition-all ${ccType === 'PROFIT' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>Lucro</button>
                  </div>
               </div>
               <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl">Confirmar Unidade</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border dark:border-slate-800 shadow-sm flex flex-col justify-center">
     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className={`text-xl font-black tracking-tight ${color}`}>{value}</p>
  </div>
);

export default Projects;
