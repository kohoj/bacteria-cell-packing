import React, { useState, useEffect } from 'react';
import { CirclePackingChart } from './components/circle-packing-chart';
import { HierarchyNode } from './types';
import hierarchyData from './data/hierarchy-data.json';

const App: React.FC = () => {
  const [data, setData] = useState<HierarchyNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setData(hierarchyData as HierarchyNode);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visualization...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No data available</h2>
          <p className="text-gray-600">Unable to load hierarchy data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Bacteria Cell Packing Visualization
            </h1>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Built with React + Vite + TailwindCSS</p>
              <p className="text-xs">Click to zoom in or out</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CirclePackingChart 
            data={data} 
            width={928} 
            height={928}
            className="mx-auto"
          />
        </div>
      </main>
    </div>
  );
};

export default App;