
import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { AppProvider, useApp } from './AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Conciliation from './pages/Conciliation';
import AuditLogs from './pages/AuditLogs';
import Accounts from './pages/Accounts';
import PayablesReceivables from './pages/PayablesReceivables';
import Onboarding from './pages/Onboarding';
import Projects from './pages/Projects';
import Goals from './pages/Goals';
import Budget from './pages/Budget';
import CostCenters from './pages/CostCenters';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Investments from './pages/Investments';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Contacts from './pages/Contacts';
import PaymentMethods from './pages/PaymentMethods';
import Tags from './pages/Tags';
import { AuthPages } from './pages/AuthPages';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { isOnboarded } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <AuthPages />;
  if (!isOnboarded) return <Onboarding />;

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'conciliation': return <Conciliation />;
      case 'audit': return <AuditLogs />;
      case 'accounts': return <Accounts />;
      case 'payables': return <PayablesReceivables />;
      case 'projects': return <Projects />;
      case 'budget': return <Budget />;
      case 'cost_centers': return <CostCenters />;
      case 'goals': return <Goals />;
      case 'investments': return <Investments />;
      case 'users': return <Users />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      case 'categories': return <Categories />;
      case 'contacts': return <Contacts />;
      case 'payment_methods': return <PaymentMethods />;
      case 'tags': return <Tags />;
      default: return <Dashboard />;
    }
  };

  return (
    <HashRouter>
      <Layout activePage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
