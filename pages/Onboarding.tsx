
import React, { useState } from 'react';
import { 
  ShieldCheck, User, Building2, ChevronRight, 
  Coins, LayoutTemplate, Moon, Sun, CheckCircle2
} from 'lucide-react';
import { useApp } from '../AppContext';
import { useAuth } from '../AuthContext';
import { WorkspaceType } from '../types';

const Onboarding: React.FC = () => {
  const { completeOnboarding, darkMode, toggleDarkMode } = useApp();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: '',
    type: WorkspaceType.PERSONAL,
    currency: 'BRL',
    regime: 'CAIXA' as 'CAIXA' | 'COMPETENCIA'
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleFinish = async () => {
    await completeOnboarding({
      name: config.name || (config.type === WorkspaceType.PERSONAL ? 'Minhas Finanças' : 'Minha Empresa'),
      type: config.type,
      currency: config.currency,
      regime: config.regime
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-8 text-center">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${step === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-800'}`}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Bem-vindo ao Gestão Fácil</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg">Vamos começar configurando seu primeiro workspace financeiro.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setConfig({...config, type: WorkspaceType.PERSONAL})}
                className={`p-8 rounded-[32px] border-4 transition-all text-left space-y-4 ${config.type === WorkspaceType.PERSONAL ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
              >
                <div className={`p-4 rounded-2xl w-fit ${config.type === WorkspaceType.PERSONAL ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Perfil Pessoal</h3>
                  <p className="text-sm text-slate-500">Controle doméstico, metas de economia e lazer.</p>
                </div>
              </button>

              <button 
                onClick={() => setConfig({...config, type: WorkspaceType.BUSINESS})}
                className={`p-8 rounded-[32px] border-4 transition-all text-left space-y-4 ${config.type === WorkspaceType.BUSINESS ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
              >
                <div className={`p-4 rounded-2xl w-fit ${config.type === WorkspaceType.BUSINESS ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Perfil Empresa</h3>
                  <p className="text-sm text-slate-500">Projetos, NF-e, custos e equipe.</p>
                </div>
              </button>
            </div>
            
            <button 
              onClick={handleNext}
              className="mt-12 w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all"
            >
              Continuar <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Detalhes do Perfil</h2>
              <p className="text-slate-500">Personalize o nome e moeda do seu workspace.</p>
            </div>
            
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Nome do Workspace</label>
                <input 
                  type="text" 
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  placeholder={config.type === WorkspaceType.PERSONAL ? "Ex: Minhas Finanças" : "Ex: Minha Empresa Ltda"}
                  className="w-full bg-slate-100 dark:bg-slate-900 p-5 rounded-[24px] outline-none border-2 border-transparent focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Moeda Principal</label>
                  <select className="w-full bg-slate-100 dark:bg-slate-900 p-5 rounded-[24px] outline-none border-2 border-transparent focus:border-blue-500 font-bold appearance-none">
                    <option value="BRL">BRL (R$)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Regime Padrão</label>
                  <select 
                    value={config.regime}
                    onChange={(e) => setConfig({...config, regime: e.target.value as any})}
                    className="w-full bg-slate-100 dark:bg-slate-900 p-5 rounded-[24px] outline-none border-2 border-transparent focus:border-blue-500 font-bold appearance-none"
                  >
                    <option value="CAIXA">Caixa</option>
                    <option value="COMPETENCIA">Competência</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-5 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 rounded-[24px] transition-all">Voltar</button>
              <button onClick={handleNext} className="flex-[2] py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">Avançar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in zoom-in duration-500 space-y-12">
            <div className="relative">
              <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-[48px] flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle2 size={64} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Tudo Pronto!</h2>
              <p className="text-slate-500">Seu ambiente de gestão personalizada foi criado com sucesso.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300">
                    {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 dark:text-white">Experiência Visual</h4>
                    <p className="text-xs text-slate-500">Alternar modo claro/escuro agora?</p>
                  </div>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`w-14 h-8 rounded-full transition-all p-1.5 ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                   <div className={`w-5 h-5 bg-white rounded-full shadow transition-all transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full py-6 bg-green-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-green-500/20 hover:scale-[1.02] transition-all"
            >
              Finalizar e Começar
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
