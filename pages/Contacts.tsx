
import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, MoreVertical, Trash2, X, Briefcase } from 'lucide-react';
import { useApp } from '../AppContext';

const Contacts: React.FC = () => {
  const { contacts, currentWorkspace, addContact, removeContact } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', type: 'CLIENT' as any, phone: '', document: '' });

  const filteredContacts = contacts
    .filter(c => c.workspaceId === currentWorkspace.id)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addContact(formData);
    setShowModal(false);
    setFormData({ name: '', email: '', type: 'CLIENT', phone: '', document: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Contatos</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gestão de clientes, fornecedores e parceiros.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} className="inline mr-2" /> Novo Contato
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-[24px] border dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 pl-11 pr-4 py-3 rounded-xl border-none outline-none text-sm font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[32px] overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <tr>
                  <th className="px-8 py-5">Nome / Tipo</th>
                  <th className="px-8 py-5">Email & Telefone</th>
                  <th className="px-8 py-5 text-right">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
               {filteredContacts.map(contact => (
                 <tr key={contact.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">
                             {contact.name[0]}
                          </div>
                          <div>
                             <p className="font-bold text-slate-900 dark:text-white">{contact.name}</p>
                             <span className={`text-[9px] font-black uppercase tracking-widest ${contact.type === 'CLIENT' ? 'text-blue-500' : 'text-amber-500'}`}>{contact.type}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-1 text-xs text-slate-500">
                          <div className="flex items-center gap-2"><Mail size={12}/> {contact.email}</div>
                          {contact.phone && <div className="flex items-center gap-2"><Phone size={12}/> {contact.phone}</div>}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button onClick={() => removeContact(contact.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Novo Contato</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X/></button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4">
                <input required type="text" placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none font-bold" />
                <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none font-bold" />
                <div className="grid grid-cols-2 gap-2">
                   <button type="button" onClick={() => setFormData({...formData, type: 'CLIENT'})} className={`py-3 rounded-xl font-black text-[10px] border-2 transition-all ${formData.type === 'CLIENT' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 text-slate-400 border-transparent'}`}>CLIENTE</button>
                   <button type="button" onClick={() => setFormData({...formData, type: 'SUPPLIER'})} className={`py-3 rounded-xl font-black text-[10px] border-2 transition-all ${formData.type === 'SUPPLIER' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 text-slate-400 border-transparent'}`}>FORNECEDOR</button>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl">Cadastrar Contato</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
