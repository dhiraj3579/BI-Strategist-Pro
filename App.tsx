
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import RoadmapView from './components/RoadmapView';
import LandingPage from './components/LandingPage';
import { ProjectConfig, DashboardData } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [config, setConfig] = useState<ProjectConfig>({
    companyType: '',
    dataFields: '',
    biTool: 'Power BI',
    language: 'Python',
    industry: 'Retail',
    outputType: 'dashboard'
  });

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfigChange = useCallback((updates: Partial<ProjectConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setDashboardData(null);
    setRoadmap(null);

    try {
      if (config.outputType === 'dashboard') {
        const result = await geminiService.generateDashboard(config);
        setDashboardData(result);
      } else {
        const result = await geminiService.generateRoadmap(config);
        setRoadmap(result);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        config={config} 
        onChange={handleConfigChange} 
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />

      <main className="flex-1 overflow-y-auto px-6 pb-20">
        {!dashboardData && !roadmap && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">BI Strategist Pro</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Choose your mode: <strong>Live Viz</strong> for instant interactive dashboards, or <strong>Tech Plan</strong> for a comprehensive architectural roadmap.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-12 w-full max-w-lg mx-auto">
              <div 
                onClick={() => handleConfigChange({ outputType: 'dashboard' })}
                className={`p-6 bg-white rounded-xl border shadow-sm cursor-pointer transition-all hover:border-indigo-300 ${config.outputType === 'dashboard' ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-200'}`}
              >
                <p className="text-indigo-600 font-bold text-lg mb-2">Live Viz</p>
                <p className="text-sm text-slate-500">Instant charts & KPIs from your data file.</p>
              </div>
              <div 
                onClick={() => handleConfigChange({ outputType: 'roadmap' })}
                className={`p-6 bg-white rounded-xl border shadow-sm cursor-pointer transition-all hover:border-indigo-300 ${config.outputType === 'roadmap' ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-200'}`}
              >
                <p className="text-indigo-600 font-bold text-lg mb-2">Tech Plan</p>
                <p className="text-sm text-slate-500">Detailed PDF-style guide with Python & DAX code.</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full py-40">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="mt-8 text-slate-500 font-medium animate-pulse">
              {config.outputType === 'dashboard' ? 'Building Live Dashboard...' : 'Architecting Technical Roadmap...'}
            </p>
            <p className="text-slate-400 text-sm mt-2">
              {config.outputType === 'dashboard' ? 'Calculating aggregations and rendering charts.' : 'Drafting ML strategies and data schemas.'}
            </p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-20 p-6 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 bg-red-100 rounded-full flex-shrink-0 flex items-center justify-center text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-lg">Generation Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button 
                onClick={handleGenerate}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {dashboardData && config.outputType === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <DashboardView data={dashboardData} rawData={config.rawData || []} />
            <div className="flex justify-center py-10">
              <button 
                onClick={() => setDashboardData(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset & Start New Project
              </button>
            </div>
          </div>
        )}

        {roadmap && config.outputType === 'roadmap' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <RoadmapView content={roadmap} />
            <div className="flex justify-center py-10">
              <button 
                onClick={() => setRoadmap(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset & Start New Project
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
