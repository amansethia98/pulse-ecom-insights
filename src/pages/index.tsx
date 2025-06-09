
import React, { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import FilterBar from '../components/FilterBar';
import TrendTable from '../components/TrendTable';
import { useRouter } from 'next/router';

interface DashboardData {
  restaurants: string[];
  branches: string[];
  data: any[];
}

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
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
    fetchDashboardData();
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard-data');
      const data = await response.json();
      setDashboardData(data);
      
      // Set default restaurant if user has access to only one
      if (data.restaurants.length === 1) {
        setFilters(prev => ({ ...prev, restaurant: data.restaurants[0] }));
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

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-6">
        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          restaurants={dashboardData?.restaurants || []}
          branches={dashboardData?.branches || []}
          loading={loading}
        />

        {/* Main Content */}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Dashboard;
