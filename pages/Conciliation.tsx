
import React from 'react';
import { 
  Upload, FileText, CheckCircle, XCircle, 
  HelpCircle, Link as LinkIcon, RefreshCcw, Search
} from 'lucide-react';
import { useApp } from '../AppContext';

const Conciliation: React.FC = () => {
  const { bankItems, currentWorkspace, concileBankItem } = useApp();

  const filteredItems = bankItems.filter(item => item.workspaceId === currentWorkspace.id);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Conciliação Bancária</h1>
          <p className="text-slate-500 dark:text-slate-400">Combine extratos bancários com seus lançamentos.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all">
            <RefreshCcw size={18} />
            Atualizar
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">
            <Upload size={18} />
            Importar OFX/PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Status Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Pendente</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredItems.filter(i => i.status === 'PENDING').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Conciliado</p>
            <p className="text-2xl font-bold text-green-500">{filteredItems.filter(i => i.status === 'CONCILED').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Regras de Sugestão</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              O sistema sugere conciliações automaticamente baseado em:
              <br/><br/>
              1. Mesma data e valor<br/>
              2. Nome similar (ex: "Posto" e "Posto Ipiranga")<br/>
              3. Recorrências agendadas
            </p>
          </div>
        </div>

        {/* List of bank items */}
        <div className="lg:col-span-3 space-y-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-950 border dark:border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.status === 'CONCILED' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                  {item.status === 'CONCILED' ? <CheckCircle size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.description}</h4>
                  <p className="text-xs text-slate-500">{item.date} • No extrato bancário</p>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-end sm:items-center">
                <span className={`text-lg font-bold ${item.value < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-1 text-[10px] text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full animate-pulse mt-1">
                    <LinkIcon size={10} /> Sugestão encontrada
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {item.status === 'PENDING' ? (
                  <>
                    <button onClick={() => concileBankItem(item.id)} className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all">
                      Conciliar
                    </button>
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all">
                      Ignorar
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle size={14} /> Conciliado
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed dark:border-slate-800">
              <Search className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">Nenhum item de extrato encontrado para este workspace.</p>
              <button className="mt-4 text-blue-600 font-bold">Importar primeiro arquivo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conciliation;
