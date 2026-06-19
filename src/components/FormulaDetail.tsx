import { useState, useEffect } from 'react';
import { Formula } from '../types';
import { classicFormulas } from '../data/tcmData';
import { formulas as realFormulas } from '../data/formulas';
import { Flame, ShieldAlert, BookOpen, Layers, CheckCircle2, RefreshCw, BarChart2, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import SafetyBanner from './SafetyBanner';
import { assessRisk } from '../utils/riskRules';

interface FormulaDetailProps {
  initialFormulaId?: string;
  onNavigateToClassroom: (lessonId: string, boardId: string) => void;
}

export default function FormulaDetail({ initialFormulaId, onNavigateToClassroom }: FormulaDetailProps) {
  const allFormulas = [...realFormulas, ...classicFormulas];

  // Active selected formula ID for individual display
  const [selectedId, setSelectedId] = useState(initialFormulaId || allFormulas[0]?.id);

  useEffect(() => {
    if (initialFormulaId) setSelectedId(initialFormulaId);
  }, [initialFormulaId]);
  const activeFormula = allFormulas.find(f => f.id === selectedId) || allFormulas[0];
  const risk = assessRisk(activeFormula.name + activeFormula.pathology + activeFormula.explanation);
  // Related formulas: same syndromes or same lessonRef
  const relatedFormulas = allFormulas.filter(f =>
    f.id !== activeFormula.id &&
    (f.syndromes.some(s => activeFormula.syndromes.includes(s)) ||
     (f.lessonRef && activeFormula.lessonRef && f.lessonRef === activeFormula.lessonRef))
  ).slice(0, 6);

  // Notes comparison workbench states
  const [compareAId, setCompareAId] = useState<string>(allFormulas[0].id);
  const [compareBId, setCompareBId] = useState<string>(allFormulas[1]?.id || allFormulas[0].id);
  const [isComparing, setIsComparing] = useState(false);

  const formulaA = allFormulas.find(f => f.id === compareAId) || allFormulas[0];
  const formulaB = allFormulas.find(f => f.id === compareBId) || allFormulas[1] || allFormulas[0];

  return (
    <div className="space-y-6" id="formula-root-container">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bento-border pb-4" id="formulas-hdr">
        <div className="space-y-1">
          <h1 className="font-serif text-xl sm:text-2xl text-bento-ink font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-bento-accent" />
            伤寒经方之源与方证比勘 (方证对照)
          </h1>
          <p className="text-xs text-stone-500 font-serif">点击左侧经典主方进行病机剖析，或开启双向比勘台剖析同病异治之机理</p>
        </div>
        
        {/* Toggle Comparison Mode Button */}
        <button
          onClick={() => setIsComparing(!isComparing)}
          className={`px-4 py-2 rounded-lg text-xs font-bold shadow-xs border transition flex items-center gap-1.5 cursor-pointer ${
            isComparing 
              ? 'bg-bento-accent border-bento-accent text-white hover:bg-rose-950' 
              : 'bg-bento-paper border-bento-border text-stone-700 hover:bg-stone-50'
          }`}
          id="compare-mode-toggle"
        >
          <RefreshCw className="w-4 h-4 text-bento-accent" />
          <span>{isComparing ? '返回方剂独立视图' : '开启双向 [方证比勘]'}</span>
        </button>
      </div>

      {!isComparing ? (
        /* INDIVIDUAL DETAILED SINGLE VIEW MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="single-view-layout">
          
          {/* LEFT INDEX DRAWER (3 cols) */}
          <div className="lg:col-span-3 space-y-4" id="formula-list-drawer">
            <div className="bg-bento-paper border border-bento-border rounded-xl p-4 space-y-3 shadow-xs">
              <h3 className="font-serif text-xs font-bold text-bento-accent uppercase tracking-wider border-b border-bento-border pb-2">
                伤寒六经主方（点击索引）
              </h3>
              
              <div className="space-y-1" id="formulas-list">
                {allFormulas.slice(0, 50).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    className="w-full text-left p-3 rounded-lg border border-bento-border text-xs transition flex justify-between items-center cursor-pointer bg-white hover:bg-stone-50"
                    id={`formula-item-${f.id}`}
                  >
                    <div>
                      <div className="font-serif text-xs font-bold text-bento-ink">{f.name}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{f.source} • {f.composition.length}味</div>
                    </div>
                    {f.id === selectedId && <span className="w-2 h-2 rounded-full bg-bento-accent block animate-pulse"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Fact on Formula Theory */}
            <div className="bg-bento-paper border border-bento-border rounded-xl p-4 text-xs space-y-2 text-stone-600 leading-relaxed font-serif" id="theory-fact-box">
              <div className="font-bold text-bento-accent">辨证灵魂："方证对照"</div>
              <p>治伤寒，必求"有是证，用是方"。方证相对应，即是一首经方的精准客观指标。如若体表表征与本病提纲百分百吻合，便可凭方投药，效如桴鼓。</p>
            </div>
          </div>

          {/* RIGHT DETAIL PRESENTATION (9 cols) */}
          <div className="lg:col-span-9 space-y-6" id="formula-detail-canvas">
            
            <div className="bg-bento-paper border border-bento-border rounded-xl p-6 shadow-xs space-y-6" id="formula-main-card">
              
              {/* Safety Banner */}
              <SafetyBanner riskLevel={risk.level} message={risk.message} />

              {/* Header Title Information */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-bento-border pb-4" id="formula-detail-title-block">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-bento-ink">{activeFormula.name}</h2>
                    <span className="text-xs bg-[#FDF5F5] text-bento-accent border border-bento-accent/20 rounded-full px-2.5 py-0.5 font-bold font-serif">
                      出处: {activeFormula.source}
                    </span>
                    {activeFormula.riskLevel && activeFormula.riskLevel !== 'low' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        activeFormula.riskLevel === 'high' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {activeFormula.riskLevel === 'high' ? '⚠ 高风险' : '⚡ 谨慎'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1 font-serif font-semibold">归经病位: {activeFormula.syndromes.join('、')}</p>
                  {activeFormula.lessonRef && (
                    <p className="text-[10px] text-stone-400 mt-0.5 font-sans">涉及课次: {activeFormula.lessonRef}</p>
                  )}
                </div>

                {activeFormula.blackboardId && (
                  <button
                    onClick={() => onNavigateToClassroom('l-1-1', activeFormula.blackboardId!)}
                    className="text-xs text-bento-accent bg-[#FDF5F5] hover:bg-[#FDF5F5]/80 border border-bento-accent/20 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer"
                    id="link-to-blackboard-btn"
                  >
                    <BookOpen className="w-4 h-4 text-bento-accent" />
                    <span>查看关联板书图</span>
                  </button>
                )}
              </div>

              {/* Composition Weight Bars Diagram (药量及配伍可视化) */}
              <div className="space-y-3" id="composition-visual-section">
                <h3 className="font-serif text-bento-ink font-bold text-sm flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-bento-accent" />
                  组方克数比值与配伍分工（君、臣、佐、使）
                </h3>
                
                <div className="bg-bento-bg border border-bento-border rounded-xl p-4" id="composition-visual-grid-outer">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="dosage-grid">
                    {activeFormula.composition.map((comp, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-bento-border space-y-2 flex flex-col justify-between" id={`dose-item-${idx}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-serif font-bold text-bento-ink text-sm flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-bento-accent"></span>
                            {comp.herb}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-bento-accent bg-[#FDF5F5] px-2 py-0.5 rounded border border-bento-accent/15">
                            分量: {comp.dose}
                          </span>
                        </div>
                        
                        {/* Percentage weight simulated meter */}
                        <div className="space-y-1">
                          <div className="text-[11px] text-stone-750 font-bold font-serif">
                            配伍分工: {comp.function.slice(0, 3)} <span className="font-sans font-normal text-stone-500">({comp.function.slice(3)})</span>
                          </div>
                          
                          <div className="w-full bg-[#FAF9F5] h-1.5 border border-bento-border rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                idx === 0 ? 'bg-[#9C2014]' : idx === 1 ? 'bg-amber-600' : 'bg-stone-500'
                              }`}
                              style={{ width: idx === 0 ? '95%' : idx === 1 ? '85%' : '60%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core symptoms indicator cards */}
              <div className="space-y-2.5" id="symptoms-section">
                <h3 className="font-serif text-bento-ink font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-bento-accent" />
                  辨证核心主症（有是证，用是方：方证金钥匙）
                </h3>
                <div className="flex gap-2 flex-wrap" id="symptom-badges">
                  {activeFormula.symptoms.map(sym => (
                    <span 
                      key={sym} 
                      className="bg-[#FDF5F5] border border-bento-accent/15 text-bento-accent px-3 py-1 rounded-lg text-xs font-bold font-serif"
                    >
                      ✔ {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pathology explain detailed blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" id="pathology-usage-grid">
                
                {/* Pathological structure */}
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E9E3D5] space-y-2" id="pathology-box">
                  <h4 className="font-serif font-bold text-emerald-800 text-xs uppercase tracking-wide flex items-center gap-1 border-b border-[#EBE3D3] pb-1.5 mb-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    病因病机分析 (TCM Mechanism)
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed text-justify">
                    {activeFormula.pathology}
                  </p>
                </div>
                
                {/* Analytical explanations */}
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E9E3D5] space-y-2" id="explanation-box">
                  <h4 className="font-serif font-bold text-[#8C3E2B] text-xs uppercase tracking-wide flex items-center gap-1 border-b border-[#EBE3D3] pb-1.5 mb-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    方义与配伍解析 (Configuration Theory)
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed text-justify">
                    {activeFormula.explanation}
                  </p>
                </div>
              </div>

              {/* Preparation & sip guideline list */}
              <div className="bg-emerald-50/15 border border-emerald-200/50 rounded-xl p-4 space-y-2" id="usage-instruction-box">
                <h4 className="font-serif font-bold text-emerald-900 text-xs flex items-center gap-1.5 border-b border-emerald-100 pb-2 mb-1.5">
                  <RefreshCw className="w-4 h-4 text-emerald-700 animate-spin-slow" />
                  经典煎服法及临证调养 (Classic Log)
                </h4>
                <p className="text-xs text-emerald-950 font-sans leading-relaxed whitespace-pre-line text-justify">
                  {activeFormula.usage}
                </p>
              </div>

            {/* Related Formulas */}
            {relatedFormulas.length > 0 && (
              <div className="border-t border-bento-border pt-4 mt-2">
                <h4 className="font-serif text-xs font-bold text-bento-ink mb-3 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-bento-accent" /> 关联方剂
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {relatedFormulas.map(rf => (
                    <button
                      key={rf.id}
                      onClick={() => setSelectedId(rf.id)}
                      className="flex-shrink-0 bg-bento-bg border border-bento-border hover:border-bento-accent rounded-lg px-3 py-2 text-xs font-serif font-bold text-bento-ink transition cursor-pointer"
                    >
                      {rf.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            </div>
          </div>
        </div>
      ) : (
        /* COMPARATIVE WORKBENCH MATRIX MODE (方证对照) */
        <div className="space-y-6" id="compare-view-workspace">
          
          {/* Comparison Selector Dropdown HUD */}
          <div className="bg-[#FAF9F5] border border-[#ECDCC0] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm" id="comparison-selector-hud">
            
            <div className="flex items-center gap-4 w-full sm:w-auto" id="comp-sel-a">
              <span className="text-xs font-bold font-serif text-[#8C3E2B]">方剂甲 (A):</span>
              <select
                value={compareAId}
                onChange={(e) => setCompareAId(e.target.value)}
                className="bg-white border rounded p-1.5 text-xs font-semibold focus:outline-none focus:border-red-600"
                id="select-compare-a"
              >
                {allFormulas.slice(0, 50).map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.source})</option>
                ))}
              </select>
            </div>

            <span className="text-stone-300 font-bold hidden sm:inline">V.S.</span>

            <div className="flex items-center gap-4 w-full sm:w-auto" id="comp-sel-b">
              <span className="text-xs font-bold font-serif text-emerald-800">方剂乙 (B):</span>
              <select
                value={compareBId}
                onChange={(e) => setCompareBId(e.target.value)}
                className="bg-white border rounded p-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                id="select-compare-b"
              >
                {allFormulas.slice(0, 50).map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.source})</option>
                ))}
              </select>
            </div>
          </div>

          {/* SIDE-BY-SIDE MATRIX LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="comparison-matrix-grids">
            
            {/* COLUMN FORMULA A */}
            <div className="bg-white border-t-4 border-[#C23C27] border-x border-b border-[#E9DFCA] rounded-xl p-5 space-y-4 shadow" id="matrix-col-a">
              <div className="bg-red-50 p-2 rounded text-center border border-red-100">
                <h3 className="font-serif text-xl font-bold text-[#8C3E2B]">{formulaA.name}</h3>
                <span className="text-[11px] font-sans font-medium text-stone-500">方剂甲对比纲要主证</span>
              </div>

              {/* Composition */}
              <div className="space-y-1" id="com-a-box">
                <h4 className="text-xs font-bold text-[#8C3E2B] font-serif border-b pb-1">① 经典组成与分量对比</h4>
                <div className="space-y-1.5 text-xs text-gray-700" id="com-a-list">
                  {formulaA.composition.map((c, i) => (
                    <div key={i} className="flex justify-between border-b border-stone-50 py-1">
                      <span className="font-medium">{c.herb}</span>
                      <span className="font-mono text-gray-500">{c.dose} ({c.function.slice(0, 2)})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathological rationale */}
              <div className="space-y-1" id="path-a-box">
                <h4 className="text-xs font-bold text-[#8C3E2B] font-serif border-b pb-1">② 病机对比（因何发病）</h4>
                <p className="text-xs text-gray-600 leading-relaxed text-justify">{formulaA.pathology}</p>
              </div>

              {/* Key symptoms */}
              <div className="space-y-1.5" id="symp-a-box">
                <h4 className="text-xs font-bold text-[#8C3E2B] font-serif border-b pb-1">③ 核心抓手主证（提纲指征）</h4>
                <div className="flex gap-1.5 flex-wrap" id="symp-a-list">
                  {formulaA.symptoms.map(s => (
                    <span key={s} className="bg-rose-50 text-rose-800 border border-rose-100 px-2 py-0.5 rounded text-[11px] font-serif font-medium">{s}</span>
                  ))}
                </div>
              </div>

              {/* Composition philosophy */}
              <div className="space-y-1" id="phil-a-box">
                <h4 className="text-xs font-bold text-[#8C3E2B] font-serif border-b pb-1">④ 治法与配伍奥秘对比</h4>
                <p className="text-xs text-gray-600 leading-relaxed text-justify">{formulaA.explanation}</p>
              </div>
            </div>

            {/* COLUMN FORMULA B */}
            <div className="bg-white border-t-4 border-[#2E5C43] border-x border-b border-[#E9DFCA] rounded-xl p-5 space-y-4 shadow" id="matrix-col-b">
              <div className="bg-emerald-50 p-2 rounded text-center border border-emerald-100">
                <h3 className="font-serif text-xl font-bold text-[#2A4D38]">{formulaB.name}</h3>
                <span className="text-[11px] font-sans font-medium text-stone-500">方剂乙对比纲要主证</span>
              </div>

              {/* Composition */}
              <div className="space-y-1" id="com-b-box">
                <h4 className="text-xs font-bold text-emerald-800 font-serif border-b pb-1">① 经典组成与分量对比</h4>
                <div className="space-y-1.5 text-xs text-gray-700" id="com-b-list">
                  {formulaB.composition.map((c, i) => (
                    <div key={i} className="flex justify-between border-b border-stone-50 py-1">
                      <span className="font-medium">{c.herb}</span>
                      <span className="font-mono text-gray-500">{c.dose} ({c.function.slice(0, 2)})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathological rationale */}
              <div className="space-y-1" id="path-b-box">
                <h4 className="text-xs font-bold text-emerald-800 font-serif border-b pb-1">② 病机对比（因何发病）</h4>
                <p className="text-xs text-gray-600 leading-relaxed text-justify">{formulaB.pathology}</p>
              </div>

              {/* Key symptoms */}
              <div className="space-y-1.5" id="symp-b-box">
                <h4 className="text-xs font-bold text-emerald-800 font-serif border-b pb-1">③ 核心抓手主证（提纲指征）</h4>
                <div className="flex gap-1.5 flex-wrap" id="symp-b-list">
                  {formulaB.symptoms.map(s => (
                    <span key={s} className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded text-[11px] font-serif font-medium">{s}</span>
                  ))}
                </div>
              </div>

              {/* Composition philosophy */}
              <div className="space-y-1" id="phil-b-box">
                <h4 className="text-xs font-bold text-emerald-800 font-serif border-b pb-1">④ 治法与配伍奥秘对比</h4>
                <p className="text-xs text-gray-600 leading-relaxed text-justify">{formulaB.explanation}</p>
              </div>
            </div>
            
          </div>

          {/* Bottom comparison analytical guidelines */}
          <div className="bg-[#FAF7F2] border border-[#E9E1CE] p-4 rounded-xl flex items-center justify-between gap-4" id="contrast-tips-banner">
            <div className="text-xs text-stone-600 leading-relaxed max-w-2xl" id="contrast-tips-content">
              <strong className="text-amber-800 font-serif block text-sm mb-1">【比勘学堂指导】：两方同中有异，异中有同。</strong>
              例如，<strong>桂枝汤</strong>与<strong>麻黄汤</strong>：同属太阳经表证主方。然一为中风表虚（有汗恶风、脉浮缓，治以调营卫拂汗），一为伤寒表实（无汗喘急、身疼骨痛、脉浮紧，治以宣肺发汗）。此即是"方证对应"的核心判别标准。
            </div>
            <Plus className="w-5 h-5 text-amber-800 flex-shrink-0 animate-bounce" />
          </div>

        </div>
      )}

    </div>
  );
}
