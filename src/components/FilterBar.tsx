import React from 'react';
import { Filter, Calendar, Building, Globe } from 'lucide-react';

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
      <div className="relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
        <div className="relative p-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-6 h-6 bg-slate-700 rounded-lg"></div>
              <div className="h-6 bg-slate-700 rounded-lg w-24"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-slate-700/50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableBranches = ['All Branches', ...branches];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"></div>
      <div className="relative p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Filters
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Restaurant Filter - Only show if multiple restaurants */}
          {restaurants.length > 1 && (
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Restaurant</span>
              </label>
              <select
                value={filters.restaurant}
                onChange={(e) => handleFilterUpdate('restaurant', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-slate-400 transition-all duration-300"
              >
                <option value="" className="bg-slate-800 text-white">Select Restaurant</option>
                {restaurants.map(restaurant => (
                  <option key={restaurant} value={restaurant} className="bg-slate-800 text-white">
                    {restaurant}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Branch Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
              <Building className="w-4 h-4 text-purple-400" />
              <span>Branches</span>
            </label>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 max-h-32 overflow-y-auto space-y-2 scrollbar-hide">
                {availableBranches.map(branch => (
                  <label key={branch} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.branches.includes(branch)}
                      onChange={() => handleBranchToggle(branch)}
                      className="w-4 h-4 text-cyan-500 bg-transparent border-2 border-white/30 rounded focus:ring-cyan-500/50 focus:ring-2"
                    />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{branch}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
              <Globe className="w-4 h-4 text-pink-400" />
              <span>Platform</span>
            </label>
            <select
              value={filters.platform}
              onChange={(e) => handleFilterUpdate('platform', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-slate-400 transition-all duration-300"
            >
              <option value="All" className="bg-slate-800 text-white">All Platforms</option>
              <option value="Zomato" className="bg-slate-800 text-white">Zomato</option>
              <option value="Swiggy" className="bg-slate-800 text-white">Swiggy</option>
            </select>
          </div>

          {/* Time Frame Filter */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <span>Time Frame</span>
            </label>
            <select
              value={filters.timeFrame}
              onChange={(e) => handleFilterUpdate('timeFrame', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-slate-400 transition-all duration-300"
            >
              <option value="Last 3 Months" className="bg-slate-800 text-white">Last 3 Months</option>
              <option value="Last 6 Months" className="bg-slate-800 text-white">Last 6 Months</option>
              <option value="Custom" className="bg-slate-800 text-white">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {filters.timeFrame === 'Custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                Start Month
              </label>
              <input
                type="month"
                value={filters.customStartMonth}
                onChange={(e) => handleFilterUpdate('customStartMonth', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white transition-all duration-300"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                End Month
              </label>
              <input
                type="month"
                value={filters.customEndMonth}
                onChange={(e) => handleFilterUpdate('customEndMonth', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white transition-all duration-300"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
