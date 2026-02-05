
import React from 'react';
import { History, Shield, User as UserIcon, Clock } from 'lucide-react';
import { useApp } from '../AppContext';

const AuditLogs: React.FC = () => {
  const { auditLogs, currentWorkspace } = useApp();

  const filteredLogs = auditLogs.filter(log => log.workspaceId === currentWorkspace.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trilha de Auditoria</h1>
        <p className="text-slate-500 dark:text-slate-400">Histórico detalhado de todas as ações realizadas.</p>
      </header>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Evento</th>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filteredLogs.map(log => (
                <tr key={log.id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <Shield size={16} className="text-blue-500" />
                      <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <UserIcon size={14} />
                      {log.userId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <Clock size={14} />
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500 italic">
                    Nenhum log registrado para este período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
