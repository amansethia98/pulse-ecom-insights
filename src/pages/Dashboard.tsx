
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-6">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          restaurants={dashboardData?.restaurants || []}
          branches={dashboardData?.branches || []}
          loading={loading}
        />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-3 text-gray-600">Loading data...</span>
          </div>
        ) : dashboardData ? (
          <TrendTable 
            data={dashboardData.data} 
            filters={filters}
            activeTab={activeTab}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">No data available</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
