import { useState } from "react";
import { ArrowRight, Search, Stethoscope } from "lucide-react";
import { symptomRoutes } from "../data/symptomRoutes";
import { translatePlainQuery } from "../utils/searchEngine";

interface Props {
  onNavigateToFormula: (formulaId: string) => void;
}

const QUESTIONS: { symptom: string; question: string; options: { label: string; result: string }[] }[] = [
  {
    symptom: "发热恶寒",
    question: "有汗还是无汗？",
    options: [
      { label: "有汗，恶风，脉缓", result: "太阳中风 → 桂枝汤证" },
      { label: "无汗，体痛，脉紧", result: "太阳伤寒 → 麻黄汤证" },
    ],
  },
  {
    symptom: "往来寒热",
    question: "是否伴有恶心、胸胁苦满？",
    options: [
      { label: "是，口苦咽干目眩", result: "少阳病 → 小柴胡汤证" },
      { label: "否，只有寒热交替无其他", result: "太阳少阳并病 → 桂枝麻黄各半汤" },
    ],
  },
  {
    symptom: "大渴",
    question: "大便是否通畅？",
    options: [
      { label: "大便通畅，但大汗大渴", result: "阳明经热 → 白虎加人参汤" },
      { label: "大便不通，腹拒按", result: "阳明腑实 → 承气汤类" },
    ],
  },
  {
    symptom: "失眠烦躁",
    question: "是否因汗/吐/下后引起？",
    options: [
      { label: "汗吐下后虚烦不眠", result: "栀子豉汤证" },
      { label: "昼日烦躁不得眠", result: "干姜附子汤证（阳虚）" },
      { label: "心中烦不得卧", result: "黄连阿胶汤证（少阴）" },
    ],
  },
  {
    symptom: "手足冷",
    question: "冷到哪个位置？",
    options: [
      { label: "仅手足末端冷", result: "当归四逆汤证" },
      { label: "过肘膝，伴下利脉微", result: "四逆汤辈（高风险，须急诊）" },
    ],
  },
];

export default function SymptomDecisionTree({ onNavigateToFormula }: Props) {
  const [query, setQuery] = useState("");
  const [translated, setTranslated] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleQuery = (q: string) => {
    setQuery(q);
    setSelectedSymptom(null);
    setSelectedAnswer(null);
    const result = translatePlainQuery(q);
    if (result.translated) {
      setTranslated(result.translated);
    } else {
      setTranslated("");
      // Search symptom routes
      const matched = symptomRoutes.find((r) =>
        r.symptom.includes(q) || q.includes(r.symptom)
      );
      if (matched) {
        setTranslated(`症状: ${matched.symptom} → ${matched.watershed} → ${matched.patterns.join("/")}`);
      }
    }
  };

  const activeQuestion = selectedSymptom
    ? QUESTIONS.find((q) => q.symptom === selectedSymptom)
    : null;

  return (
    <div className="bg-bento-paper border border-bento-border rounded-xl p-5 shadow-xs space-y-4">
      <h3 className="font-serif text-sm font-bold text-bento-ink flex items-center gap-2 border-b border-bento-border pb-2">
        <Stethoscope className="w-4 h-4 text-bento-accent" />
        症状分水岭决策树
      </h3>

      <p className="text-xs text-stone-500 font-serif">
        描述你的问题，或选择常见症状逐步辨证。
      </p>

      {/* Query input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="如：怕冷无汗、睡不着心烦、经期感冒..."
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
          className="w-full bg-bento-bg border border-bento-border rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-bento-accent"
        />
      </div>

      {/* Translation result */}
      {translated && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 font-serif">
          {translated}
        </div>
      )}

      {/* Common symptoms quick-select */}
      <div className="space-y-2">
        <div className="text-[10px] text-stone-400 font-sans uppercase tracking-wider">
          常见症状快速辨证：
        </div>
        <div className="flex flex-wrap gap-2">
          {QUESTIONS.map((q) => (
            <button
              key={q.symptom}
              onClick={() => {
                setSelectedSymptom(q.symptom);
                setSelectedAnswer(null);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer font-serif ${
                selectedSymptom === q.symptom
                  ? "bg-bento-accent text-white border-bento-accent"
                  : "bg-bento-bg border-bento-border text-stone-700 hover:border-bento-accent"
              }`}
            >
              {q.symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Step-by-step questions */}
      {activeQuestion && (
        <div className="bg-[#FDF5F5] border border-bento-accent/10 rounded-lg p-4 space-y-3">
          <div className="text-xs font-bold text-bento-accent font-serif">
            🩺 {activeQuestion.question}
          </div>
          <div className="flex flex-col gap-2">
            {activeQuestion.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setSelectedAnswer(opt.result)}
                className={`text-left text-xs p-2.5 rounded-lg border transition cursor-pointer font-serif ${
                  selectedAnswer === opt.result
                    ? "bg-bento-accent text-white border-bento-accent"
                    : "bg-white border-bento-border hover:border-bento-accent text-stone-700"
                }`}
              >
                <ArrowRight className="w-3 h-3 inline mr-1.5 text-bento-accent" />
                {opt.label}
              </button>
            ))}
          </div>
          {selectedAnswer && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="text-xs font-bold text-emerald-800 font-serif">
                ✅ 辨证结论：{selectedAnswer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
