import { useState, useEffect } from 'react';
import { Meridian, Acupoint } from '../types';
import { classicMeridians } from '../data/tcmData';
import { Award, Zap, Sparkles, Plus, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface MeridiansCanvasProps {
  initialPointId?: string;
  onAddNoteFromPoint: (noteTitle: string, noteContent: string) => void;
}

export default function MeridiansCanvas({ initialPointId, onAddNoteFromPoint }: MeridiansCanvasProps) {
  const [selectedMeridianId, setSelectedMeridianId] = useState<string>(classicMeridians[0].id);
  const [selectedPointId, setSelectedPointId] = useState<string>('');
  const [showInjectedNoteConfirm, setShowInjectedNoteConfirm] = useState(false);

  useEffect(() => {
    if (initialPointId) {
      // Find which meridian holds this point
      const matchMeridian = classicMeridians.find(m => m.acupoints.some(ap => ap.id === initialPointId));
      if (matchMeridian) {
        setSelectedMeridianId(matchMeridian.id);
        setSelectedPointId(initialPointId);
      }
    }
  }, [initialPointId]);

  const activeMeridian = classicMeridians.find(m => m.id === selectedMeridianId) || classicMeridians[0];
  const activePoint = activeMeridian.acupoints.find(ap => ap.id === selectedPointId) || activeMeridian.acupoints[0];

  const handlePointClick = (ap: Acupoint) => {
    setSelectedPointId(ap.id);
    setShowInjectedNoteConfirm(false);
  };

  const handleImportPointToNote = () => {
    if (!activePoint) return;

    const title = `穴位研究 —— ${activePoint.name} (${activePoint.code})`;
    const content = `【腧穴名称】: ${activePoint.name} (${activePoint.pinyin})
【经络归属】: ${activeMeridian.name} (特定编号: ${activePoint.code})
【精确位置】: ${activePoint.location}
【核心主治】: ${activePoint.indications}
【针灸操作】: ${activePoint.manipulation}
【学习体会】: (在此拓展我的临床应用心得...)`;

    onAddNoteFromPoint(title, content);
    setShowInjectedNoteConfirm(true);

    setTimeout(() => {
      setShowInjectedNoteConfirm(false);
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="meridians-canvas-root">
      
      {/* LEFT DRAWER: Route Selector & Attributes (4 cols) */}
      <div className="lg:col-span-4 space-y-4" id="meridians-sidebar-panel">
        <div className="bg-[#FAF8F5] border border-[#ECDCC0] rounded-xl p-4 space-y-4 shadow-inner">
          <h3 className="font-serif text-sm font-bold text-[#1E3024] border-b pb-2 flex items-center gap-1.5">
            <Award className="w-5 h-5 text-emerald-800" />
            十四经典经络列表
          </h3>

          <div className="space-y-1.5" id="meridians-list">
            {classicMeridians.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMeridianId(m.id);
                  setSelectedPointId(m.acupoints[0]?.id || '');
                }}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex justify-between items-center ${
                  m.id === selectedMeridianId
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-white hover:bg-stone-50 border-[#E9DFCB] text-stone-700'
                }`}
                id={`meridian-tab-${m.id}`}
              >
                <div>
                  <div className="font-serif text-sm flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${m.type === '阴经' ? 'bg-indigo-500' : 'bg-red-500'}`}></span>
                    {m.name}
                  </div>
                  <div className="text-[10px] text-gray-500 font-sans mt-0.5">{m.pinyin} • {m.acupoints.length}穴</div>
                </div>
                
                <span className="text-[9px] bg-stone-100 px-1.5 py-0.5 rounded font-sans text-stone-600 font-semibold uppercase">
                  五行: {m.element}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Meridian Description Panel */}
        <div className="bg-[#FAF7F2] border border-[#E9E1CE] p-4 rounded-xl space-y-2.5 shadow-sm" id="meridian-desc-card">
          <div className="flex justify-between items-center" id="meridian-desc-hdr">
            <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 font-sans border border-emerald-100 rounded-full font-semibold">
              {activeMeridian.type} • {activeMeridian.system}经
            </span>
            <span className="text-xs text-stone-600 italic">五行属 {activeMeridian.element}</span>
          </div>

          <h4 className="font-serif text-sm font-bold text-gray-905">{activeMeridian.name} 循行路线</h4>
          <p className="text-xs text-gray-600 leading-relaxed text-justify h-32 overflow-y-auto pr-1">
            {activeMeridian.routeDescription}
          </p>
        </div>
      </div>

      {/* CENTER WORKSPACE: Human silhouette overlay graphic visual canvas (5 cols) */}
      <div className="lg:col-span-4" id="visual-render-pane">
        <div className="bg-white border border-[#EBE4D5] rounded-xl p-5 shadow-sm space-y-4 text-center relative" id="body-silhouette-card">
          <div className="flex justify-between items-center border-b border-[#F4EFEB] pb-2.5" id="silhouette-hdr">
            <h4 className="font-serif text-xs font-bold text-gray-905">交互经络穴位图谱 (SVG模型)</h4>
            <span className="text-[10px] bg-amber-50 rounded border text-amber-800 px-2 py-0.5 font-medium animate-pulse">
              点击穴位节点
            </span>
          </div>

          {/* Interactive Silhouette canvas container */}
          <div className="relative w-full aspect-[2/3] bg-[#FAF8F4] border rounded-lg overflow-hidden flex items-center justify-center p-4 shadow-inner" id="canvas-silhouette">
            
            {/* SVG silhouette path layout drawings */}
            <svg viewBox="0 0 100 150" className="w-full h-full text-indigo-900" id="silhouette-vector">
              {/* Subtle human outline sketch */}
              <path 
                d="M 50,15 C 47,15,44,18,44,22 C 44,25,47,30,50,30 C 53,30,56,25,56,22 C 56,18,53,15,50,15 Z" 
                fill="#DDD6C7" opacity="0.3" 
              /> {/* Head */}
              <path 
                d="M 44,30 Q 35,33 28,45 Q 26,50 25,60 Q 23,80 28,105 Q 35,115 35,125 L 34,142 L 39,142 L 42,125 L 45,125 L 45,142 L 50,142" 
                fill="none" stroke="#DDD6C7" strokeWidth="1" opacity="0.4"
              /> {/* Left Half outline */}
              <path 
                d="M 56,30 Q 65,33 72,45 Q 74,50 75,60 Q 77,80 72,105 Q 65,115 65,125 L 66,142 L 61,142 L 58,125 L 55,125 L 55,142 L 50,142" 
                fill="none" stroke="#DDD6C7" strokeWidth="1" opacity="0.4"
              /> {/* Right Half outline */}

              {/* RENDER THE DYNAMIC PATHWAY OF SELECTED MERIDIAN */}
              {activeMeridian.acupoints.length > 1 && (
                <polyline
                  points={activeMeridian.acupoints.map(ap => `${ap.x / 1.1},${ap.y / 1.1 + 10}`).join(' ')}
                  fill="none"
                  stroke={activeMeridian.type === '阴经' ? '#3B82F6' : '#EF4444'}
                  strokeWidth="2"
                  strokeDasharray="1.5,1.5"
                  id="active-meridian-polyline"
                />
              )}

              {/* RENDER ACUPOINTS AS DOTS */}
              {activeMeridian.acupoints.map((ap) => {
                const isActive = ap.id === selectedPointId;
                const strokeColor = activeMeridian.type === '阴经' ? '#2563EB' : '#DC2626';
                const fillColor = isActive ? '#F59E0B' : '#FFFFFF';
                // Adjust mapped 100/100 points onto SVG 100/150 space nicely with scale and shift
                const svgX = ap.x / 1.1;
                const svgY = ap.y / 1.1 + 10;

                return (
                  <g 
                    key={ap.id} 
                    onClick={() => handlePointClick(ap)} 
                    className="cursor-pointer group/node"
                    id={`svg-point-g-${ap.id}`}
                  >
                    {/* Hover hotspot */}
                    <circle cx={svgX} cy={svgY} r="7" fill="transparent" />
                    
                    {/* Ring highlight animation */}
                    {isActive && (
                      <circle cx={svgX} cy={svgY} r="6" fill="none" stroke="#F59E0B" strokeWidth="1" className="animate-ping" />
                    )}

                    <circle 
                      cx={svgX} 
                      cy={svgY} 
                      r={isActive ? "4" : "2.5"} 
                      fill={fillColor} 
                      stroke={strokeColor} 
                      strokeWidth="1.5"
                      className="transition-all"
                    />

                    {/* Miniature code tag next to point */}
                    <text 
                      x={svgX + (svgX > 50 ? 5 : -5)} 
                      y={svgY + 2} 
                      textAnchor={svgX > 50 ? "start" : "end"} 
                      fill="#1F2937" 
                      fontSize="5" 
                      fontWeight={isActive ? "bold" : "normal"}
                      className="font-sans select-none opacity-60 group-hover/node:opacity-100"
                    >
                      {ap.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Float HUD of active selection */}
            {activePoint && (
              <div className="absolute bottom-3 left-3 bg-stone-900/90 backdrop-blur-md rounded border border-stone-700 px-2 py-1.5 text-left z-10" id="visual-hud">
                <span className="text-[9px] uppercase tracking-wider text-amber-400 font-mono">定位经络</span>
                <div className="text-xs font-bold text-white font-serif">{activePoint.name} ({activePoint.code})</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT DETAIL: Point Indications & Direct Notes generation (3 cols) */}
      <div className="lg:col-span-4" id="acupoint-infobox-pane">
        {activePoint ? (
          <div className="bg-white border border-[#EBE4D5] rounded-xl p-5 shadow-sm space-y-4" id="acupoint-details-card">
            <div className="border-b border-[#F4EFEB] pb-3" id="acupoint-card-hdr">
              <div className="text-xs font-bold text-[#8C3E2B] font-serif uppercase tracking-widest">
                腧穴考据精识
              </div>
              
              <h3 className="font-serif text-lg font-bold text-gray-905 flex items-center justify-between mt-1">
                <span>{activePoint.name} <span className="text-xs font-mono font-normal text-stone-500">[{activePoint.pinyin}]</span></span>
                <span className="font-mono text-xs text-indigo-700 uppercase bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">
                  {activePoint.code}
                </span>
              </h3>
            </div>

            <div className="space-y-3.5 text-xs text-gray-700 leading-normal" id="acupoint-details-body">
              {/* Location */}
              <div className="space-y-1" id="ap-loc">
                <h5 className="font-semibold text-gray-900 font-serif flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#8C3E2B] rounded-full"></span>
                  【精确位置】
                </h5>
                <p className="pl-3.5 text-stone-600 text-justify">{activePoint.location}</p>
              </div>

              {/* Indications */}
              <div className="space-y-1" id="ap-ind">
                <h5 className="font-semibold text-gray-900 font-serif flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#8C3E2B] rounded-full"></span>
                  【核心主治】
                </h5>
                <p className="pl-3.5 text-stone-600 text-justify">{activePoint.indications}</p>
              </div>

              {/* Manipulation */}
              <div className="space-y-1" id="ap-man">
                <h5 className="font-semibold text-gray-900 font-serif flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#8C3E2B] rounded-full"></span>
                  【针灸刺灸法】
                </h5>
                <p className="pl-3.5 text-stone-600 text-justify">{activePoint.manipulation}</p>
              </div>
            </div>

            {/* Quick inject note buttons */}
            <div className="border-t border-[#F4EFEB] pt-4 mt-2 space-y-2.5" id="acupoint-card-footer">
              <button
                onClick={handleImportPointToNote}
                className="w-full bg-[#1F3323] hover:bg-[#132116] transition text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                id="inject-point-note-btn"
              >
                <Plus className="w-4 h-4" />
                <span>一键将穴位归纳录入我的笔记</span>
              </button>

              {showInjectedNoteConfirm && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg text-center font-medium animate-bounce" id="inject-success-msg">
                  ✓ 笔记导出成功！已将“{activePoint.name}”学术词条挂接至我的全局随堂笔记。可前往“随堂笔记本”中浏览与拓展！
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 border border-[#E9E2D2] rounded-xl py-12 text-center text-gray-400 text-xs" id="no-ap-sel">
            请在左侧模型中点击腧穴节点查看特定属性细节。
          </div>
        )}

        {/* Warning Fact Box */}
        <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-xl mt-4 flex gap-2.5" id="needle-safety-box">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-amber-800 leading-normal" id="safety-text">
            <strong>【腧穴针刺警戒】：</strong><br/>
            部分背俞穴（如 肺俞 等）及胸前壁特定穴位，由于临近肺叶脏器，临床针法不可行极直极深刺，严防出现气胸等并发事故；孕妇腹部及合谷、至阴等穴慎下针。
          </div>
        </div>
      </div>

    </div>
  );
}
