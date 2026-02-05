
import React, { useState } from 'react';
import { 
  Users as UsersIcon, Plus, Mail, Shield, 
  Trash2, X, MoreVertical, CheckCircle2,
  Lock, AlertCircle
} from 'lucide-react';
import { useApp } from '../AppContext';
import { UserRole } from '../types';

const Users: React.FC = () => {
  const { currentWorkspace, members, addMember, removeMember } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: UserRole.OPERADOR });

  const filteredMembers = members.filter(m => m.workspaceId === currentWorkspace.id);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.email) return;
    addMember(newMember);
    setShowModal(false);
    setNewMember({ name: '', email: '', role: UserRole.OPERADOR });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Equipe & Acessos</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Controle quem pode gerenciar as finanças da empresa.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95"
        >
          <Plus size={20} /> Convidar Membro
        </button>
      </header>

      {/* RBAC Info Card */}
      <div className="bg-blue-600 p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <Shield size={200} />
        </div>
        <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-md">
           <Lock size={40}/>
        </div>
        <div className="relative z-10 flex-1 space-y-2">
           <h3 className="text-2xl font-black uppercase tracking-tight">Segurança RBAC Ativa</h3>
           <p className="text-blue-100 max-w-xl">O Gestão Fácil utiliza Role-Based Access Control para garantir que cada operador veja apenas o que é necessário para sua função.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <RoleBadge role="ADMIN" />
           <RoleBadge role="GESTOR" />
           <RoleBadge role="OPERADOR" />
           <RoleBadge role="VISUALIZADOR" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[40px] overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <tr>
                  <th className="px-8 py-6">Membro</th>
                  <th className="px-8 py-6">Papel / Nível</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Ações</th>
               </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
               {filteredMembers.map(m => (
                 <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-blue-600">
                             {m.email[0].toUpperCase()}
                          </div>
                          <div>
                             <p className="font-bold text-slate-900 dark:text-white">{m.name || 'Convidado Pendente'}</p>
                             <p className="text-xs text-slate-400">{m.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         m.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 
                         m.role === UserRole.GESTOR ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {m.role}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${m.status === 'ACTIVE' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                          <span className="text-xs font-bold text-slate-500">{m.status === 'ACTIVE' ? 'Ativo' : 'Pendente'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button onClick={() => removeMember(m.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                       </div>
                    </td>
                 </tr>
               ))}
               {filteredMembers.length === 0 && (
                 <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">
                       Nenhum membro convidado para este workspace corporativo.
                    </td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* Modal Convite */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Novo Membro</h3>
                <button onClick={() => setShowModal(false)}><X/></button>
             </div>
             <form onSubmit={handleAddMember} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Email Corporativo</label>
                   <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold"/>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Papel (Permissões)</label>
                   <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-none focus:ring-2 ring-blue-500 font-bold appearance-none">
                      <option value={UserRole.GESTOR}>Gestor (Relatórios e Centros)</option>
                      <option value={UserRole.OPERADOR}>Operador (Lançamentos e Pagar/Receber)</option>
                      <option value={UserRole.VISUALIZADOR}>Visualizador (Apenas Leitura)</option>
                      <option value={UserRole.ADMIN}>Administrador (Controle Total)</option>
                   </select>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex gap-3 text-amber-700 dark:text-amber-400 text-xs">
                   <AlertCircle size={20}/>
                   <p>Um convite de acesso será enviado para o email informado com as instruções de login.</p>
                </div>
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Enviar Convite</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const RoleBadge: React.FC<{ role: string }> = ({ role }) => (
  <div className="px-3 py-1.5 bg-white/10 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
     <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
     {role}
  </div>
);

export default Users;
