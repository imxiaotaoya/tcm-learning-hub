import { useState, useEffect } from 'react';
import { Progress, StudyNote, Lesson } from './types';
import Sidebar from './components/Sidebar';
import StatsDashboard from './components/StatsDashboard';
import Classroom from './components/Classroom';
import FormulaDetail from './components/FormulaDetail';
import SixMeridians from './components/SixMeridians';
import MeridiansCanvas from './components/MeridiansCanvas';
import HerbComparison from './components/HerbComparison';
import NotesManager from './components/NotesManager';
import ScreenshotBrowser from './components/ScreenshotBrowser';
import { Menu, BookOpen, Clock, Heart, Award, HelpCircle } from 'lucide-react';

const initialMockNotes: StudyNote[] = [
  {
    id: "note-1",
    lessonId: "l-1-1",
    lessonTitle: "第一课：辨太阳病脉证并治纲领与六经概念",
    blackboardId: "bb-guizhitang-1",
    blackboardAnchor: "桂枝 + 白芍",
    timestamp: "2026-06-18 20:30",
    title: "黄煌教授脉证等量规律反思",
    content: "伤寒太阳中风，发热汗自流出，脉浮缓。老师黑板指出此乃营卫失调。调和营卫的核心，在于等量的桂枝配白芍（伤寒论原文三两对三两）。桂枝走表补卫阳以透祛邪，白芍收表敛营阴以恋汗。一开一合，一散一收，使营阴能守而卫阳能旺，真是精妙之极！"
  },
  {
    id: "note-2",
    lessonId: "l-1-2",
    lessonTitle: "第二课：太阳中风证详解与桂枝汤方配伍奥秘",
    blackboardId: "bb-guizhitang-2",
    blackboardAnchor: "加葛根",
    timestamp: "2026-06-18 22:15",
    title: "项背强几几加葛根配伍要旨",
    content: "‘太阳病，项背强几几，反汗出恶风者，桂枝加葛根汤主之。’\n老师在加减变化板书中重点圈出葛根。项背部肌肉强急拘挛，是因为太阳经气不通，而津液不能润泽局部筋骨。葛根温通起阴津、生皮毛津液。配伍辛温桂枝可舒畅督脉、缓解拘急，临证时可用来治颈椎病、落枕等，效果确实神妙。"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Learning Progress core state (from localStorage or default)
  const loadProgress = (): Progress => {
    try {
      const stored = localStorage.getItem("tcm-learning-hub-progress");
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      completedLessons: ["l-1-1"],
      savedNotes: initialMockNotes,
      vistedFormulas: ["f-guizhitang"],
      currentLessonId: "l-1-1",
      studyStreak: { lastStudyDate: new Date().toISOString().slice(0, 10), consecutiveDays: 1 },
    };
  };

  const [progress, setProgress] = useState<Progress>(loadProgress);

  // Persist progress to localStorage on every change
  useEffect(() => {
    localStorage.setItem("tcm-learning-hub-progress", JSON.stringify(progress));
  }, [progress]);

  // Hotspot anchor router helpers
  const [classroomInitItem, setClassroomInitItem] = useState<{ lessonId?: string; boardId?: string } | undefined>(undefined);
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('');
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [selectedPointId, setSelectedPointId] = useState<string>('');
  const [selectedHerbSearch, setSelectedHerbSearch] = useState<string>('');

  useEffect(() => {
    // Elegant system clock
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  // Set page headers dynamically
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return '黄帝内经 &amp; 伤寒杂病论 · 体系概览';
      case 'classroom': return '逐课研析教案研究室';
      case 'formulas': return '仲景经方研审比勘台';
      case 'six-meridians': return '伤寒六经气化辨证路线';
      case 'meridians': return '特定腧穴十四经脉经纬模型';
      case 'herbs': return '本草配伍原理沙箱';
      case 'screenshots': return '课堂板书截图证据索引';
      case 'notes': return '学者随课备忘笔记本';
      default: return '中医方证互动传习录';
    }
  };

  // State mutative handlers
  const handleToggleLessonComplete = (lessonId: string) => {
    setProgress(prev => {
      const isCompleted = prev.completedLessons.includes(lessonId);
      const newCompleted = isCompleted
        ? prev.completedLessons.filter(id => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      return { ...prev, completedLessons: newCompleted };
    });
  };

  const handleAddNote = (newNoteData: Omit<StudyNote, 'id' | 'timestamp'>) => {
    const formattedDate = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newNote: StudyNote = {
      ...newNoteData,
      id: `note-${Date.now()}`,
      timestamp: formattedDate
    };

    setProgress(prev => ({
      ...prev,
      savedNotes: [newNote, ...prev.savedNotes]
    }));
  };

  const handleDeleteNote = (noteId: string) => {
    setProgress(prev => ({
      ...prev,
      savedNotes: prev.savedNotes.filter(n => n.id !== noteId)
    }));
  };

  // Central Router Dispatcher
  const handleNavigate = (tab: string, itemData?: any) => {
    setActiveTab(tab);
    
    if (tab === 'classroom') {
      if (itemData?.lessonId || itemData?.boardId) {
        setClassroomInitItem({
          lessonId: itemData.lessonId,
          boardId: itemData.boardId
        });
      } else {
        setClassroomInitItem(undefined);
      }
    } else if (tab === 'formulas') {
      if (itemData?.formulaId) {
        setSelectedFormulaId(itemData.formulaId);
        // Record formula visited to show in statistics count
        setProgress(prev => {
          if (!prev.vistedFormulas.includes(itemData.formulaId)) {
            return { ...prev, vistedFormulas: [...prev.vistedFormulas, itemData.formulaId] };
          }
          return prev;
        });
      }
    } else if (tab === 'six-meridians') {
      if (itemData?.stageId) {
        setSelectedStageId(itemData.stageId);
      }
    } else if (tab === 'meridians') {
      if (itemData?.pointId) {
        setSelectedPointId(itemData.pointId);
      }
    } else if (tab === 'herbs') {
      if (itemData?.herbName) {
        setSelectedHerbSearch(itemData.herbName);
      } else {
        setSelectedHerbSearch('');
      }
    }
  };

  return (
    <div className="flex h-screen bg-bento-bg text-bento-ink font-sans overflow-hidden" id="app-root-frame">
      
      {/* LEFT NAVIGATION COLUMN */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => handleNavigate(tab)} 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* RIGHT SIDE MASTER AREA (With Header and Scrollable Sub-view) */}
      <div className="flex-1 flex flex-col min-w-0" id="main-content-canvas">
        
        {/* Top Header Panel */}
        <header className="bg-bento-paper border-b border-bento-border px-6 py-4 flex items-center justify-between flex-shrink-0 z-15 shadow-xs" id="master-header">
          <div className="space-y-0.5" id="header-left">
            <span className="text-[9px] font-semibold text-bento-accent uppercase tracking-widest block font-sans">
              中医方剂与针灸经脉交互辨证工具
            </span>
            <h1 className="text-sm font-serif font-bold text-bento-ink tracking-wide" id="global-header-title">
              {getHeaderTitle()}
            </h1>
          </div>

          <div className="flex items-center space-x-4 text-xs font-medium text-stone-600" id="header-right">
            {/* Quick status bar */}
            <span className="hidden sm:flex items-center gap-1.5" id="academic-tag">
              <span className="w-2.5 h-2.5 rounded-full bg-bento-accent block animate-pulse"></span>
              <span className="font-serif text-bento-accent font-semibold">岐黄心领神悟中</span>
            </span>

            <span className="bg-bento-bg border border-bento-border px-3 py-1.5 rounded-lg flex items-center gap-1 font-mono text-[11px]" id="clock-display">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>北京 ── {currentTime}</span>
            </span>
          </div>
        </header>

        {/* SCROLLABLE ROUTED COMPONENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6" id="master-viewport-scroll">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <StatsDashboard 
              progress={progress} 
              onNavigate={handleNavigate}
              onToggleLessonComplete={handleToggleLessonComplete}
            />
          )}

          {/* Classroom / Study Room Tab */}
          {activeTab === 'classroom' && (
            <Classroom 
              currentLessonId={progress.currentLessonId || 'l-1-1'}
              notes={progress.savedNotes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onToggleLessonComplete={handleToggleLessonComplete}
              completedLessons={progress.completedLessons}
              initialActiveItem={classroomInitItem}
            />
          )}

          {/* Classical Formulas Tab */}
          {activeTab === 'formulas' && (
            <FormulaDetail 
              initialFormulaId={selectedFormulaId}
              onNavigateToClassroom={(lId, bbId) => handleNavigate('classroom', { lessonId: lId, boardId: bbId })}
            />
          )}

          {/* Six Meridians Tab */}
          {activeTab === 'six-meridians' && (
            <SixMeridians 
              initialStageId={selectedStageId}
              onNavigateToFormula={(fId) => handleNavigate('formulas', { formulaId: fId })}
            />
          )}

          {/* Meridians &amp; Acupoints Tab */}
          {activeTab === 'meridians' && (
            <MeridiansCanvas 
              initialPointId={selectedPointId}
              onAddNoteFromPoint={(title, content) => handleAddNote({ title, content, lessonId: 'l-1-1', lessonTitle: '经络自助特定腧穴考究记' })}
            />
          )}

          {/* Herbs Tastes Tab */}
          {activeTab === 'herbs' && (
            <HerbComparison 
              initialSearchName={selectedHerbSearch}
              onNavigateToFormulas={(fId) => handleNavigate('formulas', { formulaId: fId })}
            />
          )}

          {/* Screenshot Browser Tab */}
          {activeTab === 'screenshots' && <ScreenshotBrowser />}

          {/* Scholar Notes Organizer Tab */}
          {activeTab === 'notes' && (
            <NotesManager 
              notes={progress.savedNotes}
              onDeleteNote={handleDeleteNote}
              onNavigateToClassroom={(lId, bbId, anchor) => {
                // Direct route mapping back to class room with active variables
                handleNavigate('classroom', { lessonId: lId, boardId: bbId });
                // Simulate an instant event queue that forces centering
                setClassroomInitItem({ lessonId: lId, boardId: bbId });
              }}
            />
          )}

        </main>

      </div>
    </div>
  );
}
