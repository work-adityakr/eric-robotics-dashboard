import React from 'react';
import { LayoutGrid, Map, Navigation, Maximize2, Crosshair, TrendingUp, User } from 'lucide-react';

export default function NavigationSidebar() {
  const icons = [
    { icon: LayoutGrid, active: true },
    { icon: Map },
    { icon: Navigation },
    { icon: Maximize2 },
    { icon: Crosshair },
    { icon: TrendingUp },
  ];

  return (
    <aside className="absolute left-0 top-0 bottom-0 w-16 bg-[#0a0d14]/85 backdrop-blur-md border-r border-white/10 flex flex-col items-center py-5 z-40">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <span className="text-sm font-extrabold tracking-widest text-white">ERIC</span>
        <span className="text-[8px] font-semibold tracking-wider text-cyan-400 -mt-1">ROBOTICS</span>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex-1 flex flex-col gap-5">
        {icons.map(({ icon: Icon, active }, i) => (
          <button
            key={i}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              active 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={18} />
          </button>
        ))}
      </nav>

      {/* User Avatar */}
      <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white">
        <User size={18} />
      </button>
    </aside>
  );
}