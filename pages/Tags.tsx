
import React, { useState } from 'react';
import { Hash, Plus, X, Trash2 } from 'lucide-react';
import { useApp } from '../AppContext';

const Tags: React.FC = () => {
  const { tags, currentWorkspace, addTag, removeTag } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#3b82f6' });

  const filteredTags = tags.filter(t => t.workspaceId === currentWorkspace.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addTag(formData);
    setShowModal(false);
    setFormData({ name: '', color: '#3b82f6' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Tags</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Etiquetas flexíveis para agrupar lançamentos transversais.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} className="inline mr-2" /> Nova Tag
        </button>
      </header>

      <div className="flex flex-wrap gap-4 bg-white dark:bg-slate-900 p-10 rounded-[40px] border dark:border-slate-800 shadow-sm min-h-[300px] content-start">
         {filteredTags.map(tag => (
           <div key={tag.id} className="flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all hover:scale-105" style={{ borderColor: tag.color + '33', backgroundColor: tag.color + '11' }}>
              <Hash size={14} style={{ color: tag.color }} />
              <span className="text-sm font-bold" style={{ color: tag.color }}>{tag.name}</span>
              <button onClick={() => removeTag(tag.id)} className="ml-2 hover:text-rose-500 text-slate-400 transition-colors"><X size={14}/></button>
           </div>
         ))}
         {filteredTags.length === 0 && (
           <div className="w-full flex flex-col items-center justify-center py-20 text-slate-300">
              <Hash size={48} className="mb-4 opacity-20"/>
              <p className="font-bold">Nenhuma tag criada ainda.</p>
           </div>
         )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Configurar Tag</h3>
                <button onClick={() => setShowModal(false)}><X/></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Identificador</label>
                   <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Viagem 2024" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Cor da Etiqueta</label>
                   <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full h-14 bg-slate-50 rounded-2xl cursor-pointer p-2" />
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl">Criar Tag</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;
