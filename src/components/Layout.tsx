
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'sales', label: 'Sales & Revenue Performance', icon: '📊' },
  { id: 'orders', label: 'Order Characteristics & Customer Segmentation', icon: '👥' },
  { id: 'conversion', label: 'Conversion Funnel', icon: '🧭' },
  { id: 'discounts', label: 'Discounts & Promotions', icon: '🏷️' },
  { id: 'ads', label: 'Ad Performance', icon: '📢' },
  { id: 'operations', label: 'Operational & Quality Metrics', icon: '⚙️' },
  { id: 'costs', label: 'Costs, Commissions & Taxes', icon: '🧾' },
  { id: 'financial', label: 'Financial Health', icon: '💰' },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getCurrentTabInfo = () => {
    return tabs.find(tab => tab.id === activeTab) || tabs[0];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo and Title */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pulse</h1>
              <p className="text-xs text-gray-500">by ecomnomics</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-100 text-sky-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">{user.email}</div>
            <button
              onClick={logout}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="mr-2">{getCurrentTabInfo().icon}</span>
            {getCurrentTabInfo().label}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
