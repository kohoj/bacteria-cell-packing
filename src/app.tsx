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
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-gray-50">
      <CirclePackingChart 
        data={data} 
        className="w-full h-full"
      />
    </div>
  );
};

export default App;