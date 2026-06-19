import { BookOpen, Video, Activity, FileText, Heart, Compass, LayoutDashboard, ChevronLeft, ChevronRight, Image } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse }: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: '体系总览', icon: LayoutDashboard },
    { id: 'classroom', label: '随堂教室', icon: Video },
    { id: 'formulas', label: '方证对比', icon: Compass },
    { id: 'six-meridians', label: '六经辨证', icon: Activity },
    { id: 'meridians', label: '腧穴经络', icon: BookOpen },
    { id: 'herbs', label: '草药性味', icon: Heart },
    { id: 'screenshots', label: '板书截图', icon: Image },
    { id: 'notes', label: '随堂笔记', icon: FileText },
  ];

  return (
    <aside 
      className={`bg-[#1A261F] text-[#FAF7F2] border-r border-[#2C3B32] transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      id="main-sidebar"
    >
      <div className="space-y-6" id="sidebar-top-group">
        
        {/* Scholar Banner logo info */}
        <div className="p-4 border-b border-[#24352A] flex items-center justify-between" id="sidebar-logo-block">
          {!collapsed ? (
            <div className="flex items-center space-x-2" id="sidebar-brand">
              <div className="w-8 h-8 rounded-lg bg-bento-accent flex items-center justify-center font-serif text-lg font-bold text-white shadow-md">
                岐
              </div>
              <div className="leading-tight">
                <div className="font-serif font-bold text-sm tracking-widest text-[#FAF7F2]">岐黄传习录</div>
                <div className="text-[9px] text-[#A6BFA3] font-sans">中医多维互动学堂</div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-bento-accent flex items-center justify-center font-serif text-lg font-bold text-white shadow-md">
              岐
            </div>
          )}

          {/* Collapse trigger button (only on desktop range, hidden on mobile) */}
          <button 
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded hover:bg-[#283C30] text-[#A6BFA3] transition-colors"
            id="collapse-toggle-btn"
            title={collapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar link nodes lists */}
        <nav className="px-3 space-y-1.5" id="nav-group-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center rounded-xl p-3 text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? 'bg-bento-accent text-white shadow-md font-bold'
                    : 'text-[#C9D6CE] hover:text-white hover:bg-[#283C30]'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                id={`sidebar-tab-lnk-${item.id}`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#8EA898]'}`} />
                {!collapsed && <span className="font-serif tracking-wider">{item.label}</span>}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Footer system details */}
      <div className="p-4 border-t border-[#24352A] text-center" id="sidebar-academic-footer">
        {!collapsed ? (
          <div className="bg-[#24352A] p-2.5 rounded-lg border border-dashed border-[#344E3E]" id="academic-credit-box">
            <span className="text-[10px] text-[#86A68D] block font-serif">学无止境 • 术精岐黄</span>
            <span className="text-[8px] text-stone-500 font-mono mt-0.5 block">中华典籍数智传习学堂</span>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto animate-ping" title="医理研习中"></div>
        )}
      </div>

    </aside>
  );
}
