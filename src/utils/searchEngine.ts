/**
 * searchEngine — 中医智能搜索引擎
 *
 * 功能：
 * 1. 中文分词（方名正则 + TCM 术语词典）
 * 2. 白话翻译映射（日常用语 → 中医术语）
 * 3. 加权评分排序
 * 4. 自动补全建议
 */

// ── 方名正则（匹配"桂枝汤"/"小柴胡汤加減"等复合名）──────
const FORMULA_PATTERN =
  /(?:小|大|桂枝|麻黄|葛根|柴胡|四逆|承气|白虎|真武|五苓|半夏|甘草|黄连|黄芩|附子|茯苓|当归|吴茱萸|白通|建中|乌梅|苓桂|桃核|抵当|陷胸|栀子|理中|炙甘草|厚朴|猪苓|茵陈|旋覆|代赭|泻心|调胃|麻子仁|蜜煎|白头翁|桃花|桔梗|苦酒|半夏散|猪肤)[一-鿿]{0,8}?(?:汤|散|丸|饮|膏|丹|方)/g;

// ── TCM 领域词典（直接从 nihaisha 索引提取）───────────
const DOMAIN_TERMS = new Set([
  // 六经
  "太阳中风", "太阳伤寒", "热结旁流", "阳中有阴", "阴中有阳",
  "太阳", "阳明", "少阳", "太阴", "少阴", "厥阴",
  // 症状
  "小便自利", "小便不利", "心下悸", "胁下痞", "胸胁苦满",
  "手足温", "手足厥冷", "下利", "黄疸", "胸痹", "水气", "痰饮",
  "虚劳", "腹痛", "恶寒", "发热", "无汗", "有汗", "往来寒热",
  // 穴位
  "足三里", "三阴交", "关元", "照海", "任脉", "督脉",
  // 天纪
  "命宫", "四化", "阳宅", "风水", "八卦",
  // 配伍
  "性味归经", "君臣佐使", "加减",
  // 脉诊
  "脉浮", "脉沉", "脉缓", "脉紧", "脉微细", "脉结代",
]);

// ── 白话翻译映射（日常表达 → 六经/方证定位）───────────
const PLAIN_LANGUAGE_MAP: { keywords: string[]; result: string }[] = [
  { keywords: ["怕冷", "恶寒", "发冷", "寒战"], result: "恶寒 → 太阳病表证，需问有汗/无汗区分中风/伤寒" },
  { keywords: ["感冒", "伤风", "着凉"], result: "外感 → 太阳病，看有汗(桂枝汤)/无汗(麻黄汤)" },
  { keywords: ["出汗", "自汗", "盗汗", "汗多"], result: "汗出 → 太阳中风(桂枝汤证) 或 阳虚自汗(桂枝加附子汤)" },
  { keywords: ["没汗", "不出汗", "无汗"], result: "无汗 → 太阳伤寒(麻黄汤证)，需看尺脉是否充足" },
  { keywords: ["脖子硬", "项背强", "落枕", "颈椎"], result: "项背强几几 → 葛根汤证" },
  { keywords: ["拉肚子", "腹泻", "下痢", "便溏"], result: "下利 → 需看寒热(热利用葛根芩连汤，寒利用桂枝人参汤)" },
  { keywords: ["便秘", "大便干", "不拉", "不通"], result: "便秘 → 阳明腑实(承气汤类) 或 脾约(麻子仁丸) 或 寒实便秘" },
  { keywords: ["睡不着", "失眠", "烦躁", "不眠"], result: "失眠 → 栀子豉汤(虚烦) 或 黄连阿胶汤(少阴) 或 干姜附子汤(阳虚)" },
  { keywords: ["手脚冷", "手足冷", "肢冷", "怕冷手脚"], result: "手足冷 → 当归四逆汤(肢端) 或 四逆汤(过肘膝，高风险)" },
  { keywords: ["腹胀", "肚子胀", "腹满", "胀气"], result: "腹胀 → 虚胀(厚朴生姜半夏甘草人参汤) / 实胀(承气汤)" },
  { keywords: ["经期", "月经", "例假", "生理期"], result: "经期外感 → 热入血室，小柴胡汤证，不可发汗" },
  { keywords: ["口渴", "大渴", "口渴厉害", "喝水不解渴"], result: "大渴 → 阳明经热(白虎加人参汤) 或 水液代谢问题(五苓散)" },
  { keywords: ["胸痛", "胸闷", "心慌", "心悸"], result: "胸满/心悸 → 桂枝去芍药汤(胸满) 或 桂枝甘草汤(心悸) 或 炙甘草汤(脉结代)" },
  { keywords: ["小便", "尿频", "尿痛", "尿血"], result: "小便不利 → 五苓散(气化) 或 猪苓汤(阴虚血尿) 或 少阴水气(真武汤)" },
  { keywords: ["水肿", "浮肿", "水气", "肿胀"], result: "水气 → 真武汤(下焦) / 苓桂术甘汤(中焦) / 五苓散(气化)" },
  { keywords: ["痛", "疼痛", "酸痛", "身痛"], result: "痛来自压力(倪师)。太阳伤寒体痛(麻黄汤) / 汗后身痛(新加汤)" },
  { keywords: ["口苦", "恶心", "呕吐", "不想吃"], result: "口苦咽干目眩+默默不欲饮食 → 少阳病小柴胡汤证" },
  { keywords: ["高血压", "血压高"], result: "课程中涉及桂枝汤类/真武汤类辨证，具体须面诊。仅供参考学习" },
  { keywords: ["糖尿病", "血糖高", "消渴"], result: "消渴 → 厥阴病(乌梅丸证) 或 阳明燥热(白虎加人参汤)" },
];

export interface SearchResult {
  type: "formula" | "symptom" | "plain";
  text: string;
  description: string;
  id?: string;
}

// ── 分词 ──────────────────────────────────────────────────

const QUERY_SPLIT_RE = /[\s,，、；;：:|\/\\+]+/;
const QUERY_FILLER_RE =
  /(?:给我|帮我|请|把|找出来|找出|找|查一下|查询|搜索|检索|相关|有关|里面|其中|课程|板书|截图|证据|图片|图|讲到|讲|有没有|是否|一下|这个|那个)/g;

export function tokenize(query: string): string[] {
  let q = query.trim();
  // 先提取方名
  const formulas = q.match(FORMULA_PATTERN) || [];
  for (const f of formulas) {
    q = q.replace(f, " ");
  }
  // 去除冗余词
  q = QUERY_FILLER_RE[Symbol.replace](q, " ");
  // 按分隔符拆分
  const parts = q.split(QUERY_SPLIT_RE).map((s) => s.trim()).filter(Boolean);

  // 检查各部分是否命中领域词典
  const tokens: string[] = [...formulas];
  for (const p of parts) {
    if (DOMAIN_TERMS.has(p)) {
      tokens.push(p);
    } else {
      tokens.push(p);
    }
  }
  return [...new Set(tokens)].filter(Boolean);
}

// ── 白话翻译 ──────────────────────────────────────────────

export function translatePlainQuery(
  query: string
): { translated: string; results: SearchResult[] } {
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const entry of PLAIN_LANGUAGE_MAP) {
    for (const kw of entry.keywords) {
      if (q.includes(kw)) {
        results.push({
          type: "plain",
          text: kw,
          description: entry.result,
        });
        break;
      }
    }
  }

  if (results.length > 0) {
    return {
      translated: results.map((r) => r.description).join(" | "),
      results,
    };
  }
  return { translated: "", results: [] };
}

// ── 加权评分 ──────────────────────────────────────────────

export interface Scorable {
  tokens: string[]; // text fields to search in
  [key: string]: any;
}

export function scoreResults<T extends Scorable>(
  items: T[],
  queryTerms: string[],
  weights: { [field: string]: number } = { tokens: 10 }
): { item: T; score: number }[] {
  const ranked: { item: T; score: number }[] = [];

  for (const item of items) {
    let score = 0;
    let matchedTerms = 0;

    for (const term of queryTerms) {
      if (!term) continue;
      let termScore = 0;

      for (const [field, weight] of Object.entries(weights)) {
        const haystack = Array.isArray(item[field])
          ? (item[field] as string[]).join(" ")
          : String(item[field] || "");
        if (haystack.includes(term)) {
          termScore += weight;
        }
      }

      if (termScore > 0) {
        matchedTerms++;
        score += termScore;
      }
    }

    if (matchedTerms > 0) {
      if (matchedTerms > 1) score += matchedTerms * 3;
      if (matchedTerms === queryTerms.length) score += 20;
      ranked.push({ item, score });
    }
  }

  ranked.sort((a, b) => b.score - a.score);
  return ranked;
}

// ── 自动补全 ──────────────────────────────────────────────

/** 从数据集中提取补全候选项 */
export function buildSuggestions(data: {
  formulas?: string[];
  acupoints?: string[];
  herbs?: string[];
  symptoms?: string[];
}): string[] {
  const all: string[] = [];
  if (data.formulas) all.push(...data.formulas);
  if (data.acupoints) all.push(...data.acupoints);
  if (data.herbs) all.push(...data.herbs);
  if (data.symptoms) all.push(...data.symptoms);
  return [...new Set(all)].sort();
}

export function suggest(query: string, candidates: string[], limit = 6): string[] {
  if (!query.trim()) return candidates.slice(0, limit);
  const q = query.toLowerCase();
  return candidates
    .filter((c) => c.toLowerCase().includes(q))
    .slice(0, limit);
}
