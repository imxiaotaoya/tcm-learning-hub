import React, { useState } from 'react';
import { Chapter, Formula, Herb, Acupoint, Progress, Lesson } from '../types';
import { classicHerbs, classicMeridians } from '../data/tcmData';
import { lessons as realLessons } from '../data/lessons';
import { chapters as realChapters } from '../data/chapters';
import { formulas as realFormulas } from '../data/formulas';
import { Search, BookOpen, Sparkles, Award, FileText, CheckCircle, Flame, ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import LearningPathSelector from './LearningPathSelector';
import { tokenize, translatePlainQuery } from '../utils/searchEngine';

interface StatsDashboardProps {
  progress: Progress;
  onNavigate: (tab: string, itemData?: any) => void;
  onToggleLessonComplete: (lessonId: string) => void;
}

export default function StatsDashboard({ progress, onNavigate, onToggleLessonComplete }: StatsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    lessons: Lesson[];
    formulas: Formula[];
    herbs: Herb[];
    acupoints: Acupoint[];
  }>({ lessons: [], formulas: [], herbs: [], acupoints: [] });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults({ lessons: [], formulas: [], herbs: [], acupoints: [] });
      setPlainResults([]);
      return;
    }
    const { translated, results: plainRes } = translatePlainQuery(query);
    if (translated && plainRes.length > 0) setPlainResults(plainRes);
    else setPlainResults([]);
    const terms = tokenize(query);
    const q = query.toLowerCase();
    const foundLessons: Lesson[] = [];
    tcmChapters.forEach(ch => {
      ch.lessons.forEach(l => {
        const hay = l.title + l.summary + l.content + (l.keywords || '');
        if (terms.some(t => hay.includes(t)) || hay.toLowerCase().includes(q)) foundLessons.push(l);
      });
    });
    const allFormulas = [...realFormulas];
    const foundFormulas = allFormulas.filter(f => {
      const hay = f.name + f.symptoms.join(' ') + f.syndromes.join(' ') + f.pathology + f.explanation;
      return terms.some(t => hay.includes(t)) || hay.toLowerCase().includes(q);
    });
    const foundHerbs = classicHerbs.filter(h => h.name.toLowerCase().includes(q) || h.efficacy.toLowerCase().includes(q) || h.indications.toLowerCase().includes(q) || h.taste.some(t => t.toLowerCase().includes(q)));
    const foundAcupoints: Acupoint[] = [];
    classicMeridians.forEach(m => { m.acupoints.forEach(ap => { if (ap.name.toLowerCase().includes(q) || ap.indications.toLowerCase().includes(q) || ap.location.toLowerCase().includes(q)) foundAcupoints.push(ap); }); });
    setSearchResults({ lessons: foundLessons.slice(0,8), formulas: foundFormulas.slice(0,8), herbs: foundHerbs.slice(0,8), acupoints: foundAcupoints.slice(0,8) });
  };
  const [plainResults, setPlainResults] = useState<{ type: string; text: string; description: string }[]>([]);

  // Resolve chapters' lessons from generated data
  const resolvedChapters: Chapter[] = realChapters.map(ch => ({
    ...ch,
    lessons: realLessons.filter(l => l.chapterId === ch.id),
  }));
  const tcmChapters = resolvedChapters.length > 0 ? resolvedChapters : [];
  const totalLessons = realLessons.length;
  const completedLessonsCount = progress.completedLessons.length;
  const progressPercent = totalLessons ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const hasResults = searchResults.lessons.length > 0 || 
                     searchResults.formulas.length > 0 || 
                     searchResults.herbs.length > 0 || 
                     searchResults.acupoints.length > 0;

  return (
    <div className="space-y-8" id="stats-dashboard-root">
      {/* Three-path Learning Selector */}
      <LearningPathSelector onNavigate={onNavigate} />

      {/* Search Header Banner */}
      <div className="relative overflow-hidden bg-bento-paper border border-bento-border rounded-xl p-6 sm:p-10 shadow-xs text-bento-ink" id="search-banner">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none scale-125 translate-x-12 translate-y-[-20px] font-serif text-[180px] text-bento-accent">
          岐黄
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4" id="banner-content">
          <div className="flex items-center space-x-2 bg-[#FDF5F5] w-fit px-3 py-1 rounded-full text-bento-accent text-xs font-semibold border border-bento-accent/20" id="badge-academic">
            <Sparkles className="w-3.5 h-3.5" />
            <span>岐黄精解 • 医理入微</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-wide font-bold text-bento-accent border-l-4 border-bento-accent pl-3" id="banner-title">
            岐黄智学 · 中医多维临床研修台
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg leading-relaxed font-serif" id="banner-desc">
            全维诊治导航、板书关联笔记，全面整合经五藏六经、仲景医圣经方、十四经脉特定腧穴，承岐黄精粹，启博古通幽之门。
          </p>

          {/* Search Box */}
          <div className="relative" id="search-input-container">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-bento-accent/70 w-5 h-5" />
            <input
              type="text"
              placeholder="🔍 搜索方剂（如：桂枝汤）、中药、穴位、病名病机、症状等..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-bento-bg hover:bg-[#E9E5DE]/70 focus:bg-white text-bento-ink placeholder-stone-400 border border-bento-border rounded-xl py-3.5 pl-12 pr-4 transition-all focus:border-bento-accent outline-none text-xs sm:text-sm shadow-inner"
              id="global-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-bento-accent hover:text-white hover:bg-bento-accent bg-bento-bg text-xs px-2.5 py-1.5 rounded transition-all"
                id="clear-search-btn"
              >
                清除
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Search Results Overlay/Section */}
      {searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E6DEC9] rounded-xl p-6 shadow-md"
          id="search-results-panel"
        >
          <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3 mb-4" id="search-results-hdr">
            <h2 className="font-serif text-lg text-[#2A4335] font-semibold flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              搜索结果 对比 &amp; 链接
            </h2>
            <span className="text-xs text-[#8E8675]" id="search-results-stats">
              有关键字 "{searchQuery}" 的记录
            </span>
          </div>

          {/* Plain-language translation results */}
          {plainResults.length > 0 && (
            <div className="bg-[#F0FDF4] border border-emerald-200 rounded-lg p-4 mb-4">
              <h3 className="text-xs font-bold text-emerald-800 font-serif mb-2">💡 白话翻译结果：</h3>
              {plainResults.map((r, i) => (
                <div key={i} className="text-xs text-emerald-700 font-serif leading-relaxed">
                  <span className="font-bold">"{r.text}"</span> → {r.description}
                </div>
              ))}
            </div>
          )}

          {!hasResults ? (
            <div className="py-8 text-center text-[#9c9380]" id="search-no-results">
              未找到相关词条。请尝试其他中医术语（如：太阳中风、恶寒、发热、往来寒热等）
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="search-results-grid">
              {/* Lessons */}
              {searchResults.lessons.length > 0 && (
                <div className="space-y-2" id="res-lessons-col">
                  <h3 className="text-sm font-semibold text-[#8C3E2B] flex items-center gap-1.5 border-b border-rose-100 pb-1">
                    <BookOpen className="w-4 h-4" /> 课程课时 ({searchResults.lessons.length})
                  </h3>
                  <div className="space-y-1.5" id="res-lessons-list">
                    {searchResults.lessons.map(l => (
                      <div 
                        key={l.id} 
                        onClick={() => onNavigate('classroom', { lessonId: l.id })}
                        className="p-2.5 rounded-lg border border-[#F3EDE2] hover:border-emerald-200 hover:bg-emerald-50/20 cursor-pointer transition-all flex justify-between items-center text-sm"
                        id={`search-res-lesson-${l.id}`}
                      >
                        <div>
                          <div className="font-medium text-[#2A4335]">{l.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{l.summary}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulas */}
              {searchResults.formulas.length > 0 && (
                <div className="space-y-2" id="res-formulas-col">
                  <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5 border-b border-emerald-100 pb-1">
                    <Flame className="w-4 h-4" /> 经典方剂 ({searchResults.formulas.length})
                  </h3>
                  <div className="space-y-1.5" id="res-formulas-list">
                    {searchResults.formulas.map(f => (
                      <div 
                        key={f.id} 
                        onClick={() => onNavigate('formulas', { formulaId: f.id })}
                        className="p-2.5 rounded-lg border border-[#F3EDE2] hover:border-emerald-200 hover:bg-emerald-50/20 cursor-pointer transition-all flex justify-between items-center text-sm"
                        id={`search-res-formula-${f.id}`}
                      >
                        <div>
                          <div className="font-medium text-emerald-800">{f.name} <span className="text-xs text-[#8E8675]">({f.source})</span></div>
                          <div className="text-xs text-gray-500 line-clamp-1">组方: {f.composition.map(c => `${c.herb}(${c.dose})`).join(', ')}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Herbs */}
              {searchResults.herbs.length > 0 && (
                <div className="space-y-2" id="res-herbs-col">
                  <h3 className="text-sm font-semibold text-amber-700 flex items-center gap-1.5 border-b border-amber-100 pb-1">
                    <Sparkles className="w-4 h-4" /> 药性本草 ({searchResults.herbs.length})
                  </h3>
                  <div className="space-y-1.5" id="res-herbs-list">
                    {searchResults.herbs.map(h => (
                      <div 
                        key={h.id} 
                        onClick={() => onNavigate('herbs', { herbName: h.name })}
                        className="p-2.5 rounded-lg border border-[#F3EDE2] hover:border-amber-200 hover:bg-amber-50/20 cursor-pointer transition-all flex justify-between items-center text-sm"
                        id={`search-res-herb-${h.id}`}
                      >
                        <div>
                          <div className="font-medium text-amber-900">{h.name} <span className="text-xs bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 border border-amber-100">{h.nature} | {h.taste.join('')}</span></div>
                          <div className="text-xs text-gray-500 line-clamp-1">功效: {h.efficacy}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acupoints */}
              {searchResults.acupoints.length > 0 && (
                <div className="space-y-2" id="res-acupoints-col">
                  <h3 className="text-sm font-semibold text-indigo-700 flex items-center gap-1.5 border-b border-indigo-100 pb-1">
                    <Award className="w-4 h-4" /> 经络腧穴 ({searchResults.acupoints.length})
                  </h3>
                  <div className="space-y-1.5" id="res-acupoints-list">
                    {searchResults.acupoints.map(ap => (
                      <div 
                        key={ap.id} 
                        onClick={() => onNavigate('meridians', { pointId: ap.id })}
                        className="p-2.5 rounded-lg border border-[#F3EDE2] hover:border-[#D1D9F5] hover:bg-indigo-50/20 cursor-pointer transition-all flex justify-between items-center text-sm"
                        id={`search-res-point-${ap.id}`}
                      >
                        <div>
                          <div className="font-medium text-indigo-800">{ap.name} <span className="font-mono text-xs text-[#8E8675]">({ap.code})</span></div>
                          <div className="text-xs text-gray-500 line-clamp-1">主治: {ap.indications}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        <div className="bg-bento-paper border border-bento-border rounded-xl p-5 flex items-center space-x-4 shadow-xs" id="stat-lessons">
          <div className="p-3 rounded-lg bg-[#FDF5F5] text-bento-accent border border-bento-accent/10">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-0.5 w-full min-w-0">
            <div className="text-xs text-stone-500 font-medium">学习进度</div>
            <div className="text-lg font-serif font-bold text-bento-ink">{completedLessonsCount} / {totalLessons} 课时</div>
            <div className="w-full bg-[#E9E5DE] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-bento-accent h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-bento-paper border border-bento-border rounded-xl p-5 flex items-center space-x-4 shadow-xs" id="stat-notes">
          <div className="p-3 rounded-lg bg-[#FAF7F2] text-stone-700 border border-bento-border/40">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-stone-500 font-medium">随堂笔记</div>
            <div className="text-lg font-serif font-bold text-bento-ink">{progress.savedNotes.length} 篇</div>
            <div className="text-[10px] text-bento-accent font-semibold">随视频画面自动锚定板书</div>
          </div>
        </div>

        <div className="bg-bento-paper border border-bento-border rounded-xl p-5 flex items-center space-x-4 shadow-xs" id="stat-formulas">
          <div className="p-3 rounded-lg bg-[#FDF5F5] text-bento-accent border border-bento-accent/10">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-stone-500 font-medium font-serif">功克方剂</div>
            <div className="text-lg font-serif font-bold text-bento-ink">{progress.vistedFormulas.length} / {realFormulas.length} 种</div>
            <div className="text-[10px] text-stone-600 font-sans">包含组成、药量与病机</div>
          </div>
        </div>

        <div className="bg-bento-paper border border-bento-border rounded-xl p-5 flex items-center space-x-4 shadow-xs" id="stat-acupoints">
          <div className="p-3 rounded-lg bg-[#FAF7F2] text-stone-700 border border-bento-border/40">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-stone-500 font-medium">经络针灸特定穴</div>
            <div className="text-lg font-serif font-bold text-bento-ink">十四经络</div>
            <div className="text-[10px] text-stone-600 font-sans">{classicMeridians.reduce((a, b) => a + b.acupoints.length, 0)} 项核心特定腧穴</div>
          </div>
        </div>
      </div>

      {/* Study Streak Heatmap (30-day) */}
      <div className="bg-bento-paper border border-bento-border rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-sm font-bold text-bento-ink flex items-center gap-2">
            <Calendar className="w-4 h-4 text-bento-accent" />
            学习热力图 · 近30天
          </h3>
          <span className="text-[10px] text-stone-500 font-sans">
            连续学习 {progress.studyStreak?.consecutiveDays || 0} 天
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: 30 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            const dateStr = d.toISOString().slice(0, 10);
            const isToday = i === 29;
            // Check if this date was a study day (simplified: check if it's in the streak)
            const inStreak = progress.studyStreak?.consecutiveDays > 0 &&
              i >= 29 - (progress.studyStreak?.consecutiveDays || 0) + 1;
            return (
              <div
                key={dateStr}
                title={dateStr}
                className={`w-4 h-4 rounded-sm transition-all ${
                  isToday
                    ? 'border-2 border-bento-accent bg-bento-accent/20'
                    : inStreak
                    ? 'bg-bento-accent/80'
                    : 'bg-stone-200'
                }`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-stone-400 font-sans">
          <span>30天前</span>
          <span>今天</span>
        </div>
      </div>

      {/* Curriculum System Timeline (课程体系总览&学习顺序) */}
      <div className="bg-bento-paper border border-bento-border rounded-xl p-6 shadow-xs" id="curriculum-overview">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bento-border pb-4 mb-6" id="curriculum-hdr">
          <div className="space-y-1">
            <h2 className="font-serif text-xl text-bento-ink font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-bento-accent" />
              课程体系总览与推荐学习顺序
            </h2>
            <p className="text-xs text-stone-500">依据伤寒六经辨证的传变规律：由表及里，循序渐进</p>
          </div>
          <div className="flex gap-4 text-xs" id="curriculum-legend">
            <span className="flex items-center gap-1.5 text-stone-600"><span className="w-2.5 h-2.5 rounded-full bg-bento-accent block"></span>已学完</span>
            <span className="flex items-center gap-1.5 text-stone-600"><span className="w-2.5 h-2.5 rounded-full bg-bento-paper border border-bento-accent block animate-pulse"></span>研修中</span>
          </div>
        </div>

        <div className="relative border-l-2 border-dashed border-bento-border pl-6 ml-4 space-y-8" id="curriculum-timeline">
          {tcmChapters.map((chapter, cIdx) => (
            <div key={chapter.id} className="relative group" id={`timeline-chapter-${chapter.id}`}>
              {/* Chapter Node Marker */}
              <div className="absolute -left-[35px] top-0.5 bg-bento-bg border-2 border-bento-accent rounded-full w-5 h-5 flex items-center justify-center p-0.5 z-10">
                <div className="w-2 h-2 rounded-full bg-bento-accent"></div>
              </div>

              <div className="space-y-3" id={`timeline-chapter-body-${chapter.id}`}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5">
                  <h3 className="font-serif text-lg font-bold text-bento-ink flex items-center gap-2">
                    <span className="text-xs bg-[#FDF5F5] px-2 py-0.5 border border-bento-accent/10 rounded text-bento-accent font-sans">板块 {chapter.order}</span>
                    {chapter.title}
                  </h3>
                  <span className="text-xs text-stone-500 font-sans italic">{chapter.description.slice(0, 30)}...</span>
                </div>
                
                <p className="text-xs text-stone-500">{chapter.description}</p>

                {/* Lessons belonging to chapter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2" id={`timeline-chapter-lessons-${chapter.id}`}>
                  {chapter.lessons.map((lesson) => {
                    const isCompleted = progress.completedLessons.includes(lesson.id);
                    return (
                      <div 
                        key={lesson.id} 
                        className={`relative rounded-lg border p-4 transition-all hover:shadow-sm cursor-pointer ${
                          isCompleted 
                            ? 'bg-[#FAF7F2]/50 border-bento-accent/30 hover:border-bento-accent' 
                            : 'bg-bento-paper border-bento-border hover:border-bento-accent'
                        }`}
                        onClick={() => onNavigate('classroom', { lessonId: lesson.id })}
                        id={`timeline-lesson-card-${lesson.id}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[11px] font-sans font-semibold text-bento-accent bg-[#FDF5F5] px-2 py-0.5 rounded-full border border-bento-accent/10">
                            第 {lesson.seq} 讲 • {lesson.duration}
                          </span>
                          
                          {/* Checkbox Complete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLessonComplete(lesson.id);
                            }}
                            className="text-xs flex items-center gap-1 font-sans font-medium text-stone-600 hover:text-bento-accent hover:bg-stone-150 rounded px-1.5 py-0.5 transition"
                            title="标记课时已学完 / 未修完"
                            id={`complete-toggle-btn-${lesson.id}`}
                          >
                            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-bento-accent fill-rose-50' : 'text-stone-300'}`} />
                            <span>{isCompleted ? '已学学' : '打卡学习'}</span>
                          </button>
                        </div>

                        <h4 className="font-serif text-sm font-semibold text-bento-ink group-hover:text-bento-accent transition-colors">
                          {lesson.title}
                        </h4>

                        <p className="text-xs text-gray-600 line-clamp-2 mt-1.5">
                          {lesson.summary}
                        </p>

                        <div className="flex gap-2 mt-3 text-[10px]" id="lesson-capsules">
                          {lesson.blackboards.map(bb => (
                            <span key={bb.id} className="bg-amber-50 text-amber-800 border border-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1 font-sans">
                              板书: {bb.title.slice(0, 7)}... ({bb.timestamp})
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Six Meridian Sequence Mapping Illustration (六经传变顺序图谱) */}
      <div className="bg-bento-paper border border-bento-border rounded-xl p-6 shadow-xs" id="six-meridians-illustrative-flow">
        <h3 className="font-serif text-base text-bento-accent font-bold mb-3 border-b border-bento-border pb-2">六经经典传变路线 (伤寒病势演化图)</h3>
        <p className="text-xs text-stone-500 mb-5 leading-relaxed">
          外邪侵袭人体，最先犯表（太阳），若正气不足或误治，邪气会入里化热（阳明）或郁于半表半里（少阳）；随后会侵入三阴，导致中焦寒化（太阴）、心肾阳衰（少阴），乃至厥热寒温错杂（厥阴）。下面是经典的传变顺序：
        </p>
        
        <div className="overflow-x-auto pb-4" id="illustrative-flow-scroll">
          <div className="flex items-center min-w-[700px] justify-between px-4 font-serif" id="illustrative-flow-container">
            {[
              { code: "太阳病", desc: "太阳经主表，治以辛温发表、调和营卫", herb: "桂枝汤 / 麻黄汤", color: "border-bento-accent text-bento-accent bg-[#FDF5F5]" },
              { code: "阳明病", desc: "里热燥实胃实，治以清宣寒泄、釜底抽薪", herb: "白虎汤 / 承气汤", color: "border-amber-600 text-amber-900 bg-amber-50/40" },
              { code: "少阳病", desc: "半表半里枢机，治以疏利清火、柴胡和解", herb: "小柴胡汤证", color: "border-stone-400 text-stone-800 bg-stone-50" },
              { code: "太阴病", desc: "少阴太阴始因虚，治以温中健脾、回阳燥湿", herb: "理中丸", color: "border-yellow-605 text-yellow-900 bg-yellow-50/40" },
              { code: "少阴病", desc: "心肾两虚阳亡，治以破阴回阳、急温肾阳", herb: "四逆汤 / 真武汤", color: "border-bento-accent/50 text-bento-accent bg-bento-bg/30" },
              { code: "厥阴病", desc: "寒热错杂厥冷，治以温脏安蛔、温通血脉", herb: "乌梅丸 / 当归四逆", color: "border-purple-600 text-purple-900 bg-purple-50/30" }
            ].map((node, index) => (
              <React.Fragment key={node.code}>
                <div 
                  className={`p-3.5 rounded-lg border w-44 text-center cursor-pointer hover:shadow-xs hover:border-bento-accent transition-all ${node.color}`}
                  onClick={() => onNavigate('six-meridians', { stageId: node.code })}
                  id={`flow-node-${index}`}
                >
                  <div className="font-bold text-sm mb-1">{node.code}</div>
                  <div className="text-[10px] text-stone-500 font-sans leading-relaxed line-clamp-1 h-3">{node.desc}</div>
                  <div className="text-[10px] font-sans font-semibold mt-1.5 border-t border-dashed border-stone-300 pt-1 text-stone-700">{node.herb}</div>
                </div>
                {index < 5 && (
                  <div className="flex flex-col items-center flex-1 text-stone-400" id={`flow-arrow-${index}`}>
                    <ArrowRight className="w-5 h-5 text-bento-accent" />
                    <span className="text-[9px] font-sans font-medium text-stone-450 mt-1">传变 / 入里</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
