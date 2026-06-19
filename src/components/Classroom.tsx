import React, { useState, useRef, useEffect } from 'react';
import { Lesson, StudyNote, Blackboard } from '../types';
import { tcmChapters } from '../data/tcmData';
import { lessons as genLessons } from '../data/lessons';
import { BookOpen, Video, FileText, Plus, Anchor, Layers, MapPin, Sparkles, Check, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClassroomProps {
  currentLessonId: string;
  notes: StudyNote[];
  onAddNote: (note: Omit<StudyNote, 'id' | 'timestamp'>) => void;
  onDeleteNote: (id: string) => void;
  onToggleLessonComplete: (id: string) => void;
  completedLessons: string[];
  initialActiveItem?: { lessonId?: string; boardId?: string };
}

export default function Classroom({
  currentLessonId,
  notes,
  onAddNote,
  onDeleteNote,
  onToggleLessonComplete,
  completedLessons,
  initialActiveItem
}: ClassroomProps) {
  // Find current lesson — merge mock + generated real data
  const mockLessons = tcmChapters.flatMap(ch => ch.lessons);
  const allLessons = mockLessons.length > 0 ? mockLessons : genLessons;
  const [activeLessonId, setActiveLessonId] = useState(currentLessonId || (allLessons[0]?.id || 'l-shanghanlun01'));

  useEffect(() => {
    if (initialActiveItem?.lessonId) {
      setActiveLessonId(initialActiveItem.lessonId);
    }
  }, [initialActiveItem]);

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];

  // Blackboard selection
  const [selectedBbId, setSelectedBbId] = useState<string>(
    activeLesson.blackboards[0]?.id || ''
  );

  useEffect(() => {
    if (activeLesson.blackboards.length > 0) {
      const matchBoard = initialActiveItem?.boardId && activeLesson.blackboards.some(b => b.id === initialActiveItem.boardId);
      setSelectedBbId(matchBoard ? initialActiveItem.boardId! : activeLesson.blackboards[0].id);
    }
  }, [activeLessonId, initialActiveItem]);

  const activeBb = activeLesson.blackboards.find(b => b.id === selectedBbId) || activeLesson.blackboards[0];

  // Note taking state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedAnchorPin, setSelectedAnchorPin] = useState<string>(''); // Point's label or index

  // Active highlighted hotspot pin inside blackboard
  const [highlightedPin, setHighlightedPin] = useState<string | null>(null);
  
  // Note pane scroll reference
  const blackboardRef = useRef<HTMLDivElement>(null);

  // Auto-anchor triggers a flash animation on the coordinates of blackboard
  const handleAnchorJump = (bbId: string, pointLabel: string) => {
    // 1. Ensure tab is updated to target blackboard if different
    if (bbId !== selectedBbId) {
      setSelectedBbId(bbId);
    }
    
    // 2. Set highlight pin which prompts ring flash
    setHighlightedPin(pointLabel);

    // 3. Keep highlighting for 3.5 seconds
    setTimeout(() => {
      setHighlightedPin(null);
    }, 4000);

    // 4. Scroll blackboard container to center
    if (blackboardRef.current) {
      blackboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleLessonSwitch = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setSelectedAnchorPin('');
    setNoteTitle('');
    setNoteContent('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    onAddNote({
      lessonId: activeLesson.id,
      lessonTitle: activeLesson.title,
      blackboardId: activeBb?.id,
      blackboardAnchor: selectedAnchorPin || undefined,
      title: noteTitle.trim() || `${activeBb?.title || '板书'} 笔记`,
      content: noteContent.trim()
    });

    // Reset notes input
    setNoteTitle('');
    setNoteContent('');
    setSelectedAnchorPin('');
  };

  const lessonNotes = notes.filter(n => n.lessonId === activeLesson.id);
  const isCurrentLessonCompleted = completedLessons.includes(activeLesson.id);

  // Simulated lesson index list triggers
  const prevLesson = allLessons.find(l => l.seq === activeLesson.seq - 1);
  const nextLesson = allLessons.find(l => l.seq === activeLesson.seq + 1);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="classroom-workspace">
      
      {/* LEFT SECTION (7 cols on XL): Outlines & Video/Lesson Details */}
      <div className="xl:col-span-7 space-y-6" id="classroom-player-pane">
        
        {/* Lesson Navigation Header */}
        <div className="bg-bento-paper border border-bento-border rounded-xl p-4 flex items-center justify-between shadow-xs" id="lesson-card-switch-hdr">
          <button 
            disabled={!prevLesson}
            onClick={() => prevLesson && handleLessonSwitch(prevLesson.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-bento-border hover:bg-bento-bg transition ${!prevLesson && 'opacity-40 cursor-not-allowed'}`}
            id="prev-lesson-btn"
          >
            <ArrowLeft className="w-4 h-4 text-bento-accent" />
            <span className="hidden sm:inline text-bento-ink">上一讲</span>
          </button>
          
          <div className="text-center" id="lesson-seq-title">
            <div className="text-[10px] uppercase tracking-widest font-sans font-bold text-bento-accent">
              第 {activeLesson.seq} 讲 • 《伤寒杂病论》
            </div>
            <h2 className="font-serif text-xs sm:text-sm font-bold text-bento-ink mt-0.5 line-clamp-1 max-w-[280px] sm:max-w-[360px]">
              {activeLesson.title}
            </h2>
          </div>

          <button 
            disabled={!nextLesson}
            onClick={() => nextLesson && handleLessonSwitch(nextLesson.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-bento-border hover:bg-bento-bg transition ${!nextLesson && 'opacity-40 cursor-not-allowed'}`}
            id="next-lesson-btn"
          >
            <span className="hidden sm:inline text-bento-ink">下一讲</span>
            <ArrowRight className="w-4 h-4 text-bento-accent" />
          </button>
        </div>

        {/* Dynamic Video Mock & Progress Timeline */}
        <div className="bg-[#1C201E] rounded-xl overflow-hidden shadow-md relative border border-bento-border/30" id="video-wrapper">
          
          {/* Top Video Header HUD */}
          <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/85 to-transparent p-4 flex justify-between items-center z-10" id="player-hud">
            <span className="text-[11px] bg-bento-accent text-white rounded px-1.5 py-0.5 uppercase tracking-wide font-medium flex items-center gap-1 shadow">
              <span className="w-1.5 h-1.5 bg-white rounded-full block animate-ping"></span> Live 传习 • 经典讲学
            </span>
            <span className="text-xs text-stone-300 font-mono">视频时长: {activeLesson.duration}</span>
          </div>

          {/* Interactive Screen Simulator */}
          <div className="aspect-video w-full relative flex flex-col justify-center items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-black p-6 text-center text-stone-200" id="video-canvas">
            <div className="opacity-15 absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,_#8B0000_0%,_transparent_60%)]"></div>
            
            <Video className="w-14 h-14 text-bento-accent animate-pulse mb-3" />
            <div className="font-serif text-[#F4F1EA] text-base sm:text-lg font-bold max-w-sm sm:max-w-md leading-relaxed" id="video-sim-overlay-title">
              {activeLesson.title}
            </div>
            <p className="text-xs text-stone-400 mt-2 max-w-xs font-serif">
              主讲：伤寒金匮师资课题组 · 书山有径
            </p>

            {/* Simulated Live Transcript Text box */}
            <div className="absolute bottom-6 left-4 right-4 bg-black/75 backdrop-blur-md border border-white/10 rounded-lg p-3 text-left" id="live-transcript-box">
              <div className="text-[10px] text-bento-accent font-bold mb-1 flex items-center justify-between">
                <span>实时随堂速记音轨同步 (18:45)</span>
                <span className="text-[9px] text-stone-400">点击相应板书定位点可抓拍板书</span>
              </div>
              <p className="text-[11px] text-stone-300 font-sans leading-relaxed">
                "...太阳中风，发热，汗出，恶风，脉浮缓。卫强营弱，以桂白调其营卫平衡。啜热稀粥，温胃助阳以借谷气发汗，方显经方发汗有度，不留隐邪。"
              </p>
            </div>
          </div>

          {/* Player controls */}
          <div className="bg-[#131615] px-4 py-3 border-t border-bento-border/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-xs" id="player-controls">
            <div className="flex items-center space-x-3 w-full sm:w-auto" id="ctrl-buttons">
              <button className="bg-bento-accent hover:opacity-90 transition text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1 shadow-xs" id="mock-play-btn">
                <span>播放</span>
              </button>
              <button className="hover:bg-white/5 px-2 py-1.5 rounded transition text-xs" id="mock-rewind-btn">
                <span>后退10秒</span>
              </button>
            </div>

            {/* Time Track bar */}
            <div className="flex-1 flex items-center gap-2 w-full" id="ctrl-timeline">
              <span className="font-mono text-[10px]">18:45</span>
              <div className="flex-1 h-1.5 bg-stone-700 rounded-full relative overflow-hidden" id="timeline-bar">
                <div className="absolute left-0 top-0 h-full w-[40%] bg-bento-accent"></div>
                <div className="absolute left-[40%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow"></div>
              </div>
              <span className="font-mono text-[10px]">{activeLesson.duration}</span>
            </div>
          </div>
        </div>

        {/* Lesson Outline Details Tabs */}
        <div className="bg-bento-paper border border-bento-border rounded-xl p-5 space-y-4 shadow-xs" id="lesson-infobox">
          <div className="flex justify-between items-center border-b border-bento-border pb-3" id="lesson-infobox-hdr">
            <h3 className="font-serif font-bold text-bento-ink flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-bento-accent" />
              随堂提纲与讲记
            </h3>
            <button
              onClick={() => onToggleLessonComplete(activeLesson.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center gap-1 font-semibold ${
                isCurrentLessonCompleted
                  ? 'bg-[#FDF5F5] text-bento-accent border-bento-accent/25 shadow-xs'
                  : 'bg-white text-stone-600 border-bento-border hover:bg-stone-50'
              }`}
              id="lesson-manual-complete-btn"
            >
              {isCurrentLessonCompleted ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isCurrentLessonCompleted ? '本篇已结课' : '打卡本篇'}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs text-stone-700 leading-relaxed font-serif" id="lesson-text-body">
            <h4 className="font-serif font-bold text-bento-accent text-sm">【本节核心解析】</h4>
            <p>{activeLesson.content}</p>
            <div className="bg-bento-bg border border-bento-border rounded-lg p-4 mt-2 font-sans" id="outline-checklist">
              <span className="font-bold text-bento-accent block mb-1">随堂重点研学考标：</span>
              <ul className="list-disc pl-4 space-y-1.5 text-stone-600 text-[11px]" id="outline-list">
                <li>理解太阳中风证因风寒外袭，致使营卫无法相守的病理传变机理。</li>
                <li>掌握桂枝与芍药等比配伍解肌发表、酸甘化阴的经方内涵。</li>
                <li>熟记服药后啜热稀粥促发微汗排汗、顾护中气胃气的调护诀窍。</li>
              </ul>
            </div>
            {activeLesson.keywords && (
              <div className="bg-bento-accent/5 border border-bento-accent/10 rounded-lg p-4 mt-2">
                <h4 className="font-serif text-xs font-bold text-bento-accent flex items-center gap-1.5 mb-2">
                  <HelpCircle className="w-3.5 h-3.5" /> 本课复习关键词
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed font-serif">
                  {activeLesson.keywords}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chapters Outline Selector quick-list */}
        <div className="bg-bento-paper border border-bento-border rounded-xl p-4 shadow-xs" id="other-chapters-quick-selector">
          <h4 className="text-xs font-bold text-bento-accent border-b border-bento-border pb-2 mb-3 font-serif">
            学海无涯 • 伤寒病证课时检索
          </h4>
          <div className="space-y-2 overflow-y-auto max-h-[160px] pr-1" id="lessons-outline-scroll">
            {tcmChapters.map(ch => (
              <div key={ch.id} className="space-y-1" id={`sidebar-chapter-group-${ch.id}`}>
                <div className="text-[10px] font-bold text-stone-500 uppercase px-1">{ch.title}</div>
                <div className="grid grid-cols-1 gap-1" id={`sidebar-lessons-list-${ch.id}`}>
                  {ch.lessons.map(l => (
                    <div
                      key={l.id}
                      onClick={() => handleLessonSwitch(l.id)}
                      className={`text-xs px-2.5 py-2 rounded-lg cursor-pointer flex justify-between items-center transition ${
                        l.id === activeLessonId
                          ? 'bg-[#FDF5F5] text-bento-accent font-semibold border border-bento-accent/25'
                          : 'hover:bg-bento-bg text-stone-600 border border-transparent'
                      }`}
                      id={`sidebar-lesson-item-${l.id}`}
                    >
                      <span className="line-clamp-1">{l.title}</span>
                      <span className="text-[10px] text-stone-500 flex-shrink-0 ml-1 italic font-mono">{l.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION (5 cols on XL): Blackboard Hotspots / Pinpoint notes */}
      <div className="xl:col-span-5 space-y-6" id="classroom-notes-pane">
        
        {/* TAB HEADER: Blackboard / Notes */}
        <div ref={blackboardRef} className="bg-bento-paper border border-bento-border rounded-xl p-1 shadow-xs flex" id="tabs-holder">
          <div className="flex-1 text-center py-2 text-xs font-bold text-bento-accent bg-[#FDF5F5] rounded-lg border border-bento-accent/15">
            随堂立体板书与交互锚准点
          </div>
        </div>

        {/* Active Blackboard Schematics Card */}
        {activeLesson.blackboards.length > 0 ? (
          <div className="bg-bento-paper border border-bento-border rounded-xl p-5 space-y-4 shadow-xs" id="blackboard-viewer">
            
            {/* Blackboard Switch Selector Tabs */}
            {activeLesson.blackboards.length > 1 && (
              <div className="flex gap-2 border-b border-bento-border pb-2 overflow-x-auto" id="bb-switch-tabs">
                {activeLesson.blackboards.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBbId(b.id)}
                    className={`text-[10px] sm:text-xs px-2.5 py-1.5 rounded transition whitespace-nowrap font-semibold ${
                      b.id === selectedBbId
                        ? 'bg-bento-accent text-white font-bold'
                        : 'bg-bento-bg hover:bg-stone-200 text-stone-600'
                    }`}
                    id={`bb-tab-${b.id}`}
                  >
                    板书图 {b.timestamp}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between" id="active-bb-info">
              <h4 className="font-serif text-bento-ink font-bold text-sm flex items-center gap-1">
                <Layers className="w-4 h-4 text-bento-accent" />
                {activeBb?.title}
              </h4>
              <span className="text-[10px] font-mono bg-bento-bg text-stone-650 px-2 py-0.5 rounded border border-bento-border">
                课堂定位 {activeBb?.timestamp}
              </span>
            </div>

            {/* Stylized chalkboard container */}
            <div 
              className="relative w-full aspect-[4/3] bg-[#0E241E] rounded-xl border-4 border-[#3D2918] shadow-inner overflow-hidden flex flex-col p-4 select-none font-mono"
              id="chalkboard-viewport"
            >
              {/* Slate board grain overlays */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#153A30_0%,_#091713_100%)] opacity-80 z-0 pointer-events-none"></div>
              
              <div className="absolute right-3 bottom-2 text-[10px] text-zinc-500/80 uppercase tracking-widest font-sans font-bold z-0 pointer-events-none">
                岐黄学堂板书板纸
              </div>

              {/* Responsive SVG drawings resembling hand-drawn chalkboard schemas */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-stone-200/90 leading-relaxed text-center text-xs" id="chalkboard-render-layer">
                
                {/* Custom layout renderings based on Blackboard Category */}
                {activeBb.id === "bb-guizhitang-1" && (
                  <div className="w-full h-full flex flex-col justify-between p-4" id="chalk-gui-1">
                    <div className="text-stone-300 font-serif border-b border-dashed border-stone-200/40 pb-1.5 font-bold mb-3">
                      【太阳中风 - 核心病理营卫气血运行】
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 items-center flex-1 my-1">
                      <div className="border border-red-300/40 rounded p-2 bg-red-950/20 text-center">
                        <div className="text-red-300 font-bold">卫气强 ──（表阳被遏）</div>
                        <div className="text-[10px] text-stone-400 mt-1">风邪袭表 发热急迫</div>
                      </div>
                      <div className="border border-cyan-300/40 rounded p-2 bg-cyan-950/20 text-center">
                        <div className="text-cyan-300 font-bold">营气弱 ──（营阴不固）</div>
                        <div className="text-[10px] text-stone-400 mt-1">腠理疏松 汗自流泄</div>
                      </div>
                    </div>

                    <div className="text-center font-serif py-1.5 text-yellow-100 font-bold">
                      ↓↓↓ 疗法：调和营卫，发汗解肌
                    </div>

                    <div className="bg-[#1f4236] border border-stone-400/35 rounded-lg p-1.5 text-[11px]" id="chalk-formula-ratio">
                      <span className="text-amber-200 font-bold">桂枝汤：</span>
                      桂枝(三两 • 温助表阳) : 白芍(三两 • 酸敛收营) = 1:1 等量相须
                    </div>
                  </div>
                )}

                {activeBb.id === "bb-guizhitang-2" && (
                  <div className="w-full h-full flex flex-col justify-between p-4" id="chalk-gui-2">
                    <div className="text-stone-300 font-serif border-b border-dashed border-stone-200/40 pb-1.5 font-bold">
                      【桂枝汤加减临证路径图】
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-2 text-left my-2 pl-4 text-[11px]" id="chalk-pathways">
                      <div className="flex items-center gap-1.5 text-[#FCD34D]"><span className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]"></span> +葛根 → 桂枝加葛根汤 (治强项背肌急)</div>
                      <div className="flex items-center gap-1.5 text-teal-300"><span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span> +厚朴杏子 → 桂枝加厚朴杏子汤 (治太阳病微喘)</div>
                      <div className="flex items-center gap-1.5 text-pink-300"><span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span> 去芍药 → 桂枝去芍药汤 (治太阳病下后心胸气逆)</div>
                      <div className="flex items-center gap-1.5 text-amber-300"><span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span> +附子 → 桂枝加附子汤 (治汗漏不止肢体急)</div>
                    </div>
                  </div>
                )}

                {activeBb.id === "bb-shaochuang-1" && (
                  <div className="w-full h-full flex flex-col justify-between p-4" id="chalk-shao-1">
                    <div className="text-stone-300 font-serif border-b border-dashed border-stone-200/40 pb-1.5 font-bold mb-2">
                      【少阳半表半里枢转机制图】
                    </div>

                    <div className="flex justify-around items-center flex-1 my-2">
                      <div className="text-emerald-400 font-serif">太阳 (表) ──</div>
                      <div className="border-2 border-dashed border-yellow-200/30 p-2 rounded bg-yellow-900/10 text-yellow-100 font-bold">
                        【少阳枢机不利】<br/>
                        <span className="text-[10px] text-gray-300">往来寒热、口苦咽干目眩</span>
                      </div>
                      <div className="text-orange-400 font-serif">── 阳明 (里)</div>
                    </div>

                    <div className="bg-[#1f4236] border border-stone-400/35 rounded p-1 text-[11px]">
                      <span className="text-amber-200 font-bold">和解法主药：</span>
                      柴胡(透表邪、舒少阳) —— 黄芩(清里热、泄胆火)
                    </div>
                  </div>
                )}

                {activeBb.id === "bb-yangming-1" && (
                  <div className="w-full h-full flex flex-col justify-between p-4" id="chalk-yang-1">
                    <div className="text-stone-300 font-serif border-b border-dashed border-stone-200/40 pb-1.5 font-bold">
                      【阳明腑实：三承气汤选用分析】
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-1 my-2 text-left text-[10px]" id="chalk-tangs">
                      <div><span className="text-teal-300 font-semibold">[调胃承气汤]</span>：大黄、芒硝、甘草。治燥重结轻，保津和胃。</div>
                      <div><span className="text-yellow-200 font-semibold">[小承气汤]</span>：大黄、厚朴、枳实。治痞满重实便秘，偏于行气走滞。</div>
                      <div><span className="text-orange-400 font-semibold">[大承气汤]</span>：大黄、芒硝、厚朴、枳实。痞满燥实皆具，峻热急下。</div>
                    </div>
                  </div>
                )}
              </div>

              {/* RENDER THE PINS/HOTSPOTS OVERLAID AT PRECISE COORDINATES */}
              {activeBb.points.map((pt, index) => {
                const isHighlighted = highlightedPin === pt.label;
                return (
                  <div
                    key={pt.label}
                    className="absolute z-20"
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    id={`hotspot-pin-${index}`}
                  >
                    <motion.button
                      onClick={() => {
                        setSelectedAnchorPin(pt.label);
                        setNoteTitle(`关于板书"${pt.label}"的笔记`);
                        setNoteContent(`[课堂板书锚点 ${activeBb.timestamp} - ${pt.label}]: ${pt.details}\n我本人的思悟：`);
                        setHighlightedPin(pt.label);
                      }}
                      className="relative flex items-center justify-center cursor-pointer group"
                      id={`pin-btn-${index}`}
                    >
                      {/* Pulsive radar rings on highlight */}
                      {isHighlighted && (
                        <span className="absolute inline-flex h-10 w-10 rounded-full bg-rose-400 opacity-65 animate-ping"></span>
                      )}
                      
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-[10px] shadow ${
                        isHighlighted 
                          ? 'bg-rose-600 border-white text-white animate-bounce' 
                          : 'bg-[#C23C27] hover:bg-[#8C1E10] border-[#F2ECE4] text-[#FAF5ED]'
                      }`}>
                        {index + 1}
                      </span>

                      {/* Tooltip on Hover */}
                      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-stone-900 border border-stone-700 p-2.5 rounded shadow-lg text-white font-sans text-xs w-48 text-left z-30 pointer-events-none">
                        <strong className="text-amber-400 block mb-0.5">{pt.label}</strong>
                        {pt.details}
                        <span className="block mt-1 text-[10px] text-emerald-400 font-serif">点击：直接将该论点挂接并导入笔记</span>
                      </span>
                    </motion.button>
                  </div>
                );
              })}
            </div>

            {/* Explanatory text of Chalkboard Hotspots */}
            <div className="bg-bento-bg border border-bento-border rounded-lg p-3" id="bb-hotspots-explanation">
              <div className="text-xs font-bold text-bento-accent flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                随学板书双向交互：
              </div>
              <p className="text-[11px] text-stone-500 mt-1 font-serif leading-relaxed">
                点击黑板手绘图谱上的红色标注数字，可自动把该核心考点和定位代码导入下方的个人笔记中，避免手动摘录之繁重。
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-bento-bg border border-bento-border rounded-xl py-12 text-center text-stone-400 text-xs font-serif" id="no-bbs">
            本课暂无板书。
          </div>
        )}

        {/* Note Taking Interactive Form */}
        <div className="bg-bento-paper border border-bento-border rounded-xl p-5 space-y-4 shadow-xs" id="notes-maker-panel">
          <h3 className="font-serif font-bold text-bento-ink text-sm flex items-center gap-2 border-b border-bento-border pb-2">
            <Plus className="w-5 h-5 text-bento-accent" />
            新建课堂释难精研笔记
          </h3>

          <form onSubmit={handleCreateNote} className="space-y-3" id="notes-form">
            <div className="space-y-1.5">
              <label className="text-[10px] text-stone-500 font-bold uppercase font-sans tracking-wide">
                挂接板书精细锚定点 (可选):
              </label>
              <div className="flex gap-1.5 flex-wrap" id="anchor-badge-row">
                {activeBb?.points.map(pt => (
                  <button
                    key={pt.label}
                    type="button"
                    onClick={() => {
                      setSelectedAnchorPin(pt.label);
                      setNoteTitle(`关于板书"${pt.label}"的笔记`);
                    }}
                    className={`text-[10px] px-2.5 py-1 rounded transition border font-semibold ${
                      selectedAnchorPin === pt.label
                        ? 'bg-[#FDF5F5] border-bento-accent/40 text-bento-accent'
                        : 'bg-white border-bento-border text-stone-600 hover:bg-stone-50'
                    }`}
                    id={`note-anchor-badge-${pt.label}`}
                  >
                    <Anchor className="w-2.5 h-2.5 inline mr-1 text-bento-accent" />
                    {pt.label}
                  </button>
                ))}
                {selectedAnchorPin && (
                  <button
                    type="button"
                    onClick={() => setSelectedAnchorPin('')}
                    className="text-[9px] text-bento-accent hover:underline font-bold"
                    id="cancel-anchor-btn"
                  >
                    清除挂接
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="text"
                placeholder="输入笔记核心论题..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full bg-bento-bg border border-bento-border rounded-lg px-3 py-2 text-xs text-bento-ink placeholder-stone-400 focus:outline-none focus:border-bento-accent focus:ring-1 focus:ring-bento-accent transition-all"
                id="note-title-input"
              />
            </div>

            <div className="space-y-1">
              <textarea
                placeholder="在此随手写下对伤寒六经病势传变、经典医案和配伍比例的心得感悟..."
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-bento-bg border border-bento-border rounded-lg px-3 py-2 text-xs text-bento-ink placeholder-stone-400 focus:outline-none focus:border-bento-accent focus:ring-1 focus:ring-bento-accent transition-all"
                id="note-content-input"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-bento-accent hover:opacity-95 text-white rounded-lg py-2 text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              id="submit-note-btn"
            >
              <Plus className="w-4 h-4" />
              保存草稿并写入笔记系统
            </button>
          </form>
        </div>

        {/* Saved notes matching this lesson */}
        <div className="space-y-3" id="lesson-saved-notes-wrapper">
          <h4 className="font-serif font-bold text-bento-accent text-xs uppercase tracking-wider">
            本课研习历史笔记 ({lessonNotes.length})
          </h4>

          {lessonNotes.length === 0 ? (
            <div className="bg-bento-paper border border-dashed border-bento-border rounded-xl py-8 text-center text-stone-500 text-xs font-serif shadow-xs" id="no-lesson-notes">
              尚未有笔记。可在上方撰写笔记，或点击板演数字键自动双向绑定。
            </div>
          ) : (
            <div className="space-y-3" id="lesson-notes-scroller">
              <AnimatePresence>
                {lessonNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-bento-paper border border-bento-border rounded-xl p-4 shadow-xs space-y-2 relative"
                    id={`lesson-note-item-${note.id}`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h5 className="font-serif text-sm font-bold text-bento-ink">{note.title}</h5>
                        <p className="text-[10px] text-stone-500 font-sans mt-0.5">{note.timestamp}</p>
                      </div>
                      
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-[10px] text-stone-600 hover:text-bento-accent hover:bg-rose-50 px-2 py-1 rounded transition font-semibold"
                        title="删除此草稿"
                        id={`delete-note-btn-${note.id}`}
                      >
                        删除
                      </button>
                    </div>

                    <p className="text-xs text-stone-700 whitespace-pre-wrap font-serif leading-relaxed">{note.content}</p>

                    {/* INTERACTIVE BOARD ANCHOR JUMP SWITCH BUTTON */}
                    {note.blackboardId && note.blackboardAnchor && (
                      <div className="border-t border-bento-border pt-2.5 mt-2 flex justify-between items-center" id={`anchor-footer-${note.id}`}>
                        <span className="text-[10px] bg-[#FDF5F5] text-bento-accent border border-bento-accent/10 rounded px-1.5 py-0.5 flex items-center gap-1 font-serif font-bold">
                          <MapPin className="w-3 h-3 text-bento-accent" />
                          板书定位锚准点: {note.blackboardAnchor}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => handleAnchorJump(note.blackboardId!, note.blackboardAnchor!)}
                          className="text-[10px] text-bento-accent hover:bg-rose-50 px-2   py-1 rounded border border-bento-accent/20 font-bold flex items-center gap-1 transition cursor-pointer"
                          id={`jump-anchor-btn-${note.id}`}
                        >
                          <Anchor className="w-3 h-3 text-bento-accent" />
                          图文映射定位
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
