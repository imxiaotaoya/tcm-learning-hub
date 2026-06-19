import { useState } from 'react';
import { Herb } from '../types';
import { classicHerbs } from '../data/tcmData';
import { Sparkles, ShieldAlert, CheckCircle, Search, Heart, Plus, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HerbComparisonProps {
  initialSearchName?: string;
  onNavigateToFormulas: (formulaId: string) => void;
}

export default function HerbComparison({ initialSearchName, onNavigateToFormulas }: HerbComparisonProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchName || '');
  const [selectedNature, setSelectedNature] = useState<string>('all');
  const [selectedMeridian, setSelectedMeridian] = useState<string>('all');

  // Interactive Herbal Sandbox Prescription Box
  const [sandboxRx, setSandboxRx] = useState<Herb[]>([]);

  // Filter Herbs List
  const filteredHerbs = classicHerbs.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.pinyin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesNature = selectedNature === 'all' || h.nature === selectedNature;
    
    const matchesMeridian = selectedMeridian === 'all' || h.meridians.includes(selectedMeridian);
    
    return matchesSearch && matchesNature && matchesMeridian;
  });

  // Sandbox calculations
  const totalWeightStr = sandboxRx.length > 0 ? `${sandboxRx.length * 10}g` : '0g';
  
  // Dynamic nature balance formula
  let rxCompositionNature = '平调';
  if (sandboxRx.length > 0) {
    const hotCount = sandboxRx.filter(h => ['热', '温', '微温'].includes(h.nature)).length;
    const coldCount = sandboxRx.filter(h => ['寒', '微寒', '大寒'].includes(h.nature)).length;
    
    if (hotCount > 0 && coldCount > 0) {
      rxCompositionNature = '寒温并用, 攻补兼施';
    } else if (hotCount > 0) {
      rxCompositionNature = '温热辛散';
    } else if (coldCount > 0) {
      rxCompositionNature = '寒凉清热';
    } else {
      rxCompositionNature = '性味平稳';
    }
  }

  const handleAddToSandbox = (herb: Herb) => {
    if (sandboxRx.some(item => item.id === herb.id)) return; // Prevent duplicate
    setSandboxRx([...sandboxRx, herb]);
  };

  const handleRemoveFromSandbox = (herbId: string) => {
    setSandboxRx(sandboxRx.filter(item => item.id !== herbId));
  };

  const handleClearSandbox = () => {
    setSandboxRx([]);
  };

  return (
    <div className="space-y-6" id="herbs-comparer-root">
      
      {/* HEADER SECTION */}
      <div className="space-y-1 border-b border-bento-border pb-4" id="herbs-hdr">
        <h1 className="font-serif text-xl sm:text-2xl text-bento-ink font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-bento-accent" />
          中医本草药性对照表 &amp; 药材比勘体验台
        </h1>
        <p className="text-xs text-stone-500 font-serif">
          研读神农本草经性味配伍学说。利用下方比勘台过滤药性与归经气味，或直接挑选中药载入一侧沙盒中模拟复方配伍。
        </p>
      </div>

      {/* FILTERS HUD */}
      <div className="bg-bento-paper border border-bento-border p-4 rounded-xl flex flex-col md:flex-row items-center gap-4 justify-between shadow-xs" id="herbs-filters-hud">
        
        {/* Search bar */}
        <div className="relative w-full md:w-80" id="herb-search-box">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="搜索本草药名、拼音索引..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bento-bg border border-bento-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-bento-accent focus:ring-1 focus:ring-bento-accent transition-all text-bento-ink"
            id="herb-search-input"
          />
        </div>

        {/* Temperature selection dropdown */}
        <div className="flex gap-4 w-full md:w-auto" id="herb-dropdown-grids">
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <span className="text-xs text-stone-500 font-bold whitespace-nowrap">寒热温凉:</span>
            <select
              value={selectedNature}
              onChange={(e) => setSelectedNature(e.target.value)}
              className="bg-bento-bg text-bento-ink border border-bento-border rounded text-xs p-1.5 focus:outline-none focus:border-bento-accent flex-1 cursor-pointer"
              id="select-nature-filter"
            >
              <option value="all">全部药性(寒温凉属性)</option>
              <option value="温">温性 (温里散寒)</option>
              <option value="寒">寒性 (清里泻火)</option>
              <option value="微寒">微寒 (解肌清凉)</option>
              <option value="平">平性 (温和调和)</option>
            </select>
          </div>

          {/* Channels Entry selection dropdown */}
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <span className="text-xs text-stone-500 font-bold whitespace-nowrap">归经脏脑:</span>
            <select
              value={selectedMeridian}
              onChange={(e) => setSelectedMeridian(e.target.value)}
              className="bg-bento-bg text-bento-ink border border-bento-border rounded text-xs p-1.5 focus:outline-none focus:border-bento-accent flex-1 cursor-pointer"
              id="select-meridian-filter"
            >
              <option value="all">全部经络归属</option>
              <option value="肺">归肺经 (宣肺平喘)</option>
              <option value="脾">归脾经 (健脾运水)</option>
              <option value="胃">归胃经 (胃家积滞)</option>
              <option value="大肠">归大肠经 (下气攻积)</option>
              <option value="膀胱">归膀胱经 (太阳外卫)</option>
              <option value="胆">归胆经 (少阳枢转)</option>
            </select>
          </div>
        </div>

      </div>

      {/* CORE GRID: Table / Grid of Herbs AND the Sandbox Prescribing Box */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="herbs-workspace-cols">
         
        {/* HERBS LIST TABLE (8 cols) */}
        <div className="xl:col-span-8 bg-bento-paper border border-bento-border rounded-xl p-5 shadow-xs space-y-4" id="herbs-grid-col">
          <div className="flex justify-between items-center" id="herbs-tbl-hdr">
            <h3 className="font-serif font-bold text-bento-ink text-sm">
              本草经方性味对照总表 ({filteredHerbs.length})
            </h3>
            <span className="text-[10px] text-stone-500 font-serif">点击动作按钮，载入右侧配伍沙盒模拟配伍</span>
          </div>

          <div className="overflow-x-auto" id="herbs-table-scroll">
            <table className="w-full text-left border-collapse text-xs" id="herbs-data-table">
              <thead>
                <tr className="border-b border-bento-border bg-bento-bg text-stone-605" id="tbl-header-row">
                  <th className="py-2.5 px-3 font-serif font-bold">本草学名</th>
                  <th className="py-2.5 px-3 font-serif font-bold">药性温度</th>
                  <th className="py-2.5 px-3 font-serif font-bold">五味药质</th>
                  <th className="py-2.5 px-3 font-serif font-bold">适归经络</th>
                  <th className="py-2.5 px-3 font-serif font-bold">核心提纲功效</th>
                  <th className="py-2.5 text-center font-serif font-bold">配伍动作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bento-border bg-white" id="tbl-data-body">
                {filteredHerbs.length === 0 ? (
                  <tr id="empty-tr">
                    <td colSpan={6} className="py-8 text-center text-stone-400 font-serif">
                      未找到符合特定性味组合的本草中药。请重置筛选条件。
                    </td>
                  </tr>
                ) : (
                  filteredHerbs.map(h => (
                    <tr 
                      key={h.id} 
                      className="hover:bg-bento-bg/30 transition-colors"
                      id={`herb-row-${h.id}`}
                    >
                      <td className="py-3 px-3 font-medium">
                        <div className="font-serif text-bento-ink text-sm font-bold">{h.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">{h.pinyin}</div>
                      </td>
                      
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          ['寒', '微寒'].includes(h.nature)
                            ? 'bg-blue-50 border-blue-105 text-blue-700'
                            : ['热', '温'].includes(h.nature)
                            ? 'bg-[#FDF5F5] border-bento-accent/15 text-bento-accent'
                            : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}>
                          {h.nature}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-serif font-bold text-stone-700">
                        {h.taste.join('、')}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex gap-1 flex-wrap" id={`meridians-row-${h.id}`}>
                          {h.meridians.map(m => (
                            <span key={m} className="bg-stone-50 text-stone-600 border border-bento-border text-[10px] px-1.5 py-0.5 rounded font-serif font-bold">
                              {m}经
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-3 max-w-[200px]" title={h.indications}>
                        <div className="text-bento-ink font-serif font-bold truncate">{h.efficacy}</div>
                        <div className="text-[10px] text-stone-405 truncate mt-0.5 font-serif">{h.indications}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleAddToSandbox(h)}
                          disabled={sandboxRx.some(x => x.id === h.id)}
                          className={`p-1.5 rounded border transition-colors cursor-pointer ${
                            sandboxRx.some(x => x.id === h.id)
                              ? 'bg-stone-105 text-stone-400 border-stone-200 cursor-not-allowed'
                              : 'bg-[#FDF5F5] hover:bg-[#FDF5F5]/80 text-bento-accent border-bento-accent/25'
                          }`}
                          id={`add-sandbox-btn-${h.id}`}
                          title="将药材载入模拟配伍沙盒"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* HERBAL SANDBOX RX BOX (4 cols) */}
        <div className="xl:col-span-4 bg-bento-paper border border-bento-border p-5 rounded-xl space-y-5 shadow-xs flex flex-col justify-between" id="herbs-sandbox-col">
          
          <div className="space-y-4" id="sandbox-rx-top-group">
            <div className="border-b border-bento-border pb-3" id="sandbox-hdr">
              <span className="text-[10px] bg-[#FDF5F5] text-bento-accent font-bold border border-bento-accent/20 rounded px-2.5 py-0.5 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin text-bento-accent" /> 复方模拟实验室
              </span>
              <h3 className="font-serif text-bento-ink text-sm font-bold mt-1">
                中医药配伍配比体验台
              </h3>
            </div>

            {/* Sandbox empty guide */}
            {sandboxRx.length === 0 ? (
              <div className="border-2 border-dashed border-bento-border rounded-xl py-12 text-center text-stone-500 text-xs px-4 font-serif leading-relaxed" id="sandbox-empty">
                <Heart className="w-10 h-10 text-bento-border mx-auto mb-2 animate-pulse" />
                复药配位盒内尚未载入配方。<br/>请点击左表右端的 “+” 按钮调试君臣。
              </div>
            ) : (
              <div className="space-y-4" id="sandbox-list-and-stat">
                
                {/* Active sandbox items row */}
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1" id="sandbox-scroll">
                  <AnimatePresence>
                    {sandboxRx.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white border p-2.5 rounded-lg border-bento-border flex items-center justify-between"
                        id={`sandbox-item-${item.id}`}
                      >
                        <div className="text-left font-serif">
                          <span className="font-bold text-bento-ink text-sm">{item.name}</span>
                          <span className="text-[10px] text-stone-400 ml-1.5 font-mono">{item.pinyin}</span>
                          <div className="text-[10px] text-stone-500 mt-1">性味: {item.taste.join(' ')} | 适胃: {item.meridians.join('')}经</div>
                        </div>

                        <button
                          onClick={() => handleRemoveFromSandbox(item.id)}
                          className="text-stone-400 hover:text-bento-accent transition p-1 cursor-pointer"
                          id={`remove-sandbox-btn-${item.id}`}
                          title="移出方子"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Simulated Analysis matrix */}
                <div className="bg-white rounded-xl border border-bento-border p-4 space-y-3.5" id="rx-analysis-panel">
                  <h4 className="font-serif text-xs font-bold text-bento-accent border-b border-bento-border pb-1.5">
                    【模拟配伍机理剖析】
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs" id="sandbox-analysis-grid">
                    <div>
                      <div className="text-[10px] text-stone-500 font-bold font-serif">模拟总克重:</div>
                      <div className="font-serif font-bold text-bento-ink mt-0.5">{totalWeightStr}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-stone-500 font-bold font-serif">方中寒温倾向:</div>
                      <div className="font-serif font-bold text-bento-accent mt-0.5">{rxCompositionNature}</div>
                    </div>
                  </div>

                  {/* Targeted Channels analysis */}
                  <div className="space-y-1" id="sandbox-meridians-analysis">
                    <div className="text-[10px] text-stone-405 font-bold font-serif">主治归属经络面：</div>
                    <div className="flex gap-1 flex-wrap mt-1" id="sandbox-calculated-meridians">
                      {Array.from(new Set(sandboxRx.flatMap(h => h.meridians))).map(m => (
                        <span key={m} className="bg-stone-50 border border-bento-border text-bento-ink text-[10px] px-1.5 py-0.5 rounded font-bold font-serif">
                          {m}经
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fictional clinical advising */}
                  <div className="p-2.5 bg-stone-50 border border-bento-border rounded-lg text-[10px] text-stone-600 leading-normal font-serif" id="sandbox-advice">
                    <strong className="text-bento-accent font-bold">配伍药对智慧说：</strong><br/>
                    {sandboxRx.some(x => x.name === '桂枝') && sandboxRx.some(x => x.name === '白芍') ? (
                      <span className="text-bento-accent font-bold">✓ 检测到 桂枝-白芍 核心等量对药。符合太阳中风表虚，解肌发表、调和营卫基本纲领。</span>
                    ) : sandboxRx.some(x => x.name === '大黄') && sandboxRx.some(x => x.name === '黄芩') ? (
                      <span className="text-bento-accent font-bold">✓ 检测到 泻下泄热配比。契合中焦温病实热之“泻心”方义。</span>
                    ) : (
                      <span>建议配伍温透药引，辅以甘温缓和，使得配伍君臣相宜，攻不伤正、和不恋邪。</span>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Sandbox controls footer */}
          {sandboxRx.length > 0 && (
            <div className="flex gap-2 border-t border-bento-border pt-3 mt-4" id="sandbox-clear-row">
              <button
                onClick={handleClearSandbox}
                className="flex-1 bg-stone-100 hover:bg-stone-200 transition text-stone-700 text-xs py-2 rounded-lg font-bold cursor-pointer border border-bento-border"
                id="clear-sandbox-btn"
              >
                重设药材
              </button>
              
              <button
                onClick={() => onNavigateToFormulas(sandboxRx.some(x => x.name === '桂枝') ? 'f-guizhitang' : 'f-mahuangtang')}
                className="flex-1 bg-bento-accent hover:bg-rose-950 text-white transition text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer"
                id="link-related-formula-btn"
              >
                <span>对照经典方剂</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Safety and toxic notes list */}
      <div className="bg-bento-paper border border-bento-border p-4 rounded-xl flex gap-3 shadow-inner" id="herb-safety-bottom-banner">
        <ShieldAlert className="w-6 h-6 text-bento-accent flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="text-[11px] text-stone-605 leading-relaxed font-serif" id="safety-warning-rules">
          <strong className="text-bento-accent font-bold block mb-1">【中药配合“十八反十九畏”合规金针】：</strong> 
          经方本草，配合重于剂量。诸如乌头反半夏、甘草反甘遂，本比勘研究合流旨在探讨古典中藏本草组编奥秘。
          临床开方辨证，务必通过望、闻、问、切专业中医把关，随证裁减、适度因人而治，切勿按图索骥。
        </div>
      </div>

    </div>
  );
}
