
export type BITool = 'Power BI' | 'Tableau';
export type ScriptLanguage = 'Python' | 'R';

export type OutputType = 'roadmap' | 'dashboard';

export interface ProjectConfig {
  companyType: string;
  dataFields: string;
  biTool: BITool;
  language: ScriptLanguage;
  industry: string;
  fileName?: string;
  rawData?: any[];
  outputType: OutputType;
}

export interface KPI {
  label: string;
  valueField: string;
  aggregation: 'sum' | 'avg' | 'count' | 'max' | 'min';
  format?: 'currency' | 'percentage' | 'number';
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'scatter';
  xAxisKey: string;
  yAxisKey: string; // or series key
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
  color?: string;
  description?: string;
}

export interface BIToolInstructions {
  tool: BITool;
  steps: string[];
  codeSnippet: {
    label: string;
    code: string;
    language: string;
  };
}

export interface DashboardData {
  title: string;
  summary: string;
  kpis: KPI[];
  charts: ChartConfig[];
  biInstructions: BIToolInstructions;
}
