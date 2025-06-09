
import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'sales', name: 'Sales & Revenue Performance', icon: '📊' },
  { id: 'customers', name: 'Order Characteristics & Customer Segmentation', icon: '👥' },
  { id: 'conversion', name: 'Conversion Funnel', icon: '🧭' },
  { id: 'discounts', name: 'Discounts & Promotions', icon: '🏷️' },
  { id: 'ads', name: 'Ad Performance', icon: '📢' },
  { id: 'operations', name: 'Operational & Quality Metrics', icon: '⚙️' },
  { id: 'costs', name: 'Costs, Commissions & Taxes', icon: '🧾' },
  { id: 'financial', name: 'Financial Health', icon: '💰' },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { data: session } = useSession();

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo and Branding */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pulse</h1>
              <p className="text-xs text-gray-500">by ecomnomics</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-100 text-sky-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="truncate">{tab.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Session */}
        {session && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">{session.user?.email}</div>
            <button
              onClick={() => signOut()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <span className="text-2xl">{activeTabData.icon}</span>
            <span>{activeTabData.name}</span>
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
