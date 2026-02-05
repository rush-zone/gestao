
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Loader2, CreditCard } from 'lucide-react';

export const AuthPages: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-500/40">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Gestão Fácil</h1>
          <p className="text-slate-500 mt-2">Sua vida financeira em um só lugar.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Seu Nome</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold" placeholder="Ex: João Silva" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold" placeholder="email@exemplo.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold" placeholder="••••••••" />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold text-center">{error}</p>}

            <button disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
              {loading ? <Loader2 size={24} className="animate-spin" /> : (isLogin ? 'Entrar Agora' : 'Criar Conta')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
              {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center gap-8 grayscale opacity-20">
           <div className="flex items-center gap-2"><CreditCard size={16}/> VISA</div>
           <div className="flex items-center gap-2"><CreditCard size={16}/> MASTERCARD</div>
        </div>
      </div>
    </div>
  );
};
