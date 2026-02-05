
import React, { useState } from 'react';
import { 
  LayoutDashboard, Building2, Receipt, Scale, 
  ArrowRightLeft, List, CheckCircle, 
  TableProperties, CreditCard, Flag, PieChart, 
  CircleDot, PiggyBank, BarChartBig, Layers, 
  Tag, Landmark, Users, Wallet, FolderKanban, 
  Settings, ChevronDown, Star, ArrowLeft, 
  Plus, Menu, LogOut, User as UserIcon, Target
} from 'lucide-react';
import { useApp } from '../AppContext.tsx';
import { useAuth } from '../AuthContext.tsx';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onPageChange }) => {
  const { 
    currentWorkspace, workspaces, setCurrentWorkspace, 
    darkMode, addTransaction 
  } = useApp();
  const { user, logout } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWsMenuOpen, setIsWsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    'gestao': false,
    'movimentacoes': true,
    'metas': false,
    'cadastros': true
  });

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsSidebarOpen(false);
    setIsUserMenuOpen(false);
    setIsWsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja encerrar sua sessão no Gestão Fácil?')) {
      // Fecha todos os menus antes de deslogar para garantir uma transição limpa
      setIsUserMenuOpen(false);
      setIsSidebarOpen(false);
      setIsWsMenuOpen(false);
      await logout();
    }
  };

  return (
    <div className={`min-h-screen flex bg-[#f8fafc] ${darkMode ? 'dark:bg-slate-900 text-slate-100' : 'text-slate-900'} transition-colors duration-200 overflow-hidden h-screen`}>
      
      {/* 1. MINI SIDEBAR (Desktop) */}
      <aside className="w-16 bg-white dark:bg-slate-950 border-r dark:border-slate-800 flex flex-col items-center py-6 shrink-0 h-full z-50">
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl transition-all mb-8"
          title="Abrir Menu Completo"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex-1 flex flex-col items-center gap-6 text-slate-400">
           <div className="flex flex-col items-center text-[10px] font-black leading-tight select-none">
             <span className="uppercase text-slate-300 dark:text-slate-600">{new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date()).replace('.', '')}</span>
             <span className="text-sm text-slate-700 dark:text-slate-200">{new Date().getDate()}</span>
           </div>
           
           <button 
             onClick={() => handlePageChange('dashboard')}
             className={`p-3 rounded-2xl transition-all ${activePage === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             title="Painel Principal"
           >
             <LayoutDashboard size={20} />
           </button>

           <button 
             onClick={() => handlePageChange('transactions')}
             className={`p-3 rounded-2xl transition-all ${activePage === 'transactions' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             title="Transações"
           >
             <ArrowRightLeft size={20} />
           </button>
           
           <div className="w-8 h-[1px] bg-slate-100 dark:bg-slate-800 my-2"></div>
           
           <button 
             onClick={() => handlePageChange('settings')} 
             className={`p-3 rounded-2xl transition-all ${activePage === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             title="Configurações do Sistema"
           >
             <Settings size={22} />
           </button>
        </div>

        <button 
          onClick={handleLogout}
          className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all mb-2"
          title="Sair do Gestão Fácil"
        >
          <LogOut size={22} />
        </button>
      </aside>

      {/* 2. DRAWER SIDEBAR (Mobile & Expandido) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSidebarOpen(false)}></div>
          <aside className="relative w-[300px] bg-white dark:bg-slate-950 shadow-2xl flex flex-col h-full overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-6 flex items-center justify-between border-b dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                    <Wallet size={18} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-emerald-600">Navegação</span>
               </div>
               <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"><ArrowLeft size={18} /></button>
            </div>
            
            <nav className="flex-1 py-6 px-4 space-y-2">
              <SidebarItem active={activePage === 'dashboard'} onClick={() => handlePageChange('dashboard')} icon={<LayoutDashboard size={20} />} label="Início / Visão Geral" />
              
              <SidebarCollapse icon={<Building2 size={20} />} label="Gestão Estratégica" isOpen={openSubmenus.gestao} onToggle={() => toggleSubmenu('gestao')}>
                <SidebarSubItem label="Balanço Patrimonial" icon={<Scale size={16} />} onClick={() => handlePageChange('reports')} />
                <SidebarSubItem label="Metas e Objetivos" icon={<Target size={16} />} onClick={() => handlePageChange('goals')} />
              </SidebarCollapse>

              <SidebarCollapse icon={<ArrowRightLeft size={20} />} label="Fluxo Financeiro" isOpen={openSubmenus.movimentacoes} onToggle={() => toggleSubmenu('movimentacoes')}>
                <SidebarSubItem label="Lançamentos" active={activePage === 'transactions'} onClick={() => handlePageChange('transactions')} icon={<List size={16} />} hasStar />
                <SidebarSubItem label="Contas a Pagar/Receber" active={activePage === 'payables'} onClick={() => handlePageChange('payables')} icon={<Receipt size={16} />} />
                <SidebarSubItem label="Investimentos" active={activePage === 'investments'} onClick={() => handlePageChange('investments')} icon={<PiggyBank size={16} />} />
              </SidebarCollapse>

              <SidebarItem icon={<TableProperties size={20} />} label="Conciliação Bancária" onClick={() => handlePageChange('conciliation')} active={activePage === 'conciliation'} hasStar />
              <SidebarItem icon={<CreditCard size={20} />} label="Meus Cartões" onClick={() => handlePageChange('accounts')} active={activePage === 'accounts'} hasStar />
              
              <SidebarCollapse icon={<Flag size={20} />} label="Controle de Metas" isOpen={openSubmenus.metas} onToggle={() => toggleSubmenu('metas')}>
                <SidebarSubItem label="Orçamento Anual" active={activePage === 'budget'} icon={<PieChart size={16} />} onClick={() => handlePageChange('budget')} />
                <SidebarSubItem label="Centros de Custo" active={activePage === 'cost_centers'} icon={<CircleDot size={16} />} onClick={() => handlePageChange('cost_centers')} />
              </SidebarCollapse>

              <SidebarItem icon={<BarChartBig size={20} />} label="Relatórios e DRE" onClick={() => handlePageChange('reports')} active={activePage === 'reports'} />
              
              <SidebarCollapse icon={<Layers size={20} />} label="Cadastros Gerais" isOpen={openSubmenus.cadastros} onToggle={() => toggleSubmenu('cadastros')}>
                <SidebarSubItem label="Categorias" active={activePage === 'categories'} icon={<Tag size={16} />} onClick={() => handlePageChange('categories')} />
                <SidebarSubItem label="Contas Bancárias" icon={<Landmark size={16} />} onClick={() => handlePageChange('accounts')} />
                <SidebarSubItem label="Clientes e Fornecedores" active={activePage === 'contacts'} icon={<Users size={16} />} onClick={() => handlePageChange('contacts')} />
                <SidebarSubItem label="Projetos" active={activePage === 'projects'} icon={<FolderKanban size={16} />} onClick={() => handlePageChange('projects')} />
              </SidebarCollapse>
            </nav>

            <div className="p-4 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/20 font-black"
              >
                <LogOut size={20} />
                <span className="text-[11px] uppercase tracking-widest">Sair do Sistema</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-950 border-b dark:border-slate-800 px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-4">
            <span className="font-black text-emerald-600 dark:text-emerald-500 text-2xl tracking-tighter select-none">Gestão Fácil</span>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-[0.2em]">{currentWorkspace?.name}</div>
          </div>

          <div className="flex items-center gap-4">
            {/* Workspace Selector */}
            <div className="relative">
              <button 
                onClick={() => { setIsWsMenuOpen(!isWsMenuOpen); setIsUserMenuOpen(false); }} 
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                {currentWorkspace?.type} <ChevronDown size={14} className={`transition-transform ${isWsMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isWsMenuOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-[24px] shadow-2xl z-50 py-2 w-64 animate-in fade-in zoom-in-95 border-2 border-emerald-500/10">
                  <p className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border-b dark:border-slate-700 mb-2">Alternar Workspace</p>
                  {workspaces.map(ws => (
                    <button key={ws.id} onClick={() => { setCurrentWorkspace(ws); setIsWsMenuOpen(false); }} className={`w-full text-left px-5 py-4 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 font-bold flex items-center justify-between transition-colors ${currentWorkspace?.id === ws.id ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' : 'text-slate-600 dark:text-slate-400'}`}>
                      {ws.name}
                      {currentWorkspace?.id === ws.id && <CheckCircle size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsWsMenuOpen(false); }}
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-700 dark:text-slate-200 border-2 border-transparent hover:border-emerald-500/30 transition-all active:scale-90"
              >
                {user?.name?.[0].toUpperCase() || 'U'}
              </button>
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-[24px] shadow-2xl z-50 py-2 w-64 animate-in fade-in zoom-in-95 border-2 border-slate-500/10">
                  <div className="px-5 py-4 border-b dark:border-slate-700 mb-2">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email}</p>
                  </div>
                  <button onClick={() => handlePageChange('settings')} className="w-full text-left px-5 py-4 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 font-bold transition-colors">
                    <UserIcon size={16} className="text-slate-400" /> Meu Perfil
                  </button>
                  <div className="h-[1px] bg-slate-100 dark:bg-slate-700 my-2 mx-5"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-4 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 flex items-center gap-3 font-black uppercase tracking-widest transition-colors"
                  >
                    <LogOut size={16} /> Sair do Sistema
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto bg-[#f8fafc] dark:bg-slate-900 scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => addTransaction({ description: 'Lançamento Rápido' })} 
        className="fixed bottom-10 right-10 w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[60] group"
      >
        <Plus size={36} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};

const SidebarItem: React.FC<{ active?: boolean; icon: React.ReactNode; label: string; onClick?: () => void; hasStar?: boolean }> = ({ active, icon, label, onClick, hasStar }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-[18px] transition-all group ${active ? 'bg-emerald-50 text-emerald-600 font-black dark:bg-emerald-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'}`}>
    <span className={`${active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'} transition-colors`}>{icon}</span>
    <span className="text-[13px] flex-1 text-left">{label}</span>
    {hasStar && <Star size={14} className={active ? 'text-emerald-600' : 'text-slate-200 dark:text-slate-800'} />}
  </button>
);

const SidebarCollapse: React.FC<{ icon: React.ReactNode; label: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ icon, label, isOpen, onToggle, children }) => (
  <div className="space-y-1">
    <button onClick={onToggle} className="w-full flex items-center gap-4 px-4 py-3 rounded-[18px] transition-all text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold group">
      <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{icon}</span>
      <span className="text-[13px] flex-1 text-left">{label}</span>
      <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="pl-8 pr-2 space-y-1 animate-in slide-in-from-top-2">{children}</div>}
  </div>
);

const SidebarSubItem: React.FC<{ label: string; onClick?: () => void; active?: boolean; hasStar?: boolean; icon?: React.ReactNode }> = ({ label, onClick, active, hasStar, icon }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-[12px] text-left transition-all ${active ? 'text-emerald-600 font-black bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'}`}>
    {icon && <span className="opacity-70">{icon}</span>}
    <span className="flex-1">{label}</span>
    {hasStar && <Star size={12} className={active ? 'text-emerald-600' : 'text-slate-200'} />}
  </button>
);

export default Layout;
