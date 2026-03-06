
import React, { useRef, useState } from 'react';
import { read, utils } from 'xlsx';
import { BITool, ScriptLanguage, ProjectConfig, OutputType } from '../types';

interface SidebarProps {
  config: ProjectConfig;
  onChange: (updates: Partial<ProjectConfig>) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ config, onChange, onGenerate, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawRows = utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      // Heuristic: Find the row with the most non-empty cells in the first 20 rows
      let headerRowIndex = 0;
      let maxNonEmpty = 0;

      for (let i = 0; i < Math.min(rawRows.length, 20); i++) {
        const row = rawRows[i];
        if (!Array.isArray(row)) continue;
        
        const nonEmptyCount = row.filter(cell => cell !== null && cell !== undefined && cell !== '').length;
        if (nonEmptyCount > maxNonEmpty) {
          maxNonEmpty = nonEmptyCount;
          headerRowIndex = i;
        }
      }

      let processedData: any[] = [];
      let headers: string[] = [];
      let sampleRow: any[] = [];

      if (rawRows.length > headerRowIndex) {
        headers = rawRows[headerRowIndex] as string[];
        const dataRows = rawRows.slice(headerRowIndex + 1);
        sampleRow = dataRows[0] || [];
        
        processedData = dataRows
          .filter(row => row && row.length > 0)
          .map((row: any) => {
            const obj: any = {};
            headers.forEach((header, index) => {
              if (header) {
                obj[header] = row[index];
              }
            });
            return obj;
          });
      }

      // Fallback: If heuristic yielded no data, try standard parsing
      if (processedData.length === 0) {
        console.warn("Heuristic parsing failed, reverting to standard sheet_to_json");
        const standardData = utils.sheet_to_json(sheet);
        if (standardData.length > 0) {
          processedData = standardData;
          headers = Object.keys(standardData[0] as object);
          sampleRow = Object.values(standardData[0] as object);
        }
      }

      if (processedData.length > 0) {
        const schemaDescription = `
Dataset File: ${file.name}
Columns: ${headers.filter(h => h).join(', ')}
Sample Data (Row 1): ${sampleRow.join(', ')}
        `.trim();

        onChange({ 
          dataFields: schemaDescription,
          fileName: file.name,
          rawData: processedData
        });
      } else {
        alert("Could not extract any valid data rows from the file. Please check the file format.");
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse the file. Please ensure it is a valid Excel or CSV file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a synthetic event to reuse the handler
      const event = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(event);
    }
  };

  return (
    <aside className="w-80 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">BI Strategist</h1>
        </div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Dashboard Architect v1.0</p>
      </div>

      <div className="p-6 space-y-6 flex-1">
        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Output Mode</label>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {(['dashboard', 'roadmap'] as OutputType[]).map((type) => (
              <button
                key={type}
                onClick={() => onChange({ outputType: type })}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all capitalize ${
                  config.outputType === type
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type === 'dashboard' ? 'Live Viz' : 'Tech Plan'}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Company Context</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            placeholder="e.g. E-commerce Retailer"
            value={config.companyType}
            onChange={(e) => onChange({ companyType: e.target.value })}
          />
        </section>

        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Data Source</label>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
              isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload}
            />
            
            {config.fileName ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{config.fileName}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange({ fileName: undefined, dataFields: '' });
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400">Excel or CSV files</p>
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-500 uppercase">Or enter manually</label>
              {config.fileName && <span className="text-xs text-green-600 font-medium">Auto-filled from file</span>}
            </div>
            <textarea
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm h-24 resize-none"
              placeholder="e.g. Sales, Customers, Dates, Product Categories..."
              value={config.dataFields}
              onChange={(e) => onChange({ dataFields: e.target.value })}
            />
          </div>
        </section>

        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Primary BI Tool</label>
          <div className="flex gap-2">
            {(['Power BI', 'Tableau'] as BITool[]).map((tool) => (
              <button
                key={tool}
                onClick={() => onChange({ biTool: tool })}
                className={`flex-1 py-2 text-sm font-medium rounded-md border transition-all ${
                  config.biTool === tool
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-2">ML Scripting</label>
          <div className="flex gap-2">
            {(['Python', 'R'] as ScriptLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onChange({ language: lang })}
                className={`flex-1 py-2 text-sm font-medium rounded-md border transition-all ${
                  config.language === lang
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white">
        <button
          onClick={onGenerate}
          disabled={isLoading || !config.companyType || !config.dataFields}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md ${
            isLoading || !config.companyType || !config.dataFields
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Strategizing...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Build Roadmap</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
