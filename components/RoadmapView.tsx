
import React from 'react';

interface RoadmapViewProps {
  content: string;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ content }) => {
  // Simple markdown-ish rendering for the UI
  const formatContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('###')) {
        return <h3 key={idx} className="text-lg font-bold text-slate-800 mt-8 mb-4 border-b pb-2">{line.replace('###', '').trim()}</h3>;
      }
      if (line.startsWith('##')) {
        return <h2 key={idx} className="text-xl font-bold text-indigo-700 mt-10 mb-6">{line.replace('##', '').trim()}</h2>;
      }
      if (line.startsWith('#')) {
        return <h1 key={idx} className="text-3xl font-extrabold text-slate-900 mt-4 mb-8">{line.replace('#', '').trim()}</h1>;
      }
      // Lists
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return <li key={idx} className="ml-4 text-slate-600 mb-1 leading-relaxed list-disc">{line.replace(/^[*-]/, '').trim()}</li>;
      }
      // Code blocks (simplified handling)
      if (line.startsWith('```')) {
        return null; // Don't render the triple backticks
      }
      // Inline formatting (bold)
      const boldFormatted = line.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-slate-800">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return <p key={idx} className="text-slate-600 mb-4 leading-relaxed">{boldFormatted}</p>;
    });
  };

  // More sophisticated rendering would use a markdown library, but we manually format code blocks for visual pop
  const renderSections = () => {
    const sections: React.ReactNode[] = [];
    let currentBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';

    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Closing code block
          sections.push(
            <div key={`code-${idx}`} className="my-6 rounded-lg overflow-hidden bg-slate-900 shadow-xl">
              <div className="bg-slate-800 px-4 py-1 flex justify-between items-center text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                <span>{codeLanguage || 'code'}</span>
                <button 
                   onClick={() => navigator.clipboard.writeText(currentBlock.join('\n'))}
                   className="hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm text-indigo-300 code-font">
                {currentBlock.join('\n')}
              </pre>
            </div>
          );
          currentBlock = [];
          inCodeBlock = false;
        } else {
          // Opening code block
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
      } else if (inCodeBlock) {
        currentBlock.push(line);
      } else {
        // Normal text rendering logic
        if (line.trim() === '') return;
        
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 1;
          const text = line.replace(/^#+/, '').trim();
          if (level === 1) sections.push(<h1 key={idx} className="text-4xl font-black text-slate-900 mt-12 mb-8 tracking-tight">{text}</h1>);
          else if (level === 2) sections.push(<h2 key={idx} className="text-2xl font-bold text-indigo-700 mt-12 mb-6 border-l-4 border-indigo-600 pl-4">{text}</h2>);
          else sections.push(<h3 key={idx} className="text-xl font-bold text-slate-800 mt-8 mb-4">{text}</h3>);
        } else if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
          sections.push(<li key={idx} className="ml-6 text-slate-600 mb-2 list-disc leading-relaxed">{line.replace(/^[*-]/, '').trim()}</li>);
        } else {
          // Basic paragraph with bold support
          const boldParts = line.split(/(\*\*.*?\*\*)/).map((p, i) => {
            if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="text-slate-900 font-semibold">{p.slice(2, -2)}</strong>;
            return p;
          });
          sections.push(<p key={idx} className="text-slate-600 mb-4 leading-relaxed text-lg">{boldParts}</p>);
        }
      }
    });

    return sections;
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-8 bg-white shadow-sm border border-slate-100 rounded-xl my-8">
      <div className="mb-12 border-b border-slate-100 pb-8 flex justify-between items-start">
        <div>
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">Strategic Roadmap</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Technical Implementation Guide</h1>
        </div>
        <button 
           onClick={() => window.print()}
           className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Export PDF
        </button>
      </div>
      <div className="prose prose-slate max-w-none">
        {renderSections()}
      </div>
    </div>
  );
};

export default RoadmapView;
