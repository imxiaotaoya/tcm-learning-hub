/**
 * RISK_RULES — 安全风险触发规则
 * 匹配方名/药名/症状关键词，返回风险等级和提示信息
 */

export type RiskLevel = "low" | "medium" | "high";

export interface RiskAssessment {
  level: RiskLevel;
  message: string;
}

const HIGH_RISK_PATTERNS: { match: RegExp | string; message: string }[] = [
  {
    match: /四逆汤|白通汤|通脉四逆|茯苓四逆|干姜附子/,
    message:
      "⚠️ 本方含附子类回阳救逆药，属危重症救逆理论。仅供课程学习，不可自行尝试。出现胸痛、意识改变、休克样表现应立即急诊。",
  },
  {
    match: /大承气汤|急下存阴/,
    message:
      "⚠️ 大承气汤为峻下热结之剂，适用于痞满燥实具备的阳明腑实重症。攻下中病即止，必须由专业医师判断使用。",
  },
  {
    match: /抵当汤|抵当丸|大陷胸汤|大陷胸丸/,
    message:
      "⚠️ 本方属破血/峻下重剂，药力猛烈。仅作课程理论研习，临床使用须由合格医师严格辨证。",
  },
  {
    match: /癌症|肿瘤|阴实/,
    message:
      "⚠️ 涉及癌症/肿瘤/阴实等重症课程观点，仅为倪师课程理论整理。实际诊疗必须咨询专业肿瘤科医师。",
  },
  {
    match: /妊娠|孕妇|胎元|安胎/,
    message:
      "⚠️ 涉及妊娠期用药，风险极高。孕妇禁用攻下、破血、峻烈之品。必须由妇产科专业医师处理。",
  },
  {
    match: /小儿|儿童|幼科/,
    message: "⚠️ 涉及儿科内容。儿童用药剂量和方剂选择与成人不同，须由儿科医师指导。",
  },
];

const MED_RISK_PATTERNS: { match: RegExp | string; message: string }[] = [
  {
    match: /麻黄/,
    message:
      "⚠️ 含麻黄，发汗力强。表虚自汗、体虚多汗者忌用。高血压、心脏病患者慎用。",
  },
  {
    match: /大黄|芒硝/,
    message:
      "⚠️ 含攻下药，中病即止，不宜久服。脾胃虚寒者忌用。",
  },
  {
    match: /附子/,
    message: "⚠️ 含附子。须炮制规范、先煎久煎。孕妇忌用，不宜与半夏、瓜蒌、贝母、白及同用。",
  },
];

export function assessRisk(text: string): RiskAssessment {
  for (const rule of HIGH_RISK_PATTERNS) {
    if (typeof rule.match === "string") {
      if (text.includes(rule.match)) return { level: "high", message: rule.message };
    } else {
      if (rule.match.test(text)) return { level: "high", message: rule.message };
    }
  }
  for (const rule of MED_RISK_PATTERNS) {
    if (typeof rule.match === "string") {
      if (text.includes(rule.match)) return { level: "medium", message: rule.message };
    } else {
      if (rule.match.test(text)) return { level: "medium", message: rule.message };
    }
  }
  return { level: "low", message: "" };
}

/** 检查一组症状关键词是否触发风险 */
export function assessSymptoms(symptoms: string[]): RiskAssessment {
  return assessRisk(symptoms.join(" "));
}
