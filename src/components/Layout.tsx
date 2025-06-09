
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Users, TrendingUp, Tag, Megaphone, Settings, Receipt, Wallet, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'sales', label: 'Sales & Revenue Performance', icon: BarChart3 },
  { id: 'orders', label: 'Order Characteristics & Customer Segmentation', icon: Users },
  { id: 'conversion', label: 'Conversion Funnel', icon: TrendingUp },
  { id: 'discounts', label: 'Discounts & Promotions', icon: Tag },
  { id: 'ads', label: 'Ad Performance', icon: Megaphone },
  { id: 'operations', label: 'Operational & Quality Metrics', icon: Settings },
  { id: 'costs', label: 'Costs, Commissions & Taxes', icon: Receipt },
  { id: 'financial', label: 'Financial Health', icon: Wallet },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getCurrentTabInfo = () => {
    return tabs.find(tab => tab.id === activeTab) || tabs[0];
  };

  const currentTab = getCurrentTabInfo();
  const IconComponent = currentTab.icon;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Sidebar with glassmorphism */}
      <div className="w-80 relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border-r border-white/10"></div>
        <div className="relative h-full flex flex-col">
          {/* Logo and Title */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">P</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Pulse
                </h1>
                <p className="text-xs text-slate-400 font-medium">by ecomnomics</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-4 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 relative z-10">
                    <TabIcon className={`w-5 h-5 transition-colors ${
                      activeTab === tab.id ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                    }`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          {user && (
            <div className="p-4 border-t border-white/10">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-sm text-slate-300 mb-3 font-medium">{user.email}</div>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-slate-300 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border-b border-white/10"></div>
          <div className="relative px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-500/20">
                <IconComponent className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {currentTab.label}
              </h1>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
