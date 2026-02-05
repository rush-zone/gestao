
import React, { useState } from 'react';
import { 
  Users, Shield, Settings as SettingsIcon, Bell, 
  Lock, Receipt, Download, Trash2, Mail, Edit3, Plus, X
} from 'lucide-react';
import { useApp } from '../AppContext';
import { WorkspaceType, UserRole } from '../types';

const Settings: React.FC = () => {
  const { currentWorkspace, members, addMember, removeMember } = useApp();
  const [activeSection, setActiveSection] = useState<'WORKSPACE' | 'TEAM' | 'DOCS'>('WORKSPACE');
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  const [newMember, setNewMember] = useState({ name: '', email: '', role: UserRole.OPERADOR });

  const filteredMembers = members.filter(m => m.workspaceId === currentWorkspace.id);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.email) return;
    addMember(newMember);
    setNewMember({ name: '', email: '', role: UserRole.OPERADOR });
    setShowMemberModal(false);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Configurações</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Controle total sobre o workspace {currentWorkspace.name}.</p>
      </header>

      <div className="flex flex-wrap gap-4 border-b dark:border-slate-800 pb-4">
        <button onClick={() => setActiveSection('WORKSPACE')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all ${activeSection === 'WORKSPACE' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <SettingsIcon size={18}/> Workspace
        </button>
        {currentWorkspace.type === WorkspaceType.BUSINESS && (
          <button onClick={() => setActiveSection('TEAM')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all ${activeSection === 'TEAM' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Users size={18}/> Equipe & RBAC
          </button>
        )}
        <button onClick={() => setActiveSection('DOCS')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all ${activeSection === 'DOCS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <Receipt size={18}/> Documentos & Recibos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeSection === 'WORKSPACE' && (
             <div className="space-y-8 animate-in fade-in">
                <div className="bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 p-8 rounded-[40px] space-y-6">
                   <h3 className="text-xl font-black mb-4">Preferências Gerais</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Workspace</label>
                         <input type="text" defaultValue={currentWorkspace.name} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"/>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Moeda</label>
                         <select className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold">
                            <option value="BRL">BRL (R$)</option>
                            <option value="USD">USD ($)</option>
                         </select>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
                      <div className="flex items-center gap-3">
                         <Bell size={20} className="text-blue-600"/>
                         <span className="text-sm font-bold">Notificações por Email</span>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto"></div></div>
                   </div>
                   <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg">Salvar Alterações</button>
                </div>
             </div>
          )}

          {activeSection === 'TEAM' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Membros do Workspace</h3>
                <button 
                  onClick={() => setShowMemberModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
                >
                  <Plus size={16}/> Convidar Membro
                </button>
              </div>
              <div className="bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[40px] overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <tr>
                          <th className="px-6 py-4">Usuário</th>
                          <th className="px-6 py-4">Papel (Role)</th>
                          <th className="px-6 py-4 text-center">Ações</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                       {filteredMembers.map(m => (
                         <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                                     {m.name?.[0] || m.email[0]}
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-slate-900 dark:text-white">{m.name || 'Pendente'}</p>
                                     <p className="text-xs text-slate-400">{m.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{m.role}</span>
                            </td>
                            <td className="px-6 py-5 text-center">
                               <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => removeMember(m.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                               </div>
                            </td>
                         </tr>
                       ))}
                       {filteredMembers.length === 0 && (
                         <tr>
                            <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic text-sm">Nenhum membro convidado ainda.</td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {activeSection === 'DOCS' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="bg-slate-900 p-10 rounded-[40px] text-white text-center space-y-6">
                  <div className="w-20 h-20 bg-white/10 rounded-[30px] flex items-center justify-center mx-auto">
                     <Receipt size={40} />
                  </div>
                  <h3 className="text-2xl font-black">Emissor de Recibos</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">Gere recibos profissionais com um clique para qualquer lançamento confirmado.</p>
                  <button className="px-10 py-5 bg-blue-600 rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl">
                     Selecionar Lançamento
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Convidar Membro */}
      {showMemberModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-[40px] w-full max-w-md shadow-2xl animate-in zoom-in">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Convidar Equipe</h3>
                <button onClick={() => setShowMemberModal(false)}><X/></button>
             </div>
             <form onSubmit={handleAddMember} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email do Convidado</label>
                   <input type="email" required value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"/>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Papel (Permissão)</label>
                   <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold">
                      <option value={UserRole.GESTOR}>Gestor</option>
                      <option value={UserRole.OPERADOR}>Operador</option>
                      <option value={UserRole.VISUALIZADOR}>Visualizador</option>
                      <option value={UserRole.ADMIN}>Administrador</option>
                   </select>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Enviar Convite</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
