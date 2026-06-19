import { useState, useEffect } from 'react';
import { sixMeridianStages } from '../data/tcmData';
import { SixMeridianStage } from '../types';
import { Sparkles, Layers, Activity, HelpCircle, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import SymptomDecisionTree from './SymptomDecisionTree';

interface SixMeridiansProps {
  initialStageId?: string;
  onNavigateToFormula: (formulaId: string) => void;
}

export default function SixMeridians({ initialStageId, onNavigateToFormula }: SixMeridiansProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>(
    initialStageId || "太阳病 (表证阶段)"
  );

  useEffect(() => {
    if (initialStageId) {
      // Find stage that starts with initialStageId or is exactly the same
      const match = sixMeridianStages.find(s => s.name.startsWith(initialStageId) || s.id === initialStageId);
      if (match) {
        setSelectedStageId(match.name);
      }
    }
  }, [initialStageId]);

  const activeStage = sixMeridianStages.find(s => s.name === selectedStageId) || sixMeridianStages[0];

  // Map stage to formulas search links
  const formulaIdMap: { [key: string]: string } = {
    "桂枝汤": "f-guizhitang",
    "麻黄汤": "f-mahuangtang",
    "小柴胡汤": "f-xiaochaihutang",
    "大承气汤": "f-dachengqitang",
    "小承气汤": "f-dachengqitang", // fallback
    "调胃承气汤": "f-dachengqitang", // fallback
    "白虎汤": "f-baihutang",
    "理中丸": "f-lizhongwan",
    "四逆汤": "f-siniitang",
    "乌梅丸": "f-wumeiwan"
  };

  return (
    <div className="space-y-6" id="sixmeridians-root">
      
      {/* Header Info */}
      <div className="space-y-1 border-b border-bento-border pb-4" id="sixmeridians-header">
        <h1 className="font-serif text-xl sm:text-2xl text-bento-ink font-bold flex items-center gap-2">
          <Activity className="w-6 h-6 text-bento-accent animate-pulse" />
          六经辨证多维交互总图 &amp; 伤寒传变理路
        </h1>
        <p className="text-xs text-stone-500 font-serif">
          伤寒一脉的核心辨证学框架。点击下方伤寒论传变理路回路图中的各个阶段，剖析脏腑被郁、邪正抗交之精妙玄机。
        </p>
      </div>

      {/* SVG INTERACTIVE NEURAL PATHWAY DIAGRAM */}
      <div className="bg-bento-paper border border-bento-border rounded-xl p-6 shadow-xs overflow-hidden relative" id="sixmeridians-interactive-canvas-box">
        
        {/* Helper Badge */}
        <div className="text-center mb-4" id="nav-helper-indicator">
          <span className="bg-[#FDF5F5] text-bento-accent text-[10px] font-bold border border-bento-accent/15 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-bento-accent animate-bounce" />
            <span className="font-serif">研学指引：点击脉络点查看对应提纲。橙色虚线指代表里“阳传”，紫色指代深层“阴侵”</span>
          </span>
        </div>

        {/* The Live Interactive SVG Circuit mapping Six Meridians */}
        <div className="relative max-w-4xl mx-auto" id="svg-canvas-wrapper">
          <svg viewBox="0 0 800 240" className="w-full h-auto" id="six-meridians-svg-container">
            {/* DEFINING DECORATIVE LINES & GLOW EFFECT */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#D4C4A8" />
              </marker>
              <marker id="arrow-yang" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#D97706" />
              </marker>
              <marker id="arrow-yin" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#8C3E2B" />
              </marker>
            </defs>

            {/* THREE YANG CIRCUIT FLOW LINES (Top: 太阳 -> 少阳 -> 阳明) */}
            <path d="M 120,70 L 400,70" stroke="#D97706" strokeWidth="2.5" strokeDasharray="5,2" markerEnd="url(#arrow-yang)" opacity="0.85" />
            <path d="M 400,70 L 680,70" stroke="#D97706" strokeWidth="2.5" strokeDasharray="5,2" markerEnd="url(#arrow-yang)" opacity="0.85" />

            {/* TRANSITION TO THREE YIN (from陽明 to 太阴 / 太阳 to 少阴) */}
            <path d="M 680,70 L 680,170" stroke="#8C3E2B" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrow)" opacity="0.6" />
            <path d="M 120,70 L 400,170" stroke="#8C3E2B" strokeWidth="1.5" strokeDasharray="4,4" markerEnd="url(#arrow-yin)" opacity="0.5" />

            {/* THREE YIN CIRCUIT FLOW LINES (Bottom: 太阴 -> 少阴 -> 厥阴) */}
            <path d="M 680,170 L 400,170" stroke="#8C3E2B" strokeWidth="2.5" strokeDasharray="5,2" markerEnd="url(#arrow-yin)" opacity="0.85" />
            <path d="M 400,170 L 120,170" stroke="#8C3E2B" strokeWidth="2.5" strokeDasharray="5,2" markerEnd="url(#arrow-yin)" opacity="0.85" />

            {/* LOOPBACKS */}
            <path d="M 120,170 Q 40,120 120,70" stroke="#6B7280" strokeWidth="1.5" strokeDasharray="2,2" markerEnd="url(#arrow)" opacity="0.4" />

            {/* NODE 1: 太阳病 (表证) */}
            <g 
              onClick={() => setSelectedStageId("太阳病 (表证阶段)")} 
              className="cursor-pointer group"
              id="node-taiyang"
            >
              <circle 
                cx="120" cy="70" r="32" 
                fill={selectedStageId === "太阳病 (表证阶段)" ? "#8C3E2B" : "#FAF9F5"} 
                stroke="#8C3E2B" strokeWidth={selectedStageId === "太阳病 (表证阶段)" ? "4" : "1.5"}
                className="transition-all duration-300" 
              />
              <text 
                x="120" y="74" textAnchor="middle" 
                fill={selectedStageId === "太阳病 (表证阶段)" ? "#FAF9F5" : "#1F2937"} 
                fontSize="11" fontWeight="bold" className="font-serif select-none"
              >
                太阳表证
              </text>
              <text x="120" y="115" textAnchor="middle" fill="#6B7280" fontSize="9" className="font-sans">膀胱经 • 卫外表虚</text>
            </g>

            {/* NODE 2: 少阳病 (枢机) */}
            <g 
              onClick={() => setSelectedStageId("少阳病 (半表半里阶段)")} 
              className="cursor-pointer group"
              id="node-shaoyang"
            >
              <circle 
                cx="400" cy="70" r="32" 
                fill={selectedStageId === "少阳病 (半表半里阶段)" ? "#8C3E2B" : "#FAF9F5"} 
                stroke="#D97706" strokeWidth={selectedStageId === "少阳病 (半表半里阶段)" ? "4" : "1.5"}
                className="transition-all duration-300" 
              />
              <text 
                x="400" y="74" textAnchor="middle" 
                fill={selectedStageId === "少阳病 (半表半里阶段)" ? "#FAF9F5" : "#1F2937"} 
                fontSize="11" fontWeight="bold" className="font-serif select-none"
              >
                少阳枢机
              </text>
              <text x="400" y="115" textAnchor="middle" fill="#6B7280" fontSize="9" className="font-sans">少阳胆经 • 半表半里</text>
            </g>

            {/* NODE 3: 阳明病 (腑实) */}
            <g 
              onClick={() => setSelectedStageId("阳明病 (燥热实阶段)")} 
              className="cursor-pointer group"
              id="node-yangming"
            >
              <circle 
                cx="680" cy="70" r="32" 
                fill={selectedStageId === "阳明病 (燥热实阶段)" ? "#8C3E2B" : "#FAF9F5"} 
                stroke="#DC2626" strokeWidth={selectedStageId === "阳明病 (燥热实阶段)" ? "4" : "1.5"}
                className="transition-all duration-300" 
              />
              <text 
                x="680" y="74" textAnchor="middle" 
                fill={selectedStageId === "阳明病 (燥热实阶段)" ? "#FAF9F5" : "#1F2937"} 
                fontSize="11" fontWeight="bold" className="font-serif select-none"
              >
                阳明里实
              </text>
              <text x="680" y="115" textAnchor="middle" fill="#6B7280" fontSize="9" className="font-sans">阳明胃经 • 燥起热充</text>
            </g>

            {/* NODE 4: 太阴病 (中焦虚寒) */}
            <g 
              onClick={() => setSelectedStageId("太阴病 (中焦虚寒阶段)")} 
              className="cursor-pointer group"
              id="node-taiyin"
            >
              <circle 
                cx="680" cy="170" r="32" 
                fill={selectedStageId === "太阴病 (中焦虚寒阶段)" ? "#8C3E2B" : "#FAF9F5"} 
                stroke="#F59E0B" strokeWidth={selectedStageId === "太阴病 (中焦虚寒阶段)" ? "4" : "1.5"}
                className="transition-all duration-300" 
              />
              <text 
                x="680" y="174" textAnchor="middle" 
                fill={selectedStageId === "太阴病 (中焦虚寒阶段)" ? "#FAF9F5" : "#1F2937"} 
                fontSize="11" fontWeight="bold" className="font-serif select-none"
              >
                太阴脏寒
              </text>
              <text x="680" y="215" textAnchor="middle" fill="#6B7280" fontSize="9" className="font-sans">太阴脾经 • 腹满而吐</text>
            </g>

            {/* NODE 5: 少阴病 (心肾两衰) */}
            <g 
              onClick={() => setSelectedStageId("少阴病 (心肾阳衰阶段)")} 
              className="cursor-pointer group"
              id="node-shaoyin"
            >
              <circle 
                cx="400" cy="170" r="32" 
                fill={selectedStageId === "少阴病 (心肾阳衰阶段)" ? "#8C3E2B" : "#FAF9F5"} 
                stroke="#8B5CF6" strokeWidth={selectedStageId === "少阴病 (心肾阳衰阶段)" ? "4" : "1.5"}
                className="transition-all duration-300" 
              />
              <text 
                x="400" y="174" textAnchor="middle" 
                fill={selectedStageId === "少阴病 (心肾阳衰阶段)" ? "#FAF9F5" : "#1F2937"} 
                fontSize="11" fontWeight="bold" className="font-serif select-none"
              >
                少阴极衰
              </text>
              <text x="400" y="215" textAnchor="middle" fill="#6B7280" fontSize="9" className="font-sans">心肾经络 • 脉微欲寐</text>
            </g>

            {/* NODE 6: 厥阴病 (寒热相争) */}
            <g 
              onClick={() => setSelectedStageId("厥阴病 (寒热错杂阶段)")} 
              className="cursor-pointer group"
              id="node-jueyin"
            >
              <circle 
                cx="120" cy="170" r="32" 
                fill={selectedStageId === "厥阴病 (寒热错杂阶段)" ? "#8C3E2B" : "#FAF9F5"} 
                stroke="#D946EF" strokeWidth={selectedStageId === "厥阴病 (寒热错杂阶段)" ? "4" : "1.5"}
                className="transition-all duration-300" 
              />
              <text 
                x="120" y="174" textAnchor="middle" 
                fill={selectedStageId === "厥阴病 (寒热错杂阶段)" ? "#FAF9F5" : "#1F2937"} 
                fontSize="11" fontWeight="bold" className="font-serif select-none"
              >
                厥阴错杂
              </text>
              <text x="120" y="215" textAnchor="middle" fill="#6B7280" fontSize="9" className="font-sans">厥阴肝经 • 阴阳气绝</text>
            </g>
          </svg>
        </div>
      </div>

      {/* STAGE DIAGNOSTIC CLINICAL DETAIL CARD */}
      <div className="bg-bento-paper border border-bento-border rounded-xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6" id="stage-details-dashboard">
        
        {/* Left column (8 cols): Specific explanations */}
        <div className="md:col-span-8 space-y-6" id="stage-explanation-pane">
          <div>
            <div className="text-[10px] text-bento-accent font-bold uppercase tracking-widest font-sans flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-bento-accent" />
              经证传变六大阶段特征临床剖析
            </div>
            <h2 className="font-serif text-2xl font-bold text-bento-ink mt-1" id="active-stage-title">
              {activeStage.name} <span className="text-xs bg-[#FDF5F5] rounded border border-bento-accent/15 px-2.5 py-0.5 text-bento-accent ml-2 font-serif font-bold">{activeStage.nature}</span>
            </h2>
          </div>

          <div className="space-y-4" id="stage-detail-blocks">
            
            {/* Pathology row */}
            <div className="space-y-1.5" id="stage-path">
              <h4 className="text-sm font-semibold font-serif text-bento-ink border-b border-bento-border pb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-bento-accent block"></span>
                伤寒提纲核心病理：
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed text-justify font-serif">{activeStage.pathology}</p>
            </div>

            {/* Typical symptoms list */}
            <div className="space-y-1.5" id="stage-sym">
              <h4 className="text-sm font-semibold font-serif text-bento-ink border-b border-bento-border pb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-bento-accent block"></span>
                研考辨析抓手提纲 (有是证，用是方)：
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="stage-symptoms-list">
                {activeStage.symptoms.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-750 font-serif font-bold" id={`s-symptom-${idx}`}>
                    <span className="w-1.5 h-1.5 bg-bento-accent rounded-full flex-shrink-0"></span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Treatment style */}
            <div className="space-y-1.5" id="stage-therapeutics">
              <h4 className="text-sm font-semibold font-serif text-bento-ink border-b border-bento-border pb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-bento-accent block"></span>
                经典治法施治法则：
              </h4>
              <div className="bg-bento-bg border border-bento-border p-3 rounded-lg text-xs font-serif text-bento-ink leading-relaxed font-semibold">
                <strong>施治宗规：</strong> {activeStage.therapeutics}
              </div>
            </div>

          </div>
        </div>

        {/* Right column (4 cols): Pulse and formulas links */}
        <div className="md:col-span-4 bg-bento-bg border border-bento-border p-5 rounded-xl space-y-6 flex flex-col justify-between" id="stage-diagnostic-pane">
          
          <div className="space-y-6">
            {/* Pulse diagnostic box */}
            <div className="space-y-2" id="pulse-diagnosis-box">
              <h4 className="text-xs font-bold text-bento-accent font-serif uppercase tracking-widest flex items-center gap-1">
                <Activity className="w-4 h-4 text-bento-accent" />
                张仲景提纲定言脉象
              </h4>
              <div className="bg-white border border-bento-border rounded-lg p-3 text-center shadow-xs" id="pulse-meter">
                <div className="text-sm font-serif font-bold text-bento-accent">{activeStage.pulseCondition}</div>
                <p className="text-[10px] text-stone-500 mt-1 pl-1 line-clamp-2">气血流注表象特征之主指归证。脉浮紧主表。脉欲微细欲寐主阴竭。</p>
              </div>
            </div>

            {/* Formulas list links router */}
            <div className="space-y-3" id="stage-formulas-box">
              <h4 className="text-xs font-bold text-bento-ink font-serif uppercase tracking-widest flex items-center gap-1">
                <Layers className="w-4 h-4 text-bento-accent" />
                阶段应对经典名方
              </h4>
              
              <div className="space-y-1.5" id="stage-formulas-list">
                {activeStage.classicFormulas.map(fName => {
                  const fId = formulaIdMap[fName];
                  return (
                    <div 
                      key={fName}
                      onClick={() => fId && onNavigateToFormula(fId)}
                      className={`p-2.5 rounded-lg border text-xs text-left transition ${
                        fId 
                          ? 'bg-white border-bento-border hover:border-bento-accent hover:shadow-xs cursor-pointer text-bento-ink font-bold font-serif' 
                          : 'bg-stone-50 border-stone-100 text-stone-400 cursor-not-allowed font-serif'
                      }`}
                      id={`stage-formula-link-${fName}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{fName}</span>
                        {fId ? (
                          <span className="text-[9px] bg-[#FDF5F5] font-serif font-bold text-bento-accent px-1.5 py-0.5 rounded border border-bento-accent/15 flex items-center gap-0.5">
                            去方证页研究 <ArrowRight className="w-2.5 h-2.5 text-bento-accent" />
                          </span>
                        ) : (
                          <span className="text-[9px] bg-stone-100 font-sans text-stone-400 px-1 py-0.5 rounded">
                            未录入
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick interactive fact */}
          <div className="bg-white p-3 rounded-lg border border-bento-border text-[10px] text-stone-500 leading-normal font-serif mt-2" id="pulse-disclaimer">
            * 诊理考证指引：六经提纲均节录自张仲景《伤寒论》原文。辨证以方证对照为主、脉象为辅。
          </div>

        </div>

      </div>

      {/* Symptom Decision Tree */}
      <SymptomDecisionTree onNavigateToFormula={onNavigateToFormula} />

    </div>
  );
}
