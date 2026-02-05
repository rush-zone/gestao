
import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit2, X, ChevronRight, Hash } from 'lucide-react';
import { useApp } from '../AppContext';
import { TransactionType } from '../types';

const Categories: React.FC = () => {
  const { categories, currentWorkspace, addCategory, removeCategory } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#3b82f6', type: TransactionType.EXPENSE });

  const filteredCategories = categories.filter(c => c.workspaceId === currentWorkspace.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addCategory(formData);
    setShowModal(false);
    setFormData({ name: '', color: '#3b82f6', type: TransactionType.EXPENSE });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Categorias</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Organize seus lançamentos por natureza financeira.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} className="inline mr-2" /> Nova Categoria
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Despesas */}
         <div className="space-y-4">
            <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest px-2">Categorias de Despesa</h3>
            <div className="grid grid-cols-1 gap-3">
               {filteredCategories.filter(c => c.type === TransactionType.EXPENSE).map(cat => (
                 <CategoryItem key={cat.id} cat={cat} onRemove={removeCategory} />
               ))}
            </div>
         </div>

         {/* Receitas */}
         <div className="space-y-4">
            <h3 className="text-sm font-black text-emerald-500 uppercase tracking-widest px-2">Categorias de Receita</h3>
            <div className="grid grid-cols-1 gap-3">
               {filteredCategories.filter(c => c.type === TransactionType.INCOME).map(cat => (
                 <CategoryItem key={cat.id} cat={cat} onRemove={removeCategory} />
               ))}
            </div>
         </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Nova Categoria</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X/></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nome</label>
                   <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Assinaturas" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl font-bold border-none outline-none">
                         <option value={TransactionType.EXPENSE}>Despesa</option>
                         <option value={TransactionType.INCOME}>Receita</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Cor</label>
                      <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full h-[56px] bg-slate-50 dark:bg-slate-900 rounded-2xl border-none p-2 cursor-pointer" />
                   </div>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Criar Categoria</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryItem: React.FC<{ cat: any; onRemove: (id: string) => void }> = ({ cat, onRemove }) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 flex items-center justify-between group">
     <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: cat.color }}>
           {cat.name[0]}
        </div>
        <span className="font-bold text-slate-700 dark:text-slate-200">{cat.name}</span>
     </div>
     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-slate-300 hover:text-blue-500"><Edit2 size={16}/></button>
        <button onClick={() => onRemove(cat.id)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
     </div>
  </div>
);

export default Categories;
