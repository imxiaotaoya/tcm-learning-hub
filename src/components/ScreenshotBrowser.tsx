import { useState, useMemo } from "react";
import { screenshots } from "../data/screenshots";
import { Search, Image, Tag, X, Eye, Clock } from "lucide-react";

const MODULES: { key: string; label: string }[] = [
  { key: "shanghanlun", label: "伤寒论" },
  { key: "jingui", label: "金匮要略" },
  { key: "acupuncture", label: "针灸" },
  { key: "tianji", label: "天纪" },
  { key: "huangdi", label: "黄帝内经" },
  { key: "bencao", label: "神农本草" },
  { key: "clinical-cases", label: "临床案例" },
  { key: "zhongjing-xinfa", label: "仲景心法" },
  { key: "bagang", label: "八纲辨证" },
  { key: "fuyang", label: "扶阳论坛" },
  { key: "yijinjing", label: "易筋经" },
];

const ALL_CATEGORIES = [
  "方剂方证", "六经条文", "病机图解", "脉诊望诊", "腹诊排泄",
  "禁忌风险", "综合板书", "妇科血证", "针灸实操", "穴位图",
  "药性图", "五行图", "PPT课件",
];

export default function ScreenshotBrowser() {
  const [moduleIdx, setModuleIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(24);

  const activeModule = MODULES[moduleIdx].key;

  const filtered = useMemo(() => {
    let ss = screenshots.filter((s) => s.module === activeModule);
    if (search.trim()) {
      const q = search.toLowerCase();
      ss = ss.filter(
        (s) =>
          s.description.toLowerCase().includes(q) ||
          s.lesson.toLowerCase().includes(q) ||
          s.categories.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (selectedCats.length > 0) {
      ss = ss.filter((s) =>
        selectedCats.some((c) => s.categories.includes(c))
      );
    }
    return ss;
  }, [activeModule, search, selectedCats]);

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const moduleStats = MODULES.map((m) => ({
    ...m,
    count: screenshots.filter((s) => s.module === m.key).length,
  }));

  return (
    <div className="space-y-6" id="screenshot-browser-root">
      {/* Header */}
      <div className="space-y-1 border-b border-bento-border pb-4">
        <h1 className="font-serif text-xl sm:text-2xl text-bento-ink font-bold flex items-center gap-2">
          <Image className="w-6 h-6 text-bento-accent" />
          课堂板书截图证据索引
        </h1>
        <p className="text-xs text-stone-500 font-serif">
          覆盖 11 个课程模块，共 {screenshots.length.toLocaleString()} 张截图。可搜索方名/穴位/病机/课次，点击查看原始路径。
        </p>
      </div>

      {/* Module Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2" id="module-tabs">
        {moduleStats.map((m, i) => (
          <button
            key={m.key}
            onClick={() => { setModuleIdx(i); setShowCount(24); }}
            className={`flex-shrink-0 text-[10px] sm:text-xs px-3 py-2 rounded-lg border transition cursor-pointer font-semibold ${
              i === moduleIdx
                ? "bg-bento-accent text-white border-bento-accent"
                : "bg-bento-paper border-bento-border text-stone-600 hover:border-bento-accent"
            }`}
          >
            {m.label} <span className="opacity-60 ml-1">({m.count})</span>
          </button>
        ))}
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3" id="filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="搜索描述、课次、方名、穴位..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bento-paper border border-bento-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-bento-accent"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" id="cat-filter-chips">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCat(cat)}
              className={`text-[10px] px-2 py-1 rounded-lg border transition cursor-pointer font-sans ${
                selectedCats.includes(cat)
                  ? "bg-bento-accent text-white border-bento-accent"
                  : "bg-bento-bg border-bento-border text-stone-500 hover:border-bento-accent"
              }`}
            >
              <Tag className="w-2.5 h-2.5 inline mr-0.5" />
              {cat}
            </button>
          ))}
          {selectedCats.length > 0 && (
            <button
              onClick={() => setSelectedCats([])}
              className="text-[10px] px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
            >
              <X className="w-2.5 h-2.5 inline mr-0.5" /> 清除
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-[10px] text-stone-400 font-sans">
        显示 {Math.min(showCount, filtered.length)} / {filtered.length} 条结果
        {selectedCats.length > 0 && ` · 已筛选: ${selectedCats.join("、")}`}
      </div>

      {/* Screenshot Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="screenshot-grid">
        {filtered.slice(0, showCount).map((ss) => (
          <div
            key={ss.id}
            className="bg-bento-paper border border-bento-border rounded-xl p-3 space-y-2 hover:border-bento-accent transition group cursor-pointer"
            onClick={() => setLightbox(ss.path || ss.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500">
                <Clock className="w-3 h-3" />
                {ss.timestamp}
              </div>
              <span className="text-[10px] bg-bento-bg px-1.5 py-0.5 rounded font-sans text-stone-500">
                {ss.lesson}
              </span>
            </div>
            <p className="text-[11px] text-stone-700 leading-relaxed font-serif line-clamp-2">
              {ss.description}
            </p>
            <div className="flex gap-1 flex-wrap">
              {ss.categories.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="text-[9px] bg-[#FDF5F5] text-bento-accent border border-bento-accent/10 rounded px-1.5 py-0.5 font-sans"
                >
                  {c}
                </span>
              ))}
            </div>
            {ss.path && (
              <div className="text-[9px] text-stone-400 font-mono truncate group-hover:text-bento-accent transition">
                {ss.path}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load more */}
      {showCount < filtered.length && (
        <div className="text-center">
          <button
            onClick={() => setShowCount((c) => c + 24)}
            className="bg-bento-paper border border-bento-border hover:border-bento-accent rounded-lg px-6 py-2 text-xs font-serif font-bold text-bento-ink transition cursor-pointer"
          >
            加载更多...
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-stone-800 rounded-full p-2 hover:bg-stone-700 transition"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full text-center space-y-3">
            <Eye className="w-8 h-8 text-bento-accent mx-auto" />
            <p className="text-sm font-serif font-bold text-bento-ink">
              截图证据路径
            </p>
            <p className="text-xs text-stone-600 font-mono break-all bg-stone-100 p-3 rounded-lg">
              {lightbox}
            </p>
            <p className="text-[11px] text-stone-400 font-serif">
              原始截图存储在 nihaisha-nishi-tcm 仓库中。<br />
              完整图片浏览器将在接入图片文件服务后启用。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
