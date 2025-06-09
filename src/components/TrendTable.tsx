import React, { useState } from 'react';
import SparklineChart from './SparklineChart';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface TrendTableProps {
  data: any[];
  filters: any;
  activeTab: string;
}

const mockMetrics = [
  { id: 'orders', name: 'Total Orders', category: 'sales' },
  { id: 'gmv', name: 'Gross Merchandise Value', category: 'sales' },
  { id: 'aov', name: 'Average Order Value', category: 'sales' },
  { id: 'revenue', name: 'Net Revenue', category: 'sales' },
  { id: 'customers', name: 'Unique Customers', category: 'customers' },
  { id: 'repeat_rate', name: 'Repeat Customer Rate', category: 'customers' },
  { id: 'conversion', name: 'Conversion Rate', category: 'conversion' },
  { id: 'cart_abandonment', name: 'Cart Abandonment Rate', category: 'conversion' },
];

const TrendTable: React.FC<TrendTableProps> = ({ data, filters, activeTab }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (metricId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(metricId)) {
      newExpanded.delete(metricId);
    } else {
      newExpanded.add(metricId);
    }
    setExpandedRows(newExpanded);
  };

  const generateMockMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date.toISOString().slice(0, 7));
    }
    return months;
  };

  const months = generateMockMonths();
  const filteredMetrics = mockMetrics.filter(metric => metric.category === activeTab);

  const generateMockData = (metricId: string, platform?: string) => {
    return months.map(() => Math.floor(Math.random() * 1000) + 100);
  };

  const calculateMoM = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatValue = (value: number, metricId: string) => {
    if (metricId.includes('rate') || metricId.includes('conversion')) {
      return `${value.toFixed(1)}%`;
    }
    if (metricId.includes('gmv') || metricId.includes('revenue') || metricId.includes('aov')) {
      return `₹${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
      <div className="relative overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-white/5 backdrop-blur-sm border-b border-white/10">
                <th className="sticky left-0 bg-white/5 backdrop-blur-sm px-8 py-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-80 border-r border-white/10">
                  Metric
                </th>
                <th className="px-6 py-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-24 border-r border-white/10">
                  Trend
                </th>
                {months.map(month => (
                  <th key={month} className="px-6 py-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-32 border-r border-white/10">
                    {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </th>
                ))}
                <th className="px-6 py-6 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-24">
                  MoM %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMetrics.map((metric, index) => {
                const mockData = generateMockData(metric.id);
                const isExpanded = expandedRows.has(metric.id);
                const lastValue = mockData[mockData.length - 1];
                const secondLastValue = mockData[mockData.length - 2];
                const momChange = calculateMoM(lastValue, secondLastValue);

                return (
                  <React.Fragment key={metric.id}>
                    {/* Main Metric Row */}
                    <tr className="hover:bg-white/5 transition-all duration-300 group">
                      <td className="sticky left-0 bg-white/5 backdrop-blur-sm px-8 py-6 border-r border-white/10">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleRowExpansion(metric.id)}
                            className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                          >
                            <ChevronRight className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                          <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors duration-300">
                            {metric.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 border-r border-white/10">
                        <SparklineChart data={mockData} color="#06b6d4" />
                      </td>
                      {mockData.map((value, valueIndex) => (
                        <td key={valueIndex} className="px-6 py-6 text-sm text-slate-200 font-medium border-r border-white/10">
                          {formatValue(value, metric.id)}
                        </td>
                      ))}
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-2">
                          {momChange >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-sm font-bold ${momChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {Math.abs(momChange).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Platform Breakdown */}
                    {isExpanded && (
                      <>
                        <tr className="bg-white/[0.02] hover:bg-white/5 transition-all duration-300">
                          <td className="sticky left-0 bg-white/[0.02] backdrop-blur-sm px-8 py-4 pl-16 border-r border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                              <span className="text-sm text-slate-300">Zomato</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 border-r border-white/10">
                            <SparklineChart data={generateMockData(metric.id, 'zomato')} color="#ef4f5f" />
                          </td>
                          {generateMockData(metric.id, 'zomato').map((value, valueIndex) => (
                            <td key={valueIndex} className="px-6 py-4 text-sm text-slate-300 border-r border-white/10">
                              {formatValue(value, metric.id)}
                            </td>
                          ))}
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 text-sm font-medium">2.1%</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="bg-white/[0.02] hover:bg-white/5 transition-all duration-300">
                          <td className="sticky left-0 bg-white/[0.02] backdrop-blur-sm px-8 py-4 pl-16 border-r border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                              <span className="text-sm text-slate-300">Swiggy</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 border-r border-white/10">
                            <SparklineChart data={generateMockData(metric.id, 'swiggy')} color="#ff5200" />
                          </td>
                          {generateMockData(metric.id, 'swiggy').map((value, valueIndex) => (
                            <td key={valueIndex} className="px-6 py-4 text-sm text-slate-300 border-r border-white/10">
                              {formatValue(value, metric.id)}
                            </td>
                          ))}
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <TrendingDown className="w-4 h-4 text-red-400" />
                              <span className="text-red-400 text-sm font-medium">1.3%</span>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrendTable;
