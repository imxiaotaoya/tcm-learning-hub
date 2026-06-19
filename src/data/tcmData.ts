import { Chapter, Formula, Herb, Meridian, SixMeridianStage, Blackboard } from '../types';

// ── Data bridge: re-export generated data from nihaisha pipeline ──
// These override the mock versions below when imported directly.
// Components should migrate to importing from './formulas', './lessons', etc.
export { formulas } from './formulas';
export { lessons } from './lessons';
export { chapters as tcmChaptersGen } from './chapters';
export { screenshots } from './screenshots';
export { sixMeridianStages as sixMeridianStagesGen } from './sixMeridianStages';
export { symptomRoutes } from './symptomRoutes';

// Mock Blackboard Screenshots representing teacher's chalk writings
export const mockBlackboards: Blackboard[] = [
  {
    id: "bb-guizhitang-1",
    title: "桂枝汤病机与辨证关系图",
    imageUrl: "chalkboard", // rendered dynamically with CSS/SVG
    description: "老师手绘：桂枝汤治太阳中风、营卫不和之核心病机图。图左侧为卫强（卫气浮盛），右侧为营弱（营阴不足），中央箭号指向营卫失调。圈出重点：发汗解肌、调和营卫。",
    timestamp: "18:45",
    category: "太阳病",
    points: [
      { x: 25, y: 30, label: "卫强", details: "卫气浮盛于外，肌表受风邪侵袭，翕翕发热。" },
      { x: 75, y: 30, label: "营弱", details: "营阴不能固守，汗自出。汗出则卫气更疏。" },
      { x: 50, y: 55, label: "营卫失调", details: "风邪袭表，卫强营弱，引起发热、恶风、汗出、脉浮缓。" },
      { x: 50, y: 80, label: "桂枝 + 白芍", details: "核心配伍，等量（如三两：三两）。桂枝助卫阳，白芍敛营阴，相须为用，调和营卫之圣药。" }
    ]
  },
  {
    id: "bb-guizhitang-2",
    title: "桂枝汤加减临证化裁",
    imageUrl: "chalkboard",
    description: "老师手绘：桂枝汤在伤寒论中的加减模型。展示加葛根、加厚朴杏子、去芍药、加附子等多种临床路径。",
    timestamp: "32:10",
    category: "伤寒化裁",
    points: [
      { x: 20, y: 35, label: "加葛根", details: "桂枝加葛根汤：治太阳病，项背强几几，反汗出恶风者。" },
      { x: 50, y: 35, label: "加厚朴杏子", details: "桂枝加厚朴杏子汤：治太阳病下之微喘者，表未解故也。" },
      { x: 80, y: 35, label: "去芍药", details: "桂枝去芍药汤：治太阳病下之后，脉促胸满者（去芍药防阻碍胸阳）。" },
      { x: 50, y: 75, label: "加附子", details: "桂枝加附子汤：治太阳病，发汗遂漏不止，其人恶风，小便难，四肢微急，难以屈伸者（温阳固表）。" }
    ]
  },
  {
    id: "bb-shaochuang-1",
    title: "少阳半表半里枢机枢转图",
    imageUrl: "chalkboard",
    description: "老师手绘：少阳枢机与小柴胡汤“往来寒热”机制。形象展示少阳为三阳之枢纽，处于太阳之表、阳明之间，邪气客于半表半里，枢机不利的病理轨迹。",
    timestamp: "14:20",
    category: "少阳病",
    points: [
      { x: 15, y: 45, label: "太阳之表", details: "开折机制，邪气入里未达里，抗争于半表" },
      { x: 85, y: 45, label: "阳明之里", details: "阖折机制，胃热里实。少阳介于其间" },
      { x: 50, y: 30, label: "少阳半表半里", details: "邪正交争于此，正胜则热，邪胜则寒，故见“往来寒热”。" },
      { x: 50, y: 70, label: "柴胡 + 黄芩", details: "经典药配：柴胡透泄半表之邪，黄芩清泄半里之热。疏利少阳枢机。" }
    ]
  },
  {
    id: "bb-yangming-1",
    title: "阳明三承气汤选用原则",
    imageUrl: "chalkboard",
    description: "老师板书：调胃承气汤、小承气汤、大承气汤在里实燥结阶段的量化对比与指征分析。",
    timestamp: "21:05",
    category: "阳明病",
    points: [
      { x: 25, y: 40, label: "调胃承气汤", details: "治胃气不和，谵语腹胀，燥热偏重者。药用大黄、甘草、芒硝（重在润燥和胃）。" },
      { x: 50, y: 40, label: "小承气汤", details: "治阳明里实，腹胀满，言谵语，脉滑而疾。药用大黄、厚朴、枳实（重在行气导滞）。" },
      { x: 75, y: 40, label: "大承气汤", details: "治阳明燥实痞满皆重者。药用大黄、芒硝、厚朴、枳实（痞、满、燥、实皆具，峻下热结）。" }
    ]
  }
];

// Course Structure & Curriculum
export const tcmChapters: Chapter[] = [
  {
    id: "ch-1",
    title: "《伤寒杂病论》太阳病辨治专题",
    order: 1,
    description: "本章重点讲解太阳病纲领、中风证与伤寒证的辨别，经典桂枝汤、麻黄汤的药组原理及多维加减法。",
    lessons: [
      {
        id: "l-1-1",
        chapterId: "ch-1",
        chapterTitle: "《伤寒杂病论》太阳病辨治专题",
        title: "第一课：辨太阳病脉证并治纲领与六经概念",
        seq: 1,
        duration: "45分钟",
        completed: true,
        summary: "学习《伤寒论》开篇第一条：‘太阳之为病，脉浮，头项强痛而恶寒。’掌握太阳病的核心特征、营卫卫国之机理，以及六经辨证的宏观医学框架。",
        content: "太阳主表，通连一身之阳。凡外邪侵袭，首当其冲者为太阳表证。本课结合六经气化理论，剖析‘脉浮’（病在表）、‘头项强痛’（经气不利）、‘恶寒’（卫阳被郁）之病机。",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // generic mock video trigger
        blackboards: [mockBlackboards[0]]
      },
      {
        id: "l-1-2",
        chapterId: "ch-1",
        chapterTitle: "《伤寒杂病论》太阳病辨治专题",
        title: "第二课：太阳中风证详解与桂枝汤方配伍奥秘",
        seq: 2,
        duration: "52分钟",
        completed: false,
        summary: "系统剖析太阳中风证‘发热、汗出、恶风、脉浮缓’的营卫失调机制。深入拆解‘群方之冠’桂枝汤的配伍比例，桂白一比一（三两对三两）调和阴阳的科学内涵。",
        content: "桂枝汤作为《伤寒论》第一方，并非单为汗剂。本课详解桂枝（辛甘温，助表阳以祛风）、白芍（苦酸微寒，敛营阴以恋汗）、甘草大枣生姜（培补中土，助化营卫）的精妙配合，揭示经典方剂的双向调节机理。",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        blackboards: [mockBlackboards[0], mockBlackboards[1]]
      }
    ]
  },
  {
    id: "ch-2",
    title: "阳明与少阳半表半里枢机治理",
    order: 2,
    description: "探讨由表入里、由热化燥的阳明阶段，以及胆气郁窒、枢机不利的少阳阶段代表性治疗思路。",
    lessons: [
      {
        id: "l-2-1",
        chapterId: "ch-2",
        chapterTitle: "阳明与少阳半表半里枢机治理",
        title: "第三课：阳明胃实证：三承气汤选用诀窍及里实燥结病机",
        seq: 3,
        duration: "50分钟",
        completed: false,
        summary: "讲解阳明热结，津伤燥结，胃腑不通之痞、满、燥、实表现。比较大、小、调胃承气汤在泻下热结中的力道、下药顺序及对胃气的保全机制。",
        content: "‘胃家实也’为阳明病提纲。燥实相合，必须釜底抽薪。本课对大黄（荡涤）、芒硝（软坚）、枳实厚朴（行气除满）的性味及煎药先后进行细致讲解，强调中医‘急下存阴’的极智用药艺术。",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        blackboards: [mockBlackboards[3]]
      },
      {
        id: "l-2-2",
        chapterId: "ch-2",
        chapterTitle: "阳明与少阳半表半里枢机治理",
        title: "第四课：少阳枢机不利证、黄疸水饮与小柴胡汤和解之妙",
        seq: 4,
        duration: "58分钟",
        completed: false,
        summary: "剖析少阳半表半里机制与口苦、咽干、目眩提纲。掌握小柴胡汤和解表里、舒畅三焦气机、运转全身气机的神妙法度。",
        content: "少阳介于太阳阳明之间，动一步则入里化燥，退一步则返表化解。邪犯少阳，则胆火横逆，脾胃不和。小柴胡汤用柴胡、黄芩和解清热，佐以参、夏、姜、枣、草扶正祛邪、调和中焦，使枢机运转自如。",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        blackboards: [mockBlackboards[2]]
      }
    ]
  }
];

// Classic TCM Formulas
export const classicFormulas: Formula[] = [
  {
    id: "f-guizhitang",
    name: "桂枝汤",
    source: "《伤寒论》",
    composition: [
      { herb: "桂枝", dose: "三两 (9g)", function: "君药，温助卫阳，散外寒，解肌发表" },
      { herb: "芍药", dose: "三两 (9g)", function: "臣药，益阴敛营，与桂枝相配调和营卫" },
      { herb: "生姜", dose: "三两 (9g)", function: "佐药，辛温，助桂枝散寒，和胃止呕" },
      { herb: "大枣", dose: "十二枚 (切)", function: "佐药，甘温，补中益气，助芍药和营" },
      { herb: "炙甘草", dose: "二两 (6g)", function: "使药，调和诸药，和中生津，减缓发汗" }
    ],
    symptoms: ["发热", "头痛", "汗出", "恶风", "鼻鸣", "干呕", "脉浮缓"],
    syndromes: ["太阳中风证", "营卫不和证", "产后中风表虚证", "外感风寒表虚证"],
    pathology: "外感风寒，卫强营弱，太阳表气不和，营卫失调。风邪袭表，卫气抗争则发热；卫气疏懈，营阴不能内守则汗自出；汗出则恶风、脉浮缓。",
    explanation: "方中桂枝辛甘温，温助表阳以祛风；芍药苦酸微寒，敛营阴以恋汗。两药用量相等（等量相须），一散一收，共调营卫。生姜之辛散和胃止呕，配大枣补中生津，炙甘草健脾调诸药。煮后需啜热稀粥，以助药力汗出，避开大汗，微似有汗即为最佳境界。",
    usage: "以水七升，微火煮取三升，去滓，温服一升。服后须臾，啜热稀粥一升许，以助药力。温覆令一时许，遍身㿠㿠微似有汗者益佳。禁冷、苦、粘、滑、肉、麦、菜、醋、奶、酒、五辛、臭物。",
    blackboardId: "bb-guizhitang-1"
  },
  {
    id: "f-mahuangtang",
    name: "麻黄汤",
    source: "《伤寒论》",
    composition: [
      { herb: "麻黄", dose: "三两 (9g)", function: "君药，辛温宣肺，开腠理，透泄毛窍发汗" },
      { herb: "桂枝", dose: "二两 (6g)", function: "臣药，解肌散寒，温通经络，协同麻黄发表" },
      { herb: "杏仁", dose: "七十个 (去皮)", function: "佐药，降肺气，平喘咳，与麻黄合宣降肺气" },
      { herb: "炙甘草", dose: "一两 (3g)", function: "使药，调和药性，缓和麻桂峻烈之发汗" }
    ],
    symptoms: ["发热", "恶寒甚", "无汗", "头痛", "身痛", "骨节酸痛", "喘逆", "脉浮紧"],
    syndromes: ["太阳伤寒表实证"],
    pathology: "外感寒邪，客于肌表，毛窍不通，谵卫阳受遏。寒邪乘虚入表，腠理闭塞，故无汗、恶寒严重、脉浮而发紧；经气受阻，故头身骨节剧烈痛痹；肺气憋闷不宣，则见胸闷、喘促。",
    explanation: "麻黄宣肺开表泄毛窍，解表之主。桂枝温通散表，引邪解肌。两药合用发汗力强，使外寒随汗而解。因肺主皮毛，宣肺需配合降肺之杏仁，一宣一降，宣肺平喘。用炙甘草缓诸药温散之烈，防津液过伤。全方辛温发汗，为解表峻剂。",
    usage: "以水九升，先煮麻黄去上沫。内诸药，煮取c升，去滓，温服八合。覆取微似汗，不须啜粥，余如桂枝法。",
    blackboardId: "bb-guizhitang-2"
  },
  {
    id: "f-xiaochaihutang",
    name: "小柴胡汤",
    source: "《伤寒论》",
    composition: [
      { herb: "柴胡", dose: "半斤 (24g)", function: "君药，苦温，透泄少阳半表之邪，疏肝胆郁结" },
      { herb: "黄芩", dose: "三两 (9g)", function: "臣药，苦寒，清泄少阳半里之胆火" },
      { herb: "半夏", dose: "半升 (12g)", function: "佐药，辛温，降逆和胃，止呕，去胸中痰水" },
      { herb: "生姜", dose: "三两 (9g)", function: "佐药，辛温，化痰饮，辅助少阳温运止呕" },
      { herb: "人参", dose: "三两 (9g)", function: "佐药，甘温，扶正祛邪，补胃气以防邪气内陷" },
      { herb: "大枣", dose: "十二枚 (切)", function: "佐药，益气健脾，辅助培土" },
      { herb: "甘草", dose: "三两 (9g)", function: "使药，调和药性，和中缓急" }
    ],
    symptoms: ["往来寒热", "胸胁苦满", "默默不欲饮食", "心烦喜呕", "口苦", "咽干", "目眩", "脉弦"],
    syndromes: ["少阳病本证", "妇人热入血室", "疟疾等"],
    pathology: "邪在少阳，处于太阳与阳明之间，邪正交争于半表半里。若正胜则发热，邪胜则恶寒，故见“往来寒热”。胆热循经上扰，则口苦、咽干、目眩。胆郁气逆压迫胃腑，则胸胁闷胀不欲食、干呕喜吐。",
    explanation: "方中柴胡为升散透邪之圣药，黄芩为清少阳里热之主。二药配合，透泄表里，和解少阳核心。半夏、生姜降逆和胃、止呕化痰。人参、甘草、大枣益气补胃，使里气足而外邪不能入里，且正气得助，鼓舞邪气透表而出。",
    usage: "以水一斗二升，煮取六升，去滓，再煎取三升，温服一升，日三服。",
    blackboardId: "bb-shaochuang-1"
  },
  {
    id: "f-dachengqitang",
    name: "大承气汤",
    source: "《伤寒论》",
    composition: [
      { herb: "大黄", dose: "四两 (酒洗)", function: "君药，苦寒泻热，攻积导滞" },
      { herb: "芒硝", dose: "三合", function: "臣药，咸寒，软坚润燥，协同大黄泄热下燥" },
      { herb: "厚朴", dose: "半斤 (炙)", function: "佐药，行气除满，通导肠胃积滞" },
      { herb: "枳实", dose: "五枚 (炙)", function: "佐药，破气消积，泻痞导满" }
    ],
    symptoms: ["谵语", "潮热", "狂躁", "手足濈然汗出", "腹胀痛拒按", "大便秘结", "舌质红苔焦黄起刺", "脉沉实有力"],
    syndromes: ["阳明腑实重证"],
    pathology: "阳明里实燥结，邪热与燥屎互结于大肠，胃腑气机不通，浊气上扰神明则谵语狂躁、潮热便秘。腹部饱胀，坚硬拒按。舌苔焦黄，脉沉实为里实重证。",
    explanation: "泻下热结峻剂。大黄配芒硝，硝黄合用燥屎可下、实热能泄。枳实、厚朴行气破滞，解除痞满，辅助硝黄，行气以退结。四药合用，痞、满、燥、实迎刃而解（痞、满解则肠道舒张；燥、实下则大便通畅）。",
    usage: "以水一斗，先煮枳、朴，取五升，内大黄，煮取二升。去滓，内芒硝，更上火微沸，分温再服。得下，余勿服。",
    blackboardId: "bb-yangming-1"
  }
];

// Detailed Herbs Property database
export const classicHerbs: Herb[] = [
  {
    id: "h-guizhi",
    name: "桂枝",
    pinyin: "Gui Zhi",
    nature: "温",
    taste: ["辛", "甘"],
    meridians: ["膀胱", "心", "肺"],
    efficacy: "发汗解肌，温通经脉，助阳化气。",
    indications: "风寒表虚之恶风、自汗；风寒表实之无汗、头痛身痛；心中悸动，水饮不化之水肿、小便不利；寒湿痹痛，少腹冷痛，经闭痃癖。",
    contraindications: "温热病、阴虚火旺、血热吐衄及孕妇胎动禁用。",
    classicFormulae: ["桂枝汤", "葛根汤", "五苓散"]
  },
  {
    id: "h-mahuang",
    name: "麻黄",
    pinyin: "Ma Huang",
    nature: "温",
    taste: ["辛", "苦"],
    meridians: ["肺", "膀胱"],
    efficacy: "发汗解表，宣肺平喘，利水消肿。",
    indications: "外感风寒表实证，恶寒甚无汗以致头身剧烈痛；肺气郁闭之喘咳；风水肿满；蜜炙用于表证已解之虚喘及久病喘促。",
    contraindications: "表虚自汗、阴虚盗汗、虚喘、肺肾两虚者慎用，心悸、失眠、高血压患者忌用。",
    classicFormulae: ["麻黄汤", "大青龙汤", "葛根汤"]
  },
  {
    id: "h-shaoyao",
    name: "白芍",
    pinyin: "Bai Shao",
    nature: "微寒",
    taste: ["苦", "酸"],
    meridians: ["肝", "脾"],
    efficacy: "养血调经，敛阴止汗，柔肝止痛，平抑肝阳。",
    indications: "血虚萎黄，月经不调，崩漏下血，阴虚盗汗，自汗不止；肝脾不和之脘腹挛痛；肝阳上亢之头晕目眩、抽搐痛痹。",
    contraindications: "虚寒之腹满、寒泻、腹冷者慎用。不宜与藜芦同用。",
    classicFormulae: ["桂枝汤", "小建中汤", "芍药甘草汤"]
  },
  {
    id: "h-dahuang",
    name: "大黄",
    pinyin: "Da Huang",
    nature: "寒",
    taste: ["苦"],
    meridians: ["脾", "胃", "大肠", "肝", "心包"],
    efficacy: "泻下攻积，清热写火，凉血解毒，逐瘀通经。",
    indications: "阳明里实，实火热结之便秘、腹痛胀满、谵语狂躁；火热亢盛之目赤、咽痛、吐血衄血；热毒疮疡、烫伤；瘀血阻滞、痛经、经闭。",
    contraindications: "凡表证未解、脾胃虚寒、血虚气弱、妊娠孕妇、哺乳期及月经期皆忌用或极为慎用。",
    classicFormulae: ["大承气汤", "小承气汤", "调胃承气汤", "大柴胡汤"]
  },
  {
    id: "h-chaihu",
    name: "柴胡",
    pinyin: "Chai Hu",
    nature: "微寒",
    taste: ["苦", "辛"],
    meridians: ["胆", "肝", "三焦", "极阴"],
    efficacy: "和解表里，疏肝解郁，升阳举陷。",
    indications: "少阳病之寒热往来、口苦目眩、胸胁苦满；肝气郁结之乳胀、痛经、胁肋胀痛、情绪抑郁；气虚下陷之胃下垂、子宫下垂、脱肛（配黄芪升阳）。",
    contraindications: "真阴亏损、肝阳上亢、阴虚火旺、肾水亏、气虚冲甚、吐血衄血、心火上升者不宜用。忌火或慎入重剂。",
    classicFormulae: ["小柴胡汤", "大柴胡汤", "逍遥散"]
  },
  {
    id: "h-huangqin",
    name: "黄芩",
    pinyin: "Huang Qin",
    nature: "寒",
    taste: ["苦"],
    meridians: ["肺", "胆", "胃", "大肠", "小肠"],
    efficacy: "清热燥湿，泻火解毒，止血，安胎。",
    indications: "湿温暑湿，中焦湿阻以致身热痞闷；热结便秘，湿热下痢；肺热咳嗽，高热烦渴；吐衄便血；胎动不安（炒用安胎圣药）。",
    contraindications: "脾胃虚寒、中焦寒饮者忌服。不宜与藜芦、牡丹皮、葱白同用。",
    classicFormulae: ["小柴胡汤", "半夏泻心汤", "葛根芩连汤"]
  }
];

// Interactive Meridians and Acupoints data (For SVG layout positioning)
export const classicMeridians: Meridian[] = [
  {
    id: "m-lung",
    name: "手太阴肺经",
    pinyin: "Shou Tai Yin Fei Jing",
    type: "阴经",
    element: "金",
    system: "手",
    routeDescription: "起始于中焦胃部，下行联络大肠，再回折沿着胃上口穿过膈肌入肺，横行出于腋下（中府穴），顺着手臂内侧前缘下行，经尺泽、列缺，止于大拇指桡侧端（少商穴）。",
    acupoints: [
      {
        id: "ap-lu1",
        name: "中府",
        pinyin: "Zhong Fu",
        code: "LU1",
        meridianId: "m-lung",
        location: "在胸前外上方，平第1肋间隙处，距前正中线6寸。",
        indications: "咳嗽，气喘，胸中胀痛，肩背痛。",
        manipulation: "向外斜刺0.5-0.8寸。不可深刺，防伤及肺脏引起气胸。",
        x: 42,
        y: 28
      },
      {
        id: "ap-lu5",
        name: "尺泽",
        pinyin: "Chi Ze",
        code: "LU5",
        meridianId: "m-lung",
        location: "在肘横纹中，肱二头肌腱桡侧凹陷处。",
        indications: "咳嗽，气喘，咯血，潮热，咽喉肿痛，肘臂挛痛。",
        manipulation: "直刺0.8-1.2寸，或点刺出血。",
        x: 48,
        y: 42
      },
      {
        id: "ap-lu7",
        name: "列缺",
        pinyin: "Lie Que",
        code: "LU7",
        meridianId: "m-lung",
        location: "桡骨茎突上方，腕横纹上1.5寸，两手虎口交叉，一手食指压在另一手桡骨茎突上，食指尖贴在凹陷处。",
        indications: "头痛，项强，咳嗽，气喘，牙痛，口眼歪斜。",
        manipulation: "向上斜刺0.3-0.5寸。",
        x: 52,
        y: 58
      },
      {
        id: "ap-lu9",
        name: "太渊",
        pinyin: "Tai Yuan",
        code: "LU9",
        meridianId: "m-lung",
        location: "在腕掌侧横纹桡侧，桡动脉搏动处。",
        indications: "咳嗽，气喘，咽痛，由于无脉症引起的血脉闭阻，胸痛。",
        manipulation: "避开桡动脉，直刺0.3-0.5寸。",
        x: 54,
        y: 65
      },
      {
        id: "ap-lu11",
        name: "少商",
        pinyin: "Shao Shang",
        code: "LU11",
        meridianId: "m-lung",
        location: "在手拇指末节外侧（桡侧），距指甲角0.1寸。",
        indications: "咽喉肿痛，发热，昏迷，癫狂。",
        manipulation: "浅刺0.1寸，或点刺放血（清热急救主穴）。",
        x: 58,
        y: 78
      }
    ]
  },
  {
    id: "m-bladder",
    name: "足太阳膀胱经",
    pinyin: "Zu Tai Yang Pang Guang Jing",
    type: "阳经",
    element: "水",
    system: "足",
    routeDescription: "起于眼内角（睛明穴），上连额部会于百会。背部下行分叉两支，主干沿着脊柱旁侧两路下达臀腰，止于足小趾外侧端（至阴穴）。背俞穴分布极密，为主治脏腑输转。气血充盈，主一身之表。",
    acupoints: [
      {
        id: "ap-bl1",
        name: "睛明",
        pinyin: "Jing Ming",
        code: "BL1",
        meridianId: "m-bladder",
        location: "目内眦角稍上方凹陷处。",
        indications: "目赤肿痛，迎风流泪，目眩，夜盲。",
        manipulation: "嘱患者闭目，左手推开眼球，右手直刺0.5-1.0寸，不揉不灸，防皮下出血。",
        x: 49,
        y: 12
      },
      {
        id: "ap-bl13",
        name: "肺俞",
        pinyin: "Fei Shu",
        code: "BL13",
        meridianId: "m-bladder",
        location: "在背部，当第3胸椎棘突下，旁开1.5寸。",
        indications: "咳嗽，气喘，潮热，盗汗，骨蒸，背痛。",
        manipulation: "斜刺0.5-0.8寸，不可深刺，防止气胸。",
        x: 46,
        y: 33
      },
      {
        id: "ap-bl23",
        name: "肾俞",
        pinyin: "Shen Shu",
        code: "BL23",
        meridianId: "m-bladder",
        location: "在腰部，当第2腰椎棘突下，旁开1.5寸。",
        indications: "遗尿，遗精，阳痿，月经不调，耳鸣，耳聋，腰痛，水肿。",
        manipulation: "直刺0.5-1.0寸，温和灸。",
        x: 46,
        y: 52
      },
      {
        id: "ap-bl40",
        name: "委中",
        pinyin: "Wei Zhong",
        code: "BL40",
        meridianId: "m-bladder",
        location: "在腘横纹中点，股二头肌腱与半腱肌腱中间。",
        indications: "腰背痛（‘腰背委中求’），下肢痿痹，腹痛，吐泻，小便不利。",
        manipulation: "直刺1-1.5寸，或用三棱针放血刺出血。",
        x: 48,
        y: 72
      },
      {
        id: "ap-bl67",
        name: "至阴",
        pinyin: "Zhi Yin",
        code: "BL67",
        meridianId: "m-bladder",
        location: "在足小趾外侧，距趾甲角0.1寸。",
        indications: "头痛，目痛，鼻塞，胎位不正（艾灸矫正胎位特效穴），难产。",
        manipulation: "浅刺0.1寸，或艾灸5-10分钟治疗胎位不正。",
        x: 52,
        y: 93
      }
    ]
  },
  {
    id: "m-stomach",
    name: "足阳明胃经",
    pinyin: "Zu Yang Ming Wei Jing",
    type: "阳经",
    element: "土",
    system: "足",
    routeDescription: "起于鼻翼旁，循面部上行额角，再下行沿颈部入胸腔缺盆，下膈络脾属胃。其外行线从乳头旁下经腹部走下肢大腿前外侧、膝盖，下循足背，止于第二足趾外侧端（厉兑穴）。气血多且热，主消化枢机。",
    acupoints: [
      {
        id: "ap-st36",
        name: "足三里",
        pinyin: "Zu San Li",
        code: "ST36",
        meridianId: "m-stomach",
        location: "在小腿前外侧，当犊鼻下3寸，距胫骨前缘一横指（中指）。",
        indications: "胃痛，腹胀，泄泻，便秘，呕吐，疳积，水肿，癫狂，下肢酸痛。全身保健强壮要穴。",
        manipulation: "直刺1.0-1.5寸，艾灸极佳，可增强免疫功能，补益脾胃。",
        x: 45,
        y: 74
      },
      {
        id: "ap-st25",
        name: "天枢",
        pinyin: "Tian Shu",
        code: "ST25",
        meridianId: "m-stomach",
        location: "在腹中部，距神阙（脐中）旁开2寸。",
        indications: "腹胀，泄泻，痢疾，便秘，腹痛，月经不调。",
        manipulation: "直刺1.0-1.5寸。",
        x: 45,
        y: 45
      }
    ]
  }
];

// Six Meridians Pathology stage specification
export const sixMeridianStages: SixMeridianStage[] = [
  {
    id: "stage-taiyang",
    name: "太阳病 (表证阶段)",
    nature: "表寒证/表虚中风",
    pathology: "风寒侵袭肌表，太阳经气被郁，卫气与寒邪抗争。邪在最表，太阳经脉不阻则头痛，人身之表被郁卫阳受阻则发热恶寒。",
    symptoms: ["恶寒或恶风", "发热", "头项强痛", "身痛", "骨节酸痛", "脉浮"],
    pulseCondition: "脉浮 (中风脉浮缓，伤寒脉浮紧)",
    classicFormulas: ["桂枝汤", "麻黄汤", "葛根汤"],
    therapeutics: "辛温发汗，辛温解表，调和营卫"
  },
  {
    id: "stage-yangming",
    name: "阳明病 (燥热实阶段)",
    nature: "里实热证/胃肠燥实",
    pathology: "病邪入里化热，损伤津液，燥热与结石结聚于消化道肠中。热邪充斥经络，或邪结胃腑不通。其气血极旺，易现燥热狂燥。",
    symptoms: ["高热 (日晡潮热)", "大汗出", "大渴引饮", "大便秘结", "腹痛胀满拒按", "谵语狂言"],
    pulseCondition: "脉洪大有力，或沉实有力",
    classicFormulas: ["白虎汤", "大承气汤", "小承气汤", "调胃承气汤"],
    therapeutics: "白虎清热 (苦寒清气分热)，承气釜底抽薪 (峻下热结)"
  },
  {
    id: "stage-shaoyang",
    name: "少阳病 (半表半里阶段)",
    nature: "枢机不利/胆经气郁",
    pathology: "病在半表半里。若邪犯少阳，胆火上炎，胆经气郁，胆胃失和，少阳枢机不利，病理正邪交争由此演化。",
    symptoms: ["往来寒热", "胸胁苦满", "默默不欲饮食", "口苦", "咽干", "目眩", "心烦喜呕"],
    pulseCondition: "脉弦 (主少阳，主气机郁结)",
    classicFormulas: ["小柴胡汤", "大柴胡汤", "柴胡桂枝汤"],
    therapeutics: "和解表里，疏泄少阳，和中清火"
  },
  {
    id: "stage-taiyin",
    name: "太阴病 (中焦虚寒阶段)",
    nature: "里虚寒证/脾胃胃阳虚",
    pathology: "三阴之始，属于脾胃虚寒。或由三阳误治传入。脾阳不足，寒湿内阻，气机不运，大肠运化失司。",
    symptoms: ["腹满而吐", "食不下", "自利益甚 (拉肚子)", "或时腹痛", "喜温喜按", "畏寒口不渴"],
    pulseCondition: "脉迟或缓而无力，舌苔白滑",
    classicFormulas: ["理中丸", "小建中汤", "四逆辈"],
    therapeutics: "温中健脾，散寒消饮"
  },
  {
    id: "stage-shaoyin",
    name: "少阴病 (心肾阳衰阶段)",
    nature: "里虚寒/里虚热等心肾两虚",
    pathology: "少阴属心肾。少阴有寒化和热化。寒化重在肾阳虚衰，阴寒盛越引发虚阳外越；热化为阴虚火旺。心肾衰惫，气血不足，人全身机能极度微弱。",
    symptoms: ["脉微细", "但欲寐 (精神萎靡只想躺着睡)", "四肢厥冷 (手脚凉透)", "恶寒蜷卧", "下利清谷 (完谷不化)", "或烦躁口渴(热化)"],
    pulseCondition: "脉微细欲绝",
    classicFormulas: ["四逆汤", "真武汤", "黄连阿胶汤", "通脉四逆汤"],
    therapeutics: "回阳救逆 (急温肾阳以化阴寒)，温阳利水"
  },
  {
    id: "stage-jueyin",
    name: "厥阴病 (寒热错杂厥逆阶段)",
    nature: "厥冷/寒热相争/阴阳错杂",
    pathology: "六经之尽，为肝与心包经。阴阳之气不相顺接，厥热往来，虚实交错。上焦有火，下焦有寒，表现寒热错杂、厥逆不调之象。",
    symptoms: ["消渴", "气上撞心", "心中疼热", "饥而不欲食", "食则吐蛔", "下利不止", "手足逆冷(厥)"],
    pulseCondition: "脉微涩或沉弦，忽滑忽迟",
    classicFormulas: ["乌梅丸", "当归四逆汤", "白头翁汤"],
    therapeutics: "温脏安蛔，温通经脉，清热止痢"
  }
];
