import { BookOpen, Activity, HelpCircle } from "lucide-react";

interface LearningPathSelectorProps {
  onNavigate: (tab: string, itemData?: any) => void;
}

const PATHS = [
  {
    id: "curriculum",
    icon: BookOpen,
    title: "按课程顺序学",
    desc: "从伤寒论第一讲开始，逐课研习。适合初学者体系化入门。",
    action: () => "curriculum-scroll",
    color: "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400",
    iconColor: "text-emerald-700",
  },
  {
    id: "six-meridians",
    icon: Activity,
    title: "按六经体系学",
    desc: "从太阳病到厥阴病，掌握六经辨证传变骨架。",
    action: (onNav: (tab: string) => void) => onNav("six-meridians"),
    color: "border-amber-200 bg-amber-50/40 hover:border-amber-400",
    iconColor: "text-amber-700",
  },
  {
    id: "symptoms",
    icon: HelpCircle,
    title: "按症状问题学",
    desc: "输入症状或白话描述，智能路由到对应方证课次。",
    action: (onNav: (tab: string) => void) => {
      // Focus the search input and let user type symptoms
      const input = document.getElementById("global-search-input");
      if (input) {
        input.focus();
        (input as HTMLInputElement).placeholder =
          "🔍 描述你的问题，如：怕冷无汗、睡不着心烦、经期感冒...";
      }
    },
    color: "border-purple-200 bg-purple-50/40 hover:border-purple-400",
    iconColor: "text-purple-700",
  },
];

export default function LearningPathSelector({
  onNavigate,
}: LearningPathSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {PATHS.map((path) => {
        const Icon = path.icon;
        return (
          <button
            key={path.id}
            onClick={() => path.action(onNavigate)}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer text-left ${path.color}`}
          >
            <div
              className={`p-2 rounded-lg bg-white/70 border border-stone-200 ${path.iconColor}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-serif font-bold text-bento-ink">
                {path.title}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                {path.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
