
import React, { useState } from 'react';
import SparklineChart from './SparklineChart';

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

  // Generate mock months for demonstration
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

  // Generate mock data for demonstration
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80">
                Metric
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Trend
              </th>
              {months.map(month => (
                <th key={month} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                MoM %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMetrics.map((metric, index) => {
              const mockData = generateMockData(metric.id);
              const isExpanded = expandedRows.has(metric.id);
              const lastValue = mockData[mockData.length - 1];
              const secondLastValue = mockData[mockData.length - 2];
              const momChange = calculateMoM(lastValue, secondLastValue);

              return (
                <React.Fragment key={metric.id}>
                  {/* Main Metric Row */}
                  <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="sticky left-0 bg-inherit px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleRowExpansion(metric.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                        </button>
                        <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SparklineChart data={mockData} color="#0ea5e9" />
                    </td>
                    {mockData.map((value, valueIndex) => (
                      <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(value, metric.id)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-1">
                        <span className={momChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {momChange >= 0 ? '▲' : '▼'}
                        </span>
                        <span className={momChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {Math.abs(momChange).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Platform Breakdown */}
                  {isExpanded && (
                    <>
                      <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="sticky left-0 bg-inherit px-6 py-4 whitespace-nowrap pl-12">
                          <span className="text-sm text-gray-600">Zomato</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <SparklineChart data={generateMockData(metric.id, 'zomato')} color="#ef4f5f" />
                        </td>
                        {generateMockData(metric.id, 'zomato').map((value, valueIndex) => (
                          <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatValue(value, metric.id)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="text-green-600">▲</span>
                            <span className="text-green-600">2.1%</span>
                          </div>
                        </td>
                      </tr>
                      <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="sticky left-0 bg-inherit px-6 py-4 whitespace-nowrap pl-12">
                          <span className="text-sm text-gray-600">Swiggy</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <SparklineChart data={generateMockData(metric.id, 'swiggy')} color="#ff5200" />
                        </td>
                        {generateMockData(metric.id, 'swiggy').map((value, valueIndex) => (
                          <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatValue(value, metric.id)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="text-red-600">▼</span>
                            <span className="text-red-600">1.3%</span>
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
  );
};

export default TrendTable;
