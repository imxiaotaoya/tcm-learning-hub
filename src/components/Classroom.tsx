import React, { useState, useEffect } from "react";
import { Lesson, StudyNote } from "../types";
import { lessons as allRealLessons } from "../data/lessons";
import { screenshots } from "../data/screenshots";
import {
  BookOpen, Plus, Check, ArrowRight, ArrowLeft, HelpCircle, Clock, Image,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClassroomProps {
  currentLessonId: string;
  notes: StudyNote[];
  onAddNote: (note: Omit<StudyNote, "id" | "timestamp">) => void;
  onDeleteNote: (id: string) => void;
  onToggleLessonComplete: (id: string) => void;
  completedLessons: string[];
  initialActiveItem?: { lessonId?: string; boardId?: string };
}

export default function Classroom({
  currentLessonId, notes, onAddNote, onDeleteNote,
  onToggleLessonComplete, completedLessons, initialActiveItem,
}: ClassroomProps) {
  const allLessons = allRealLessons;
  const [activeLessonId, setActiveLessonId] = useState(
    currentLessonId || (allLessons[0]?.id || "")
  );
  useEffect(() => {
    if (initialActiveItem?.lessonId) setActiveLessonId(initialActiveItem.lessonId);
  }, [initialActiveItem]);

  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  if (!activeLesson) return <div className="py-12 text-center text-stone-400">课程数据加载中...</div>;

  const isCompleted = completedLessons.includes(activeLesson.id);
  const lessonScreenshots = screenshots.filter(
    (s) => s.lesson === activeLesson.title.split(" —")[0]?.trim()
  );
  const lessonNotes = notes.filter((n) => n.lessonId === activeLesson.id);
  const prevLesson = allLessons.find((l) => l.seq === activeLesson.seq - 1);
  const nextLesson = allLessons.find((l) => l.seq === activeLesson.seq + 1);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    onAddNote({
      lessonId: activeLesson.id, lessonTitle: activeLesson.title,
      title: noteTitle.trim() || `${activeLesson.title.split(" —")[0]} 笔记`,
      content: noteContent.trim(),
    });
    setNoteTitle(""); setNoteContent("");
  };

  const switchLesson = (id: string) => { setActiveLessonId(id); setNoteTitle(""); setNoteContent(""); };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* LEFT: Content (7 cols) */}
      <div className="xl:col-span-7 space-y-6">
        {/* Nav */}
        <div className="bg-bento-paper border border-bento-border rounded-xl p-4 flex items-center justify-between shadow-xs">
          <button disabled={!prevLesson} onClick={() => prevLesson && switchLesson(prevLesson.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${!prevLesson && "opacity-40 cursor-not-allowed"}`}>
            <ArrowLeft className="w-4 h-4 text-bento-accent" /><span className="hidden sm:inline">上一讲</span>
          </button>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest font-sans font-bold text-bento-accent">
              {activeLesson.chapterTitle || "伤寒论"} · 第 {activeLesson.seq} 讲
            </div>
            <h2 className="font-serif text-xs sm:text-sm font-bold text-bento-ink mt-0.5 max-w-[320px] line-clamp-1">
              {activeLesson.title}
            </h2>
          </div>
          <button disabled={!nextLesson} onClick={() => nextLesson && switchLesson(nextLesson.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${!nextLesson && "opacity-40 cursor-not-allowed"}`}>
            <span className="hidden sm:inline">下一讲</span><ArrowRight className="w-4 h-4 text-bento-accent" />
          </button>
        </div>

        {/* Lesson Content Panel */}
        <div className="bg-bento-paper border border-bento-border rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-stone-500 font-sans border-b border-bento-border pb-3">
            <span className="flex items-center gap-1 bg-bento-bg px-2 py-1 rounded border">
              <Clock className="w-3 h-3" /> {activeLesson.duration}
            </span>
            {lessonScreenshots.length > 0 && (
              <span className="flex items-center gap-1 bg-bento-bg px-2 py-1 rounded border">
                <Image className="w-3 h-3" /> {lessonScreenshots.length} 张板书截图
              </span>
            )}
            <button onClick={() => onToggleLessonComplete(activeLesson.id)}
              className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold cursor-pointer ${isCompleted ? "bg-[#FDF5F5] text-bento-accent border-bento-accent/25" : "bg-white text-stone-600 border-bento-border hover:bg-stone-50"}`}>
              {isCompleted ? <Check className="w-3 h-3" /> : null}{isCompleted ? "已学完" : "标记学完"}
            </button>
          </div>
          <div>
            <h3 className="font-serif font-bold text-bento-accent text-sm mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> 本节课程内容
            </h3>
            <div className="text-xs text-stone-700 leading-relaxed font-serif whitespace-pre-line max-h-[400px] overflow-y-auto pr-2">
              {activeLesson.content || activeLesson.summary}
            </div>
          </div>
          {activeLesson.keywords && (
            <div className="bg-[#FDF5F5] border border-bento-accent/10 rounded-lg p-4">
              <h4 className="font-serif text-xs font-bold text-bento-accent flex items-center gap-1.5 mb-2">
                <HelpCircle className="w-3.5 h-3.5" /> 本课复习关键词
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed font-serif">{activeLesson.keywords}</p>
            </div>
          )}
          {lessonScreenshots.length > 0 && (
            <div>
              <h4 className="font-serif text-xs font-bold text-bento-ink mb-2 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-bento-accent" /> 本课板书 ({lessonScreenshots.length} 张)
              </h4>
              <div className="flex gap-1.5 overflow-x-auto pb-2">
                {lessonScreenshots.slice(0, 12).map((ss) => (
                  <div key={ss.id} className="flex-shrink-0 bg-bento-bg border border-bento-border rounded-lg p-2 text-[9px] w-32" title={ss.description}>
                    <div className="font-mono text-stone-500">{ss.timestamp}</div>
                    <div className="text-stone-700 font-serif line-clamp-2 mt-0.5">{ss.description.slice(0, 40)}...</div>
                    <div className="flex gap-1 mt-1 flex-wrap">{ss.categories.slice(0, 2).map((c) => (<span key={c} className="bg-[#FDF5F5] text-bento-accent text-[8px] px-1 py-0.5 rounded">{c}</span>))}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick switch */}
        <div className="bg-bento-paper border border-bento-border rounded-xl p-4 shadow-xs">
          <h4 className="text-xs font-bold text-bento-accent border-b border-bento-border pb-2 mb-3 font-serif">全部课次快速跳转</h4>
          <div className="space-y-1 overflow-y-auto max-h-[160px] pr-1">
            {allLessons.map((l) => (
              <button key={l.id} onClick={() => switchLesson(l.id)}
                className={`w-full text-left text-xs px-2.5 py-2 rounded-lg cursor-pointer flex justify-between items-center transition ${l.id === activeLessonId ? "bg-[#FDF5F5] text-bento-accent font-semibold border border-bento-accent/25" : "hover:bg-bento-bg text-stone-600 border border-transparent"}`}>
                <span className="line-clamp-1">{l.title.split(" —")[0]} — {l.title.split(" —")[1]?.split(" ")[0] || ""}</span>
                <span className="text-[10px] text-stone-400 flex-shrink-0 ml-1 italic font-mono">{l.duration.replace(" 分钟","m")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Notes (5 cols) */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-bento-paper border border-bento-border rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="font-serif font-bold text-bento-ink text-sm flex items-center gap-2 border-b border-bento-border pb-2">
            <Plus className="w-5 h-5 text-bento-accent" /> 本课学习笔记
          </h3>
          <form onSubmit={handleCreateNote} className="space-y-3">
            <input type="text" placeholder="笔记标题（可选）" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full bg-bento-bg border border-bento-border rounded-lg px-3 py-2 text-xs text-bento-ink placeholder-stone-400 focus:outline-none focus:border-bento-accent" />
            <textarea placeholder="记下你的学习心得..." rows={4} value={noteContent} onChange={(e) => setNoteContent(e.target.value)}
              className="w-full bg-bento-bg border border-bento-border rounded-lg px-3 py-2 text-xs text-bento-ink placeholder-stone-400 focus:outline-none focus:border-bento-accent" required />
            <button type="submit" className="w-full bg-bento-accent hover:opacity-95 text-white rounded-lg py-2 text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
              <Plus className="w-4 h-4" /> 保存笔记
            </button>
          </form>
        </div>
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-bento-accent text-xs uppercase tracking-wider">本课笔记 ({lessonNotes.length})</h4>
          {lessonNotes.length === 0 ? (
            <div className="bg-bento-paper border border-dashed border-bento-border rounded-xl py-8 text-center text-stone-500 text-xs font-serif">还没有笔记</div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {lessonNotes.map((note) => (
                  <motion.div key={note.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="bg-bento-paper border border-bento-border rounded-xl p-4 shadow-xs space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div><h5 className="font-serif text-sm font-bold text-bento-ink">{note.title}</h5>
                        <p className="text-[10px] text-stone-500 font-sans mt-0.5">{note.timestamp}</p></div>
                      <button onClick={() => onDeleteNote(note.id)} className="text-[10px] text-stone-600 hover:text-bento-accent px-2 py-1 rounded transition cursor-pointer">删除</button>
                    </div>
                    <p className="text-xs text-stone-700 whitespace-pre-wrap font-serif leading-relaxed">{note.content}</p>
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
