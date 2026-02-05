
import React, { useState } from 'react';
import { 
  LayoutDashboard, Building2, FileText, Receipt, Scale, 
  Zap, Crosshair, ArrowRightLeft, List, TrendingUp, 
  CheckCircle, TableProperties, CreditCard, Flag, 
  PieChart, CircleDot, PiggyBank, BarChartBig, 
  BookOpen, Layers, Tag, Landmark, Users, 
  Wallet, FolderKanban, Tags, Paperclip, DollarSign, 
  Wand2, Upload, Lock, Settings, ChevronDown, 
  Star, Sun, Moon, ArrowLeft, Search, HelpCircle, 
  Calculator, Gift, Plus, ChevronRight, Menu, ChevronUp, Calendar
} from 'lucide-react';
import { useApp } from '../AppContext';
import { useAuth } from '../AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onPageChange }) => {
  const { 
    currentWorkspace, workspaces, setCurrentWorkspace, 
    darkMode, toggleDarkMode, addTransaction 
  } = useApp();
  const { user } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWsMenuOpen, setIsWsMenuOpen] = useState(false);
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
  };

  return (
    <div className={`min-h-screen flex bg-[#f8fafc] ${darkMode ? 'dark:bg-slate-900 text-slate-100' : 'text-slate-900'} transition-colors duration-200 overflow-hidden h-screen`}>
      
      {/* Mini Sidebar */}
      <aside className="w-16 bg-[#f0f2f5] dark:bg-slate-950 border-r dark:border-slate-800 flex flex-col items-center py-4 shrink-0 h-full z-50">
        <button onClick={() => setIsSidebarOpen(true)} className="p-3 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all mb-8"><Menu size={24} /></button>
        <div className="flex-1 flex flex-col items-center gap-4 text-slate-500">
           <button className="p-1 hover:text-slate-800 transition-colors"><ChevronUp size={18}/></button>
           <div className="flex flex-col items-center text-[11px] font-medium leading-tight">
             <span>fev</span>
             <span className="font-bold text-sm">26</span>
           </div>
           <button className="p-1 hover:text-slate-800 transition-colors"><ChevronDown size={18}/></button>
           <button className="p-2 mt-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all"><Calendar size={20} className="text-slate-400" /></button>
           <div className="w-8 h-[1px] bg-slate-300 dark:bg-slate-800 my-2"></div>
           <button onClick={() => handlePageChange('settings')} className={`p-2 rounded-lg transition-all ${activePage === 'settings' ? 'bg-white dark:bg-slate-800 text-blue-600' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}><Settings size={20} /></button>
        </div>
      </aside>

      {/* Drawer Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSidebarOpen(false)}></div>
          <aside className="relative w-[280px] bg-white dark:bg-slate-950 shadow-2xl flex flex-col h-full overflow-y-auto animate-in slide-in-from-left">
            <div className="p-4 flex items-center justify-between text-slate-400 border-b dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-950 z-10 h-14">
               <div className="flex items-center gap-3">
                  <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ArrowLeft size={18} /></button>
                  <span className="text-sm font-medium">Menu</span>
               </div>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-x-hidden">
              <SidebarItem active={activePage === 'dashboard'} onClick={() => handlePageChange('dashboard')} icon={<LayoutDashboard size={20} />} label="Visão geral" />
              <SidebarCollapse icon={<Building2 size={20} />} label="Gestão do Negócio" isOpen={openSubmenus.gestao} onToggle={() => toggleSubmenu('gestao')}>
                <SidebarSubItem label="Balanço patrimonial" icon={<Scale size={16} />} onClick={() => handlePageChange('reports')} />
                <SidebarSubItem label="Planejamento" icon={<Crosshair size={16} />} onClick={() => handlePageChange('goals')} />
              </SidebarCollapse>
              <SidebarCollapse icon={<ArrowRightLeft size={20} />} label="Movimentações" isOpen={openSubmenus.movimentacoes} onToggle={() => toggleSubmenu('movimentacoes')}>
                <SidebarSubItem label="Lançamentos" active={activePage === 'transactions'} onClick={() => handlePageChange('transactions')} icon={<List size={16} />} hasStar />
                <SidebarSubItem label="A pagar e receber" active={activePage === 'payables'} onClick={() => handlePageChange('payables')} icon={<Receipt size={16} />} />
              </SidebarCollapse>
              <SidebarItem icon={<TableProperties size={20} />} label="Extrato de contas" onClick={() => handlePageChange('conciliation')} active={activePage === 'conciliation'} hasStar />
              <SidebarItem icon={<CreditCard size={20} />} label="Cartões de crédito" onClick={() => handlePageChange('accounts')} active={activePage === 'accounts'} hasStar />
              <SidebarCollapse icon={<Flag size={20} />} label="Metas" isOpen={openSubmenus.metas} onToggle={() => toggleSubmenu('metas')}>
                <SidebarSubItem label="Orçamento" active={activePage === 'budget'} icon={<PieChart size={16} />} onClick={() => handlePageChange('budget')} />
                <SidebarSubItem label="Centros" active={activePage === 'cost_centers'} icon={<CircleDot size={16} />} onClick={() => handlePageChange('cost_centers')} />
              </SidebarCollapse>
              <SidebarItem icon={<BarChartBig size={20} />} label="Relatórios" onClick={() => handlePageChange('reports')} active={activePage === 'reports'} />
              <SidebarCollapse icon={<Layers size={20} />} label="Cadastros" isOpen={openSubmenus.cadastros} onToggle={() => toggleSubmenu('cadastros')}>
                <SidebarSubItem label="Categorias" active={activePage === 'categories'} icon={<Tag size={16} />} onClick={() => handlePageChange('categories')} />
                <SidebarSubItem label="Contas" icon={<Landmark size={16} />} onClick={() => handlePageChange('accounts')} />
                <SidebarSubItem label="Contatos" active={activePage === 'contacts'} icon={<Users size={16} />} onClick={() => handlePageChange('contacts')} />
                <SidebarSubItem label="Formas de Pagto" active={activePage === 'payment_methods'} icon={<Wallet size={16} />} onClick={() => handlePageChange('payment_methods')} />
                <SidebarSubItem label="Projetos" active={activePage === 'projects'} icon={<FolderKanban size={16} />} onClick={() => handlePageChange('projects')} />
                <SidebarSubItem label="Tags" active={activePage === 'tags'} icon={<Tags size={16} />} onClick={() => handlePageChange('tags')} />
              </SidebarCollapse>
              <SidebarItem icon={<Settings size={20} />} label="Configurações" onClick={() => handlePageChange('settings')} active={activePage === 'settings'} />
            </nav>
          </aside>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white dark:bg-slate-950 border-b dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
          <div className="font-bold text-slate-700 dark:text-white text-sm">{currentWorkspace?.name}</div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setIsWsMenuOpen(!isWsMenuOpen)} className="flex items-center gap-2 px-4 py-1.5 bg-[#10b981] text-white text-xs font-bold rounded-lg">{currentWorkspace?.type === 'BUSINESS' ? 'Empresa' : 'Pessoal'} <ChevronDown size={14} /></button>
              {isWsMenuOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-xl z-50 py-1 w-48 overflow-hidden">
                  {workspaces.map(ws => (
                    <button key={ws.id} onClick={() => { setCurrentWorkspace(ws); setIsWsMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 font-medium ${currentWorkspace?.id === ws.id ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 dark:text-slate-300'}`}>{ws.name}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 border dark:border-slate-700">{user?.name?.[0].toUpperCase() || 'U'}</button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-[#f8fafc] dark:bg-slate-900 scrollbar-hide"><div className="max-w-[1600px] mx-auto">{children}</div></main>
      </div>
      <button onClick={() => addTransaction({ description: 'Lançamento Rápido' })} className="fixed bottom-6 right-6 w-14 h-14 bg-[#10b981] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[60]"><Plus size={32} /></button>
    </div>
  );
};

const SidebarItem: React.FC<{ active?: boolean; icon: React.ReactNode; label: string; onClick?: () => void; hasStar?: boolean }> = ({ active, icon, label, onClick, hasStar }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${active ? 'bg-emerald-50 text-emerald-600 font-bold dark:bg-emerald-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-medium'}`}>
    <span className={active ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}>{icon}</span>
    <span className="text-[13px] flex-1 text-left">{label}</span>
    {hasStar && <Star size={14} className={`group-hover:text-slate-400 transition-colors ${active ? 'text-emerald-600' : 'text-slate-200 dark:text-slate-700'}`} />}
  </button>
);

const SidebarCollapse: React.FC<{ icon: React.ReactNode; label: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ icon, label, isOpen, onToggle, children }) => (
  <div className="space-y-1">
    <button onClick={onToggle} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-medium`}>
      <span>{icon}</span>
      <span className="text-[13px] flex-1 text-left">{label}</span>
      <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && <div className="pl-6 pr-2 space-y-0.5 animate-in slide-in-from-top-1">{children}</div>}
  </div>
);

const SidebarSubItem: React.FC<{ label: string; onClick?: () => void; active?: boolean; hasStar?: boolean; icon?: React.ReactNode }> = ({ label, onClick, active, hasStar, icon }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg text-[13px] text-left transition-all ${active ? 'text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
    {icon && <span className="mr-1">{icon}</span>}
    <span className="flex-1">{label}</span>
    {hasStar && <Star size={12} className={active ? 'text-emerald-600' : 'text-slate-200 dark:text-slate-700'} />}
  </button>
);

export default Layout;
