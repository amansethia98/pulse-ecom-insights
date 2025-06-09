
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import TrendTable from '../components/TrendTable';

interface DashboardData {
  restaurants: string[];
  branches: string[];
  data: any[];
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [filters, setFilters] = useState({
    restaurant: '',
    branches: [] as string[],
    platform: 'All',
    timeFrame: 'Last 3 Months',
    customStartMonth: '',
    customEndMonth: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since we don't have a backend
      const mockData = {
        restaurants: user?.role === 'admin' ? ['Restaurant A', 'Restaurant B'] : [user?.restaurant || ''],
        branches: ['Branch 1', 'Branch 2', 'Branch 3'],
        data: []
      };
      setDashboardData(mockData);
      
      if (mockData.restaurants.length === 1) {
        setFilters(prev => ({ ...prev, restaurant: mockData.restaurants[0] }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-pink-400 border-l-blue-400 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="space-y-8 p-6">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            restaurants={dashboardData?.restaurants || []}
            branches={dashboardData?.branches || []}
            loading={loading}
          />

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-pink-400 border-l-blue-400 rounded-full animate-spin animate-reverse"></div>
              </div>
              <span className="ml-4 text-slate-300 font-medium">Loading data...</span>
            </div>
          ) : dashboardData ? (
            <TrendTable 
              data={dashboardData.data} 
              filters={filters}
              activeTab={activeTab}
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-slate-400 text-lg font-medium">No data available</div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Dashboard;
