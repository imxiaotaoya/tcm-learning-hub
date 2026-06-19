import { useState } from 'react';
import { StudyNote, Lesson } from '../types';
import { tcmChapters } from '../data/tcmData';
import { FileText, Search, Book, MapPin, Trash2, Calendar, Anchor, Edit3, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotesManagerProps {
  notes: StudyNote[];
  onDeleteNote: (id: string) => void;
  onNavigateToClassroom: (lessonId: string, boardId?: string, anchorLabel?: string) => void;
}

export default function NotesManager({ notes, onDeleteNote, onNavigateToClassroom }: NotesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLessonFilter, setSelectedLessonFilter] = useState('all');

  const allLessons = tcmChapters.flatMap(ch => ch.lessons);

  const handleExportMD = () => {
    const md = filteredNotes
      .map(
        (n) =>
          `## ${n.title}\n\n**课时:** ${n.lessonTitle}  \n**日期:** ${n.timestamp}  \n**板书锚点:** ${n.blackboardAnchor || "无"}\n\n${n.content}\n\n---\n`
      )
      .join("\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tcm-notes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter local notes list
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLesson = selectedLessonFilter === 'all' || n.lessonId === selectedLessonFilter;

    return matchesSearch && matchesLesson;
  });

  return (
    <div className="space-y-6" id="notes-manager-root">
      
      {/* SECTION HEADER */}
      <div className="space-y-1 border-b border-bento-border pb-4" id="notes-hdr">
        <h1 className="font-serif text-xl sm:text-2xl text-bento-ink font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-bento-accent" />
          中医随堂备忘笔记本 &amp; 教学板书高精定位
        </h1>
        <p className="text-xs text-stone-500 font-serif">
          统筹记录您在每堂课所撰写的经典考证笔记。支持点击"视频定音板书锚准点"一键双向跳回对应讲义与黑板板目。
        </p>
        {filteredNotes.length > 0 && (
          <button
            onClick={handleExportMD}
            className="mt-2 bg-bento-paper border border-bento-border hover:border-bento-accent rounded-lg px-3 py-1.5 text-[10px] font-bold text-bento-ink flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-bento-accent" /> 导出 Markdown
          </button>
        )}
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-bento-paper border border-bento-border p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 justify-between shadow-xs" id="notes-filters-row">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80" id="note-search-wrapper">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="搜索笔记核心、纲领、绑定课时..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bento-bg border border-bento-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-bento-accent focus:ring-1 focus:ring-bento-accent transition-all text-bento-ink placeholder-stone-400"
            id="notes-col-search-input"
          />
        </div>

        {/* Lesson filtering select */}
        <div className="flex items-center gap-2 w-full md:w-auto" id="note-filter-dropdown-group">
          <span className="text-xs text-stone-500 font-bold whitespace-nowrap">筛选章次课时:</span>
          <select
            value={selectedLessonFilter}
            onChange={(e) => setSelectedLessonFilter(e.target.value)}
            className="bg-bento-bg text-bento-ink border border-bento-border rounded text-xs p-1.5 focus:outline-none focus:border-bento-accent w-full md:w-64 cursor-pointer"
            id="notes-tbl-lesson-filter"
          >
            <option value="all">显示全部随堂比勘笔记 ({notes.length} 条)</option>
            {allLessons.map(l => (
              <option key={l.id} value={l.id}>第{l.seq}讲: {l.title.slice(0, 18)}...</option>
            ))}
          </select>
        </div>

      </div>

      {/* NOTES DIRECTORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="notes-cards-matrix">
        <AnimatePresence>
          {filteredNotes.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 py-16 text-center text-stone-500 bg-bento-paper border border-dashed rounded-xl border-bento-border shadow-xs" id="notes-empty-slate">
              <Edit3 className="w-12 h-12 text-bento-border mx-auto mb-2.5 animate-pulse" />
              <p className="text-xs font-serif leading-relaxed">
                未检索到符合条件的备忘笔记。推荐在【逐课教室】点击对应的师说板书数字来定位自动创建！
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bento-paper border border-bento-border rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
                id={`note-manager-card-${note.id}`}
              >
                {/* Visual subtle card outline indicating connected anchor */}
                {note.blackboardAnchor && (
                  <div className="absolute right-0 top-0 bg-bento-accent text-white text-[8px] font-bold px-2.5 py-1 rounded-bl uppercase tracking-widest flex items-center gap-0.5 z-10" title="已成功绑定讲录板书坐标">
                    <Anchor className="w-2.5 h-2.5 text-white" />
                    <span>板书绑定</span>
                  </div>
                )}

                <div className="space-y-2.5 flex-1" id="note-card-main">
                  
                  {/* Meta chapter header label */}
                  <div className="flex items-center gap-1.5 text-stone-400 text-[10px] uppercase tracking-wider font-semibold" id="note-meta-row">
                    <Book className="w-3.5 h-3.5 text-bento-accent" />
                    <span className="truncate max-w-[185px] text-stone-500" title={note.lessonTitle}>{note.lessonTitle}</span>
                  </div>

                  {/* Title of written record */}
                  <h3 className="font-serif text-sm sm:text-base font-bold text-bento-ink">{note.title}</h3>
                  
                  {/* Text content of study note */}
                  <p className="text-xs text-stone-700 leading-relaxed font-serif line-clamp-5 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                <div className="border-t border-bento-border pt-4 space-y-3" id="note-card-footer">
                  
                  {/* Notes timestamp line */}
                  <div className="flex items-center justify-between text-[10px] text-stone-500" id="card-date-line">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-bento-accent" />
                      <span>{note.timestamp}</span>
                    </span>

                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-stone-400 hover:text-bento-accent hover:bg-rose-50 transition p-1.5 rounded cursor-pointer"
                      id={`delete-note-manager-btn-${note.id}`}
                      title="删除此研习草稿"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* HIGH VALUE: LOCATE LINK TO THE CLASSROOM BOARD & HIGHLIGHT COORDINATES */}
                  {note.blackboardId && note.blackboardAnchor && (
                    <button
                      type="button"
                      onClick={() => onNavigateToClassroom(note.lessonId, note.blackboardId, note.blackboardAnchor)}
                      className="w-full bg-[#FDF5F5] border border-bento-accent/20 text-bento-accent hover:bg-rose-50/70 transition text-[11px] font-bold py-2 px-3 rounded flex items-center justify-center gap-1 cursor-pointer"
                      id={`locate-note-btn-${note.id}`}
                    >
                      <MapPin className="w-3 h-3 text-bento-accent" />
                      <span>双向联动：点击跳转对应板书位置 [{note.blackboardAnchor}]</span>
                    </button>
                  )}

                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
