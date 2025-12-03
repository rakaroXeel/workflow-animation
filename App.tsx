import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  CheckCircle, 
  BrainCircuit,
  Bot,
  Cloud,
  Server,
  Database,
  ShieldCheck,
  Building,
  FileText,
  Lock,
  User,
  Layout,
  HardDrive,
  Cpu
} from 'lucide-react';
import { WORKFLOW_INFO } from './constants';
import { ChatMessage } from './types';
import { sendMessageToGemini } from './services/geminiService';

// --- Isometric Components ---

const IsoBlock: React.FC<{ 
  x: number; 
  y: number; 
  color: string; 
  topColor: string; 
  sideColor: string; 
  height?: number; 
  label?: string;
  icon?: React.ReactNode;
  active?: boolean;
  scale?: number;
}> = ({ x, y, color, topColor, sideColor, height = 20, label, icon, active, scale = 1 }) => {
  // Simple isometric projection
  // x increases to bottom-right, y increases to bottom-left
  const tileWidth = 60 * scale;
  const tileHeight = 30 * scale; 
  
  const screenX = (x - y) * tileWidth;
  const screenY = (x + y) * tileHeight;

  // Animation for active state
  const bounceClass = active ? "animate-bounce-slight" : "";

  return (
    <g className={`transition-all duration-500 ${bounceClass}`} style={{ transform: `translate(${screenX}px, ${screenY}px)` }}>
      {/* Shadow */}
      <path d={`M0 ${20*scale} L-${50*scale} ${45*scale} L0 ${70*scale} L${50*scale} ${45*scale} Z`} fill="rgba(0,0,0,0.1)" />
      
      {/* Left Face */}
      <path d={`M-${30*scale} ${15*scale} L-${30*scale} ${15*scale - height} L0 ${30*scale - height} L0 ${30*scale} Z`} fill={sideColor} />
      
      {/* Right Face */}
      <path d={`M${30*scale} ${15*scale} L${30*scale} ${15*scale - height} L0 ${30*scale - height} L0 ${30*scale} Z`} fill={color} />
      
      {/* Top Face */}
      <path d={`M0 ${-height} L${30*scale} ${15*scale - height} L0 ${30*scale - height} L-${30*scale} ${15*scale - height} Z`} fill={topColor} />
      
      {/* Icon/Label Layer */}
      {icon && (
         <foreignObject x={-20} y={-height - 10} width="40" height="40" className="overflow-visible pointer-events-none">
            <div className="flex items-center justify-center w-10 h-10 text-white drop-shadow-md transform transition-transform">
              {icon}
            </div>
         </foreignObject>
      )}
      
      {label && (
        <foreignObject x={-60} y={15} width="120" height="40" className="overflow-visible pointer-events-none">
           <div className="text-center">
             <span className={`px-2 py-1 rounded text-[10px] font-bold shadow-sm border border-gray-100 ${active ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-700'}`}>
               {label}
             </span>
           </div>
        </foreignObject>
      )}
    </g>
  );
};

// Component to draw a boundary around a set of coordinates
const IsoZoneBorder: React.FC<{
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  color?: string;
  label?: string;
}> = ({ minX, maxX, minY, maxY, color = "#ef4444", label }) => {
  const tileWidth = 60;
  const tileHeight = 30;
  const height = 2; // Floor height

  // Correct calculation for corners of the grid rectangle in isometric space
  // We need the visual outer corners of the diamond group defined by grid coords [minX, maxX] x [minY, maxY]

  // Top Corner: Corresponds to (minX, minY) -> visual top
  const v1X = (minX - minY) * tileWidth;
  const v1Y = (minX + minY) * tileHeight - height; 

  // Right Corner: Corresponds to (maxX, minY) -> visual right
  // We add +30 to x and +15 to y because the coordinate origin is center of tile, but we want edge
  const v2X = (maxX - minY) * tileWidth + 30;
  const v2Y = (maxX + minY) * tileHeight + 15 - height;

  // Bottom Corner: Corresponds to (maxX, maxY) -> visual bottom
  const v3X = (maxX - maxY) * tileWidth;
  const v3Y = (maxX + maxY) * tileHeight + 30 - height;

  // Left Corner: Corresponds to (minX, maxY) -> visual left
  const v4X = (minX - maxY) * tileWidth - 30;
  const v4Y = (minX + maxY) * tileHeight + 15 - height;

  const pathD = `M${v1X} ${v1Y} L${v2X} ${v2Y} L${v3X} ${v3Y} L${v4X} ${v4Y} Z`;

  return (
    <g className="pointer-events-none">
      <path 
        d={pathD} 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeDasharray="8,4"
        className="drop-shadow-sm"
      />
       {/* Optional Glow */}
      <path 
        d={pathD} 
        fill="none" 
        stroke={color} 
        strokeWidth="4" 
        opacity="0.2"
      />
    </g>
  );
};


// Component to draw path between two isometric coordinates
const IsoPath: React.FC<{
  from: {x: number, y: number, height?: number};
  to: {x: number, y: number, height?: number};
  active?: boolean;
  color?: string;
  dashed?: boolean;
}> = ({ from, to, active, color = "#cbd5e1", dashed = true }) => {
  const tileWidth = 60;
  const tileHeight = 30;
  
  const fromH = from.height || 0;
  const toH = to.height || 0;

  const startX = (from.x - from.y) * tileWidth;
  const startY = (from.x + from.y) * tileHeight - fromH;
  
  const endX = (to.x - to.y) * tileWidth;
  const endY = (to.x + to.y) * tileHeight - toH;

  const pathD = `M${startX} ${startY} L${endX} ${endY}`;

  return (
    <>
      <path 
        d={pathD} 
        stroke={active ? "#3b82f6" : color} 
        strokeWidth={active ? 3 : 2} 
        strokeDasharray={dashed ? "5,5" : "none"}
        className="transition-all duration-300"
        opacity={active ? 1 : 0.3}
      />
      {active && (
        <circle r="4" fill={color === "#cbd5e1" ? "#3b82f6" : color}>
          <animateMotion dur="1s" repeatCount="indefinite" path={pathD} />
        </circle>
      )}
    </>
  );
};

const WorkflowVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'cloud' | 'onPremise'>('cloud');
  const [activeStep, setActiveStep] = useState(0);
  const info = WORKFLOW_INFO[mode];

  // Cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % info.steps.length);
    }, 2500); 
    return () => clearInterval(interval);
  }, [info.steps.length]);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-7xl w-full mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-3">Architettura AI</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{info.title}</h3>
          
          {/* Toggle Switch */}
          <div className="inline-flex bg-gray-200 p-1 rounded-full relative mb-8">
            <button
              onClick={() => { setMode('cloud'); setActiveStep(0); }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${
                mode === 'cloud' ? 'text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              In Cloud
            </button>
            <button
              onClick={() => { setMode('onPremise'); setActiveStep(0); }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${
                mode === 'onPremise' ? 'text-blue-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              On Premise
            </button>
            <div 
              className={`absolute top-1 bottom-1 w-[50%] bg-white rounded-full shadow transition-all duration-300 ${
                mode === 'cloud' ? 'left-1' : 'left-[49%]'
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-8 h-full">
          {/* Interactive Visualization */}
          <div className="lg:w-2/3 h-[500px] md:h-[600px] relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border border-white shadow-xl flex items-center justify-center overflow-hidden">
             
             {/* Step Indicator Overlay */}
             <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur px-4 py-3 rounded-xl border border-blue-100 shadow-lg max-w-xs">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1 block">Step {activeStep + 1}</span>
                <h4 className="font-bold text-gray-800 text-sm">{info.steps[activeStep].title}</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{info.steps[activeStep].desc}</p>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-100 mt-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${((activeStep + 1) / info.steps.length) * 100}%` }}
                  ></div>
                </div>
             </div>

            <svg viewBox="-400 -250 800 500" className="w-full h-full transform scale-90 md:scale-100">
              <defs>
                 <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                 </filter>
              </defs>

              <g transform="translate(0, 100)">
                 
                 {/* 1. FLOOR / ENVIRONMENT */}
                 
                 {/* CLOUD MODE: 3 Distinct Islands */}
                 {mode === 'cloud' && (
                   <>
                     {/* Company Island */}
                     <g>
                       {[0, 1, 2].map(row => (
                         [-2, -1, 0].map(col => (
                            <IsoBlock 
                              key={`comp-${row}-${col}`} 
                              x={col} y={row} 
                              color="#bfdbfe" topColor="#dbeafe" sideColor="#93c5fd" 
                              height={2}
                              scale={1}
                            />
                         ))
                       ))}
                     </g>
                     {/* Client Cloud Island */}
                     <g>
                        <IsoBlock x={3} y={1} color="#a5f3fc" topColor="#cffafe" sideColor="#67e8f9" height={2} />
                     </g>
                     {/* External Cloud Island */}
                     <g>
                         <IsoBlock x={3} y={-2} color="#f1f5f9" topColor="#f8fafc" sideColor="#e2e8f0" height={2} />
                         <IsoBlock x={1} y={-2} color="#f1f5f9" topColor="#f8fafc" sideColor="#e2e8f0" height={2} />
                     </g>
                   </>
                 )}

                 {/* ON PREMISE MODE: One Large Unified Floor */}
                 {mode === 'onPremise' && (
                   <g>
                      {/* Generating a large contiguous floor to cover all blocks */}
                      {[0, 1, 2, 3].map(row => (
                         [-2, -1, 0, 1, 2, 3].map(col => {
                            // Skip some tiles to make it look like a connected facility but not a full rectangle
                            // We need to cover: (-2,2), (-2,0), (1,-2), (3,1), (3,-2)
                            // We need to bridge the gap.
                            
                            // Let's just render specific coordinate patches to connect them
                            const isZone = 
                              (col <= 0 && row >= 0) || // Original Company area
                              (col >= 1 && row <= 2 && row >= -2) // Cloud area becomes local server room
                              ;
                            
                            if (isZone) {
                               return (
                                <IsoBlock 
                                  key={`prem-${row}-${col}`} 
                                  x={col} y={row} 
                                  color="#e2e8f0" topColor="#f1f5f9" sideColor="#cbd5e1" 
                                  height={2}
                                  scale={1}
                                />
                               );
                            }
                            return null;
                         })
                      ))}
                      {/* Extra tiles to bridge specific gaps if needed */}
                       <IsoBlock x={1} y={-1} color="#e2e8f0" topColor="#f1f5f9" sideColor="#cbd5e1" height={2} />
                       <IsoBlock x={1} y={-2} color="#e2e8f0" topColor="#f1f5f9" sideColor="#cbd5e1" height={2} />
                       <IsoBlock x={2} y={-2} color="#e2e8f0" topColor="#f1f5f9" sideColor="#cbd5e1" height={2} />
                       <IsoBlock x={3} y={-2} color="#e2e8f0" topColor="#f1f5f9" sideColor="#cbd5e1" height={2} />
                   </g>
                 )}
                 
                 {/* BORDERS */}
                 {mode === 'cloud' ? (
                   // Cloud Mode: Only around Company Zone
                   <IsoZoneBorder 
                      minX={-2.2} maxX={0.2}
                      minY={-0.2} maxY={2.2}
                      color="#ef4444"
                   />
                 ) : (
                   // On Premise Mode: Around EVERYTHING
                   // Bounding box covering (-2,0) to (3,1) and (-2,2) to (3,-2)
                   // Roughly minX=-2.2, maxX=3.2, minY=-2.2, maxY=2.2
                   <IsoZoneBorder 
                      minX={-2.2} maxX={3.5}
                      minY={-2.5} maxY={2.5}
                      color="#ef4444"
                   />
                 )}


                 {/* 3. BLOCKS PLACEMENT */}
                 
                 {/* --- COMMON BLOCKS (Different labels based on mode) --- */}
                 
                 {/* USER (Start) - Bottom Left */}
                 <IsoBlock 
                   x={-2} y={2} 
                   color="#3b82f6" topColor="#60a5fa" sideColor="#2563eb" 
                   height={20} 
                   icon={<User size={18} />} 
                   label="User" 
                   active={activeStep === 0 || activeStep === 5} 
                 />

                 {/* STORAGE (DB) - Top Left */}
                 <IsoBlock 
                   x={-2} y={0} 
                   color="#3b82f6" topColor="#60a5fa" sideColor="#2563eb" 
                   height={25} 
                   icon={<HardDrive size={18} />} 
                   label="Int. Storage" 
                   active={activeStep === 1} 
                 />
                 
                 {/* INTERFACE (SaaS vs Intranet) */}
                 <IsoBlock 
                    x={1} y={-2} 
                    color={mode === 'cloud' ? "#475569" : "#6366f1"} 
                    topColor={mode === 'cloud' ? "#64748b" : "#818cf8"} 
                    sideColor={mode === 'cloud' ? "#334155" : "#4f46e5"} 
                    height={30} 
                    icon={<Layout size={20} />} 
                    label={mode === 'cloud' ? "Interface" : "Intranet App"} 
                    active={activeStep === 0 || activeStep === 2 || activeStep === 4 || activeStep === 5} 
                  />

                 {/* VECTOR DB */}
                 <IsoBlock 
                   x={3} y={1} 
                   color={mode === 'cloud' ? "#06b6d4" : "#6366f1"} 
                   topColor={mode === 'cloud' ? "#22d3ee" : "#818cf8"} 
                   sideColor={mode === 'cloud' ? "#0891b2" : "#4f46e5"} 
                   height={40} 
                   icon={<Database size={20} />} 
                   label="Vector DB" 
                   active={activeStep === 1 || activeStep === 2 || activeStep === 3} 
                 />

                 {/* AI MODEL (OpenAI vs DeepSeek) */}
                 <IsoBlock 
                   x={3} y={-2} 
                   color={mode === 'cloud' ? "#10b981" : "#8b5cf6"} // Green for OpenAI, Violet for DeepSeek
                   topColor={mode === 'cloud' ? "#34d399" : "#a78bfa"} 
                   sideColor={mode === 'cloud' ? "#059669" : "#7c3aed"} 
                   height={35} 
                   icon={mode === 'cloud' ? <BrainCircuit size={20} /> : <Cpu size={20} />} 
                   label={mode === 'cloud' ? "OpenAI API" : "LLM Service"} 
                   active={activeStep === 3 || activeStep === 4} 
                 />


                 {/* --- PATHS --- */}
                 
                 {/* Paths are geometrically the same for both modes in this updated layout, 
                     but the meaning changes. We can reuse the coordinates. */}
                 
                  {/* Step 1: User -> Interface */}
                  <IsoPath 
                    from={{x: -2, y: 2, height: 20}} 
                    to={{x: 1, y: -2, height: 30}} 
                    active={activeStep === 0}
                    color={mode === 'onPremise' ? "#818cf8" : "#cbd5e1"}
                  />

                  {/* Step 2: Storage -> Vector DB [SYNC] */}
                  <IsoPath 
                    from={{x: -2, y: 0, height: 25}} 
                    to={{x: 3, y: 1, height: 40}} 
                    active={activeStep === 1}
                    color={mode === 'onPremise' ? "#818cf8" : "#06b6d4"} 
                  />

                  {/* Step 3: Interface -> Vector DB [SEARCH] */}
                  <IsoPath 
                    from={{x: 1, y: -2, height: 30}} 
                    to={{x: 3, y: 1, height: 40}} 
                    active={activeStep === 2}
                    color={mode === 'onPremise' ? "#818cf8" : "#cbd5e1"}
                  />

                  {/* Step 4: Vector DB -> AI [CONTEXT] */}
                  <IsoPath 
                      from={{x: 3, y: 1, height: 40}} 
                      to={{x: 3, y: -2, height: 35}} 
                      active={activeStep === 3}
                      color={mode === 'onPremise' ? "#a78bfa" : "#10b981"}
                  />

                  {/* Step 5: AI -> Interface (Response) */}
                  <IsoPath 
                    from={{x: 3, y: -2, height: 35}} 
                    to={{x: 1, y: -2, height: 30}} 
                    active={activeStep === 4}
                    color={mode === 'onPremise' ? "#a78bfa" : "#10b981"}
                  />

                    {/* Step 6: Interface -> User (Visualization) */}
                    <IsoPath 
                    from={{x: 1, y: -2, height: 30}} 
                    to={{x: -2, y: 2, height: 20}} 
                    active={activeStep === 5}
                    color={mode === 'onPremise' ? "#818cf8" : "#cbd5e1"}
                  />

              </g>

              {/* Legend/Annotations */}
              <text x="-350" y="180" fill="#94a3b8" fontSize="12" fontWeight="bold">AMBIENTE AZIENDALE</text>
              {mode === 'cloud' && (
                <>
                  <text x="120" y="170" fill="#0891b2" fontSize="12" fontWeight="bold">CLOUD CLIENTE</text>
                  <text x="200" y="-80" fill="#059669" fontSize="12" fontWeight="bold">CLOUD ESTERNO</text>
                </>
              )}
               {mode === 'onPremise' && (
                <text x="120" y="170" fill="#6366f1" fontSize="12" fontWeight="bold">SERVER LOCALI</text>
              )}

            </svg>
            
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-mono text-gray-500 border border-gray-200">
               {mode === 'cloud' ? 'Data Access: Hybrid' : 'Data Access: Fully Isolated'}
            </div>
          </div>

          {/* Info Panel - Right Side */}
          <div className="lg:w-1/3 space-y-8 flex flex-col justify-center">
             <div>
               <h4 className="text-2xl font-bold text-blue-900 mb-2">{info.title}</h4>
               <p className="text-gray-600 mb-6 leading-relaxed">{info.description}</p>
               
               <div className="space-y-3">
                 {info.steps.map((step, idx) => (
                   <div 
                     key={idx} 
                     className={`flex gap-4 p-4 rounded-xl border transition-all duration-300 ${
                       activeStep === idx 
                         ? 'bg-blue-50 border-blue-200 shadow-md transform scale-105' 
                         : 'bg-white border-gray-100 opacity-60'
                     }`}
                   >
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm ${
                       activeStep === idx ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                     }`}>
                       {idx + 1}
                     </div>
                     <div>
                       <h5 className={`font-bold text-sm ${activeStep === idx ? 'text-blue-900' : 'text-gray-500'}`}>{step.title}</h5>
                       {activeStep === idx && (
                         <p className="text-xs text-blue-700 mt-1">{step.desc}</p>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>

        </div>
      </div>
      
      {/* Chat */}
      <ChatBot isOpen={false} toggle={() => {}} />
    </div>
  );
};

// --- Chat Sub-component (Hidden by default but kept for structure) ---
const ChatBot: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Ciao! Sono l\'AI Agent di Xeel. Posso spiegarti nel dettaglio come funzionano i nostri flussi Cloud e On-Premise.' }
  ]);
  const [input, setInput] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const responseText = await sendMessageToGemini(input);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  useEffect(() => {
     if(isChatVisible) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatVisible]);

  return (
    <>
      <button 
        onClick={() => setIsChatVisible(!isChatVisible)}
        className="fixed bottom-6 right-6 z-50 bg-blue-900 hover:bg-blue-800 text-white rounded-full p-4 shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center"
      >
        {isChatVisible ? <X size={24} /> : <BrainCircuit size={28} />}
      </button>

      {isChatVisible && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 h-[500px] animate-fade-in-up">
           <div className="bg-blue-900 p-4 flex items-center gap-3 text-white shadow-sm">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><Bot size={18}/></div>
              <div><h3 className="font-bold text-sm">Xeel AI Architect</h3></div>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                      {msg.role === 'model' ? <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /> : msg.text}
                   </div>
                </div>
              ))}
              {isLoading && <div className="text-xs text-gray-400 p-2">L'AI sta scrivendo...</div>}
              <div ref={messagesEndRef} />
           </div>
           <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Fai una domanda tecnica..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={handleSend} className="p-2 bg-blue-900 text-white rounded-full"><Send size={16}/></button>
           </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
       <WorkflowVisualizer />
    </div>
  );
}

export default App;