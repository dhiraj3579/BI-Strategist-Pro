import React, { useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { DashboardData, KPI, ChartConfig } from '../types';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, Copy, Check } from 'lucide-react';
import CountUp from 'react-countup';

interface DashboardViewProps {
  data: DashboardData;
  rawData: any[];
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Helper to safely parse numbers from various formats (e.g. "$1,200.50", "1,000")
const parseValue = (val: any): number => {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const clean = val.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

// Helper to find a key in the data object that matches the target key (fuzzy match)
const findMatchingKey = (dataRow: any, targetKey: string): string | undefined => {
  if (!dataRow) return undefined;
  const keys = Object.keys(dataRow);
  
  // 1. Exact match
  if (keys.includes(targetKey)) return targetKey;
  
  // 2. Case-insensitive match
  const lowerTarget = targetKey.toLowerCase();
  const caseMatch = keys.find(k => k.toLowerCase() === lowerTarget);
  if (caseMatch) return caseMatch;

  // 3. Fuzzy match (remove spaces, underscores, special chars)
  const normalize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const normalizedTarget = normalize(targetKey);
  const fuzzyMatch = keys.find(k => normalize(k) === normalizedTarget);
  if (fuzzyMatch) return fuzzyMatch;

  return undefined;
};

const KPICard: React.FC<{ kpi: KPI; rawData: any[]; index: number }> = ({ kpi, rawData, index }) => {
  const value = useMemo(() => {
    if (!rawData || rawData.length === 0) return 0;
    
    // Find the exact key in rawData that matches kpi.valueField (fuzzy fallback)
    const firstRow = rawData[0];
    const exactKey = findMatchingKey(firstRow, kpi.valueField);

    if (!exactKey) return 0;

    const validData = rawData.filter(d => d[exactKey] !== undefined && d[exactKey] !== null);
    
    if (kpi.aggregation === 'count') return validData.length;
    
    const values = validData.map(d => parseValue(d[exactKey]));

    if (kpi.aggregation === 'sum') return values.reduce((a, b) => a + b, 0);
    if (kpi.aggregation === 'avg') return values.reduce((a, b) => a + b, 0) / values.length;
    if (kpi.aggregation === 'max') return Math.max(...values);
    if (kpi.aggregation === 'min') return Math.min(...values);
    
    return 0;
  }, [kpi, rawData]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {kpi.format === 'currency' && '$'}
            <CountUp end={value} duration={2.5} separator="," decimals={value % 1 !== 0 ? 2 : 0} />
            {kpi.format === 'percentage' && '%'}
          </h3>
        </div>
        <div className={`p-2 rounded-lg ${
          kpi.trend === 'up' ? 'bg-green-50 text-green-600' : 
          kpi.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
        }`}>
          {kpi.trend === 'up' ? <ArrowUp size={20} /> : 
           kpi.trend === 'down' ? <ArrowDown size={20} /> : <Minus size={20} />}
        </div>
      </div>
    </motion.div>
  );
};

const ChartCard: React.FC<{ config: ChartConfig; rawData: any[]; index: number }> = ({ config, rawData, index }) => {
  const aggregationType = useMemo(() => {
    if (config.aggregation) return config.aggregation;
    
    // Auto-detect: if yAxisKey column is non-numeric, default to count
    if (rawData && rawData.length > 0) {
      const firstRow = rawData[0];
      const yKey = findMatchingKey(firstRow, config.yAxisKey);
      if (yKey) {
        const sampleVal = firstRow[yKey];
        // Check if it looks like a non-numeric string (e.g. "Task-123" or "High")
        // parseValue returns 0 for non-numeric strings. 
        // If original is a non-empty string and parsed is 0, it's likely text.
        const parsed = parseValue(sampleVal);
        if (typeof sampleVal === 'string' && sampleVal.trim() !== '' && parsed === 0) {
          return 'count';
        }
      }
    }
    return 'sum';
  }, [config, rawData]);

  const chartData = useMemo(() => {
    if (!rawData || rawData.length === 0) return { data: [], error: "No data loaded" };

    // Resolve keys (handle case mismatch)
    const firstRow = rawData[0];
    const xKey = findMatchingKey(firstRow, config.xAxisKey);
    const yKey = findMatchingKey(firstRow, config.yAxisKey);

    if (!xKey) return { data: [], error: `Column "${config.xAxisKey}" not found in data` };
    if (!yKey) return { data: [], error: `Column "${config.yAxisKey}" not found in data` };

    // Group by xAxisKey and aggregate yAxisKey
    const grouped = rawData.reduce((acc, curr) => {
      const key = curr[xKey];
      if (!key) return acc; // Skip undefined keys

      if (!acc[key]) acc[key] = { [config.xAxisKey]: key, [config.yAxisKey]: 0, count: 0, sum: 0 };
      
      const val = parseValue(curr[yKey]);
      
      // Aggregation Logic
      if (aggregationType === 'count') {
        // For count, we just increment if the row exists (or maybe check if yKey is present)
        acc[key][config.yAxisKey] += 1; 
      } else {
        // For sum/avg, we need the numeric value
        acc[key].sum += val;
        acc[key].count += 1;
        
        if (aggregationType === 'avg') {
           acc[key][config.yAxisKey] = acc[key].sum / acc[key].count;
        } else {
           // Default to sum
           acc[key][config.yAxisKey] = acc[key].sum;
        }
      }
      
      return acc;
    }, {} as Record<string, any>);

    return { data: Object.values(grouped).slice(0, 20), error: null }; // Limit to 20 data points for readability
  }, [config, rawData, aggregationType]);

  const renderChart = () => {
    if (chartData.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm p-4 text-center">
          <p className="text-red-400 font-medium mb-1">Configuration Error</p>
          <p>{chartData.error}</p>
          <p className="text-xs mt-2 text-slate-500">Check the Debug Diagnostics below for details.</p>
        </div>
      );
    }
    
    if (chartData.data.length === 0) {
      return <div className="flex items-center justify-center h-full text-slate-400 text-sm">No data available for {config.xAxisKey} vs {config.yAxisKey}</div>;
    }

    switch (config.type) {
      case 'bar':
        return (
          <BarChart data={chartData.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey={config.xAxisKey} tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              cursor={{ fill: '#F1F5F9' }}
            />
            <Bar dataKey={config.yAxisKey} fill={config.color || COLORS[0]} radius={[4, 4, 0, 0]} animationDuration={1500} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={chartData.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey={config.xAxisKey} tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Line type="monotone" dataKey={config.yAxisKey} stroke={config.color || COLORS[1]} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={1500} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData.data}>
            <defs>
              <linearGradient id={`color${config.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color || COLORS[2]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={config.color || COLORS[2]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey={config.xAxisKey} tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12, fill: '#64748B'}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Area type="monotone" dataKey={config.yAxisKey} stroke={config.color || COLORS[2]} fillOpacity={1} fill={`url(#color${config.id})`} animationDuration={1500} />
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData.data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={config.yAxisKey}
              nameKey={config.xAxisKey}
              animationDuration={1500}
            >
              {chartData.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col transition-all"
    >
      <div className="mb-4">
        <h3 className="font-bold text-slate-800">{config.title}</h3>
        <p className="text-xs text-slate-500">{config.description}</p>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div>Unsupported Chart Type</div>}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const BIToolPanel: React.FC<{ instructions: DashboardData['biInstructions'] }> = ({ instructions }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(instructions.codeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="bg-slate-900 text-slate-300 rounded-xl p-6 mt-8 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Export to {instructions.tool}
        </h3>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 text-indigo-300">Developer Mode</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold text-indigo-400 mb-3 uppercase tracking-wider">Implementation Steps</h4>
          <ul className="space-y-3">
            {instructions.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm group">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono border border-slate-700 group-hover:border-indigo-500 group-hover:text-indigo-400 transition-colors">{i + 1}</span>
                <span className="group-hover:text-slate-200 transition-colors">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
           <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
              {instructions.codeSnippet.language} Script: {instructions.codeSnippet.label}
            </h4>
            <button 
              onClick={handleCopy}
              className="text-xs flex items-center gap-1 hover:text-white transition-colors bg-slate-800 px-2 py-1 rounded"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
          <div className="bg-black rounded-lg p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
            <pre className="text-green-400">{instructions.codeSnippet.code}</pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardView: React.FC<DashboardViewProps> = ({ data, rawData }) => {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900">{data.title}</h1>
        <p className="text-slate-600 mt-2 max-w-3xl">{data.summary}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.kpis.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} rawData={rawData} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {data.charts.map((chart, index) => (
          <ChartCard key={chart.id} config={chart} rawData={rawData} index={index} />
        ))}
      </div>

      <BIToolPanel instructions={data.biInstructions} />

      {/* Debug Section */}
      <div className="mt-12 p-6 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono overflow-auto max-h-96 shadow-inner">
        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider border-b border-slate-300 pb-2">Debug Diagnostics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-indigo-600 mb-2">Data Source Status</h4>
            <p className="mb-1"><span className="font-semibold">Total Rows:</span> {rawData?.length || 0}</p>
            <p className="mb-1"><span className="font-semibold">Columns Detected:</span></p>
            <div className="bg-white p-2 rounded border border-slate-200 mb-4">
              {rawData && rawData.length > 0 
                ? JSON.stringify(Object.keys(rawData[0]), null, 2) 
                : <span className="text-red-500">No data loaded</span>}
            </div>
            
            <h4 className="font-bold text-indigo-600 mb-2">Sample Row (First Record)</h4>
            <div className="bg-white p-2 rounded border border-slate-200 whitespace-pre-wrap">
              {rawData && rawData.length > 0 
                ? JSON.stringify(rawData[0], null, 2) 
                : <span className="text-red-500">No data available</span>}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-indigo-600 mb-2">KPI Field Mapping</h4>
            <ul className="space-y-1 mb-4">
              {data.kpis.map((k, i) => {
                const found = findMatchingKey(rawData?.[0], k.valueField);
                return (
                  <li key={i} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${found ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="font-semibold">{k.label}:</span> 
                    <span className="text-slate-500">"{k.valueField}"</span>
                    {found ? <span className="text-green-600">→ Found: "{found}"</span> : <span className="text-red-600">→ NOT FOUND</span>}
                  </li>
                );
              })}
            </ul>

            <h4 className="font-bold text-indigo-600 mb-2">Chart Field Mapping</h4>
            <ul className="space-y-2">
              {data.charts.map((c, i) => {
                const xFound = findMatchingKey(rawData?.[0], c.xAxisKey);
                const yFound = findMatchingKey(rawData?.[0], c.yAxisKey);
                return (
                  <li key={i} className="border-b border-slate-200 pb-1">
                    <div className="font-semibold text-slate-700">{c.title}</div>
                    <div className="pl-4 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${xFound ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span>X-Axis: "{c.xAxisKey}"</span>
                        {xFound ? <span className="text-green-600">→ "{xFound}"</span> : <span className="text-red-600">→ MISSING</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${yFound ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span>Y-Axis: "{c.yAxisKey}"</span>
                        {yFound ? <span className="text-green-600">→ "{yFound}"</span> : <span className="text-red-600">→ MISSING</span>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
