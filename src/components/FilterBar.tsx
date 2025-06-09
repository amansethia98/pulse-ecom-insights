
import React from 'react';

interface FilterBarProps {
  filters: {
    restaurant: string;
    branches: string[];
    platform: string;
    timeFrame: string;
    customStartMonth: string;
    customEndMonth: string;
  };
  onFilterChange: (filters: any) => void;
  restaurants: string[];
  branches: string[];
  loading: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  restaurants,
  branches,
  loading
}) => {
  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset branches when restaurant changes
    if (key === 'restaurant') {
      newFilters.branches = [];
    }
    
    onFilterChange(newFilters);
  };

  const handleBranchToggle = (branch: string) => {
    let newBranches;
    if (branch === 'All Branches') {
      newBranches = filters.branches.includes('All Branches') ? [] : ['All Branches'];
    } else {
      const filteredBranches = filters.branches.filter(b => b !== 'All Branches');
      if (filteredBranches.includes(branch)) {
        newBranches = filteredBranches.filter(b => b !== branch);
      } else {
        newBranches = [...filteredBranches, branch];
      }
    }
    handleFilterUpdate('branches', newBranches);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const availableBranches = ['All Branches', ...branches];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Restaurant Filter - Only show if multiple restaurants */}
        {restaurants.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant
            </label>
            <select
              value={filters.restaurant}
              onChange={(e) => handleFilterUpdate('restaurant', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Select Restaurant</option>
              {restaurants.map(restaurant => (
                <option key={restaurant} value={restaurant}>
                  {restaurant}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Branch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branches
          </label>
          <div className="relative">
            <div className="border border-gray-300 rounded-lg p-2 max-h-32 overflow-y-auto">
              {availableBranches.map(branch => (
                <label key={branch} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.branches.includes(branch)}
                    onChange={() => handleBranchToggle(branch)}
                    className="text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm">{branch}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select
            value={filters.platform}
            onChange={(e) => handleFilterUpdate('platform', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="All">All Platforms</option>
            <option value="Zomato">Zomato</option>
            <option value="Swiggy">Swiggy</option>
          </select>
        </div>

        {/* Time Frame Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Frame
          </label>
          <select
            value={filters.timeFrame}
            onChange={(e) => handleFilterUpdate('timeFrame', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="Last 3 Months">Last 3 Months</option>
            <option value="Last 6 Months">Last 6 Months</option>
            <option value="Custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Custom Date Range */}
      {filters.timeFrame === 'Custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Month
            </label>
            <input
              type="month"
              value={filters.customStartMonth}
              onChange={(e) => handleFilterUpdate('customStartMonth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Month
            </label>
            <input
              type="month"
              value={filters.customEndMonth}
              onChange={(e) => handleFilterUpdate('customEndMonth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
