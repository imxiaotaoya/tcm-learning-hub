import { useState } from "react";
import { HelpCircle, ArrowRight, Search } from "lucide-react";
import { translatePlainQuery } from "../utils/searchEngine";

/** 20 白话场景，来自 nihaisha beginner-questions.md */
const SCENARIOS = [
  { q: "感冒发烧、怕冷", lead: "出汗吗？身上痛吗？", to: "太阳中风/太阳伤寒" },
  { q: "感冒不出汗、浑身痛", lead: "怕冷重吗？喘吗？", to: "太阳伤寒，麻黄汤方向" },
  { q: "感冒有汗、怕风", lead: "汗多不多？怕风还是怕冷？", to: "太阳中风，桂枝汤方向" },
  { q: "一阵冷一阵热", lead: "恶心吗？胸胁胀吗？口苦吗？", to: "少阳病，小柴胡汤方向" },
  { q: "经期感冒", lead: "正在月经吗？一阵冷一阵热？", to: "热入血室，小柴胡汤方向" },
  { q: "很渴、很热", lead: "大便通吗？肚子拒按吗？", to: "阳明经热/腑实" },
  { q: "好几天不大便", lead: "小便深黄还是清白？放屁吗？", to: "热实便秘/寒实便秘" },
  { q: "拉肚子", lead: "大便臭热还是清稀？肚子痛吗？", to: "热利/寒利" },
  { q: "拉出来像水", lead: "肚子拒按吗？小便深黄吗？", to: "热结旁流风险，谨慎辨别" },
  { q: "肚子胀", lead: "按着舒服还是更痛？大便通吗？", to: "虚胀/实胀" },
  { q: "肚子痛", lead: "喜温喜按还是拒按？", to: "腹诊入口" },
  { q: "睡不着、心烦", lead: "汗吐下后出现？白天还是夜里？", to: "栀子豉汤/黄连阿胶汤" },
  { q: "心慌心悸", lead: "发汗后出现？胸痛吗？", to: "桂枝甘草汤/炙甘草汤" },
  { q: "手脚冰凉", lead: "冷到手指还是肘膝？有下利吗？", to: "当归四逆/四逆汤鉴别" },
  { q: "尿少、尿不出来", lead: "口渴吗？尿血吗？", to: "五苓散/猪苓汤" },
  { q: "咽喉痛", lead: "有没有下利、心烦？", to: "少阴咽痛相关方证" },
  { q: "想查某个方子", lead: "知道方名直接搜，或描述症状", to: "方证对比模块" },
  { q: "找课程板书截图", lead: "关键词是什么？方名/穴位/课次？", to: "板书截图模块" },
  { q: "想了解某课讲什么", lead: "哪个模块？第几讲？", to: "随堂教室模块" },
  { q: "输入自己的症状", lead: "仅做学习参考，不做诊断", to: "下方搜索框输入" },
];

export default function BeginnerEntry() {
  const [query, setQuery] = useState("");
  const [translated, setTranslated] = useState("");

  const handleInput = (q: string) => {
    setQuery(q);
    if (q.trim()) {
      const r = translatePlainQuery(q);
      setTranslated(r.translated || "试试其他描述，如：怕冷无汗、睡不着心烦、经期感冒...");
    } else {
      setTranslated("");
    }
  };

  return (
    <div className="space-y-6" id="beginner-root">
      {/* Header */}
      <div className="space-y-1 border-b border-bento-border pb-4">
        <h1 className="font-serif text-xl sm:text-2xl text-bento-ink font-bold flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-bento-accent" />
          中医小白入门 · 白话辨证入口
        </h1>
        <p className="text-xs text-stone-500 font-serif">
          不懂中医术语？没关系。描述你的困扰，或用白话提问，课程体系会自动帮你找到对应的学习路径。
        </p>
      </div>

      {/* Main search */}
      <div className="bg-bento-paper border border-bento-border rounded-xl p-5 space-y-3">
        <div className="text-xs font-bold text-bento-accent font-serif">💬 用你的话描述问题：</div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="比如：感冒了怕冷没汗浑身疼、这几天睡不着心里烦、手脚一直冰凉..."
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full bg-bento-bg border border-bento-border rounded-lg pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-bento-accent text-bento-ink"
          />
        </div>
        {translated && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 font-serif leading-relaxed">
            💡 {translated}
          </div>
        )}
      </div>

      {/* Scenario grid */}
      <div>
        <div className="text-xs font-bold text-bento-ink font-serif mb-3 border-b border-bento-border pb-2">
          📋 常见生活场景快速入口（点击直达辨证路线）：
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleInput(s.q)}
              className="bg-bento-paper border border-bento-border hover:border-bento-accent rounded-xl p-3.5 text-left transition cursor-pointer group"
            >
              <div className="font-serif text-sm font-bold text-bento-ink group-hover:text-bento-accent transition">
                {s.q}
              </div>
              <div className="text-[11px] text-stone-500 mt-1.5 font-sans leading-relaxed">
                <span className="text-bento-accent font-semibold">先问：</span>
                {s.lead}
              </div>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-700 font-serif font-semibold">
                <ArrowRight className="w-3 h-3" />
                {s.to}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* What to expect */}
      <div className="bg-[#FDF5F5] border border-bento-accent/10 rounded-xl p-4 text-xs text-stone-600 font-serif leading-relaxed space-y-1">
        <div className="font-bold text-bento-accent mb-1">📖 学习提示</div>
        <p>本平台提供的是<strong>倪海厦中医课程的理论学习</strong>，不是在线问诊。</p>
        <p>当你描述症状时，系统会帮你找到课程中对应的辨证思路和方证讲解，但你学到的应是"老师怎么分析这个问题"，而不是"应该吃什么药"。</p>
        <p className="text-stone-400 mt-1">涉及急症、胸痛、意识改变、孕妇儿童等情况，请立即就医。</p>
      </div>
    </div>
  );
}
