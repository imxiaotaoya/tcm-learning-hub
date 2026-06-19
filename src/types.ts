export interface Blackboard {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  timestamp: string; // e.g. "12:34"
  category: string;
  points: { x: number; y: number; label: string; details: string }[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  seq: number;
  duration: string;
  completed: boolean;
  summary: string;
  content: string;
  videoUrl?: string;
  blackboards: Blackboard[];
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  description: string;
  lessons: Lesson[];
}

export interface FormulaHerb {
  herb: string;
  dose: string; // e.g. "9g" or "三两"
  function: string; // e.g. "君药", "臣药", "发汗解表"
}

export interface Formula {
  id: string;
  name: string;
  source: string; // e.g. "《伤寒论》"
  composition: FormulaHerb[];
  symptoms: string[]; // Key symptoms
  syndromes: string[]; // Applicable syndromes
  pathology: string; // 病因病机
  explanation: string; // 方义详解
  usage: string; // 煎服法
  blackboardId?: string; // Associated blackboard diagram
}

export interface Herb {
  id: string;
  name: string;
  pinyin: string;
  nature: '寒' | '微寒' | '大寒' | '热' | '温' | '微温' | '凉' | '平';
  taste: ('酸' | '苦' | '甘' | '辛' | '咸' | '涩' | '淡')[];
  meridians: string[]; // e.g. ["肺", "脾"]
  efficacy: string; // 功效
  indications: string; // 主治
  contraindications: string; // 使用注意
  classicFormulae: string[]; // e.g. ["桂枝汤"]
}

export interface Acupoint {
  id: string;
  name: string;
  pinyin: string;
  code: string; // e.g. "LU9"
  meridianId: string;
  location: string;
  indications: string; // 主治
  manipulation: string; // 针灸操作法
  x: number; // Graphic coordinate percentage (0 - 100)
  y: number; // Graphic coordinate percentage (0 - 100)
}

export interface Meridian {
  id: string;
  name: string;
  pinyin: string;
  type: '阴经' | '阳经';
  element: '木' | '火' | '土' | '金' | '水';
  system: '手' | '足';
  acupoints: Acupoint[];
  routeDescription: string;
}

export interface StudyNote {
  id: string;
  lessonId: string;
  lessonTitle: string;
  blackboardId?: string;
  blackboardAnchor?: string; // e.g. point ID or coordinate reference
  timestamp: string; // Created at string
  title: string;
  content: string;
}

export interface Progress {
  completedLessons: string[]; // Lesson IDs
  savedNotes: StudyNote[];
  vistedFormulas: string[]; // Formula IDs
  currentLessonId?: string;
}

export interface SixMeridianStage {
  id: string;
  name: string; // e.g. "太阳病"
  nature: string; // e.g. "表寒证"
  pathology: string; // 病机
  symptoms: string[]; // 主症
  pulseCondition: string; // 典型脉象
  classicFormulas: string[]; // 经典方剂
  therapeutics: string; // 治法
}
