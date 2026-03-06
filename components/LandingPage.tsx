import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Activity, FileText, ArrowRight, CheckCircle, Play, Layers, Zap, Database } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Activity size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">BI Strategist Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          </div>
          <button 
            onClick={onStart}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wide mb-8 border border-indigo-100"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 Now Available
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Turn Data into <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Dashboards</span> in Seconds.
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
              Upload your Excel files and let our AI Architect build live interactive dashboards and detailed technical roadmaps for Power BI & Tableau.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={onStart}
                className="group flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1"
              >
                Start Building Free 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all hover:border-slate-300">
                <Play size={18} fill="currentColor" className="text-slate-400" />
                View Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" /> No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" /> Works with Excel & CSV
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" /> Enterprise-grade Security
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 blur-2xl animate-pulse"></div>
            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Fake Browser Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-white px-4 py-1.5 rounded-md text-xs font-medium text-slate-400 border border-slate-200 flex-1 text-center shadow-sm flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  app.bistrategist.pro/dashboard
                </div>
              </div>

              {/* Dashboard Preview Content */}
              <div className="p-6 bg-slate-50/50">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="h-6 w-32 bg-slate-900 rounded mb-2"></div>
                    <div className="h-3 w-48 bg-slate-300 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-white rounded border border-slate-200"></div>
                    <div className="h-8 w-24 bg-indigo-600 rounded"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <div className="h-3 w-16 bg-slate-200 rounded mb-3"></div>
                      <div className="h-6 w-24 bg-slate-800 rounded mb-1"></div>
                      <div className="h-3 w-12 bg-green-100 rounded text-green-600 text-[10px] flex items-center justify-center font-bold">+12.5%</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 h-48">
                  <div className="col-span-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between mb-4">
                      <div className="h-3 w-24 bg-slate-200 rounded"></div>
                      <div className="h-3 w-16 bg-slate-100 rounded"></div>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                      {[40, 70, 50, 90, 60, 80, 45, 75].map((h, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                          className="w-full bg-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                        ></motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center relative">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-8 border-slate-100 border-t-purple-500 animate-spin-slow"></div>
                     </div>
                     <div className="text-2xl font-bold text-slate-800">85%</div>
                     <div className="text-xs text-slate-400 mt-1">Goal Reached</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-20 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Processing Speed</div>
                  <div className="text-lg font-bold text-slate-900">0.4s</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-8 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-20 hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Database size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Data Points</div>
                  <div className="text-lg font-bold text-slate-900">1.2M+</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Everything you need to master your data</h2>
            <p className="text-lg text-slate-600">Stop staring at blank canvases. Get instant architectural guidance and live visualizations.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart className="text-indigo-600" size={28} />,
                title: "Live Visualization",
                desc: "Instantly render interactive charts from your raw Excel or CSV data without writing a single line of code.",
                color: "bg-indigo-50"
              },
              {
                icon: <FileText className="text-purple-600" size={28} />,
                title: "Technical Roadmaps",
                desc: "Get detailed PDF-style guides with Python scripts and DAX formulas tailored to your specific dataset.",
                color: "bg-purple-50"
              },
              {
                icon: <Layers className="text-pink-600" size={28} />,
                title: "AI Strategist",
                desc: "Our Gemini-powered engine analyzes your data to recommend the most impactful KPIs and ML models.",
                color: "bg-pink-50"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span className="font-bold text-slate-900 text-lg">BI Strategist Pro</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Contact Support</a>
          </div>
          <p className="text-slate-400 text-sm">© 2024 BI Strategist Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
