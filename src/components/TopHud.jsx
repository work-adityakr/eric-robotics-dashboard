import React from 'react';
import { Pause, ArrowRight, Battery, Wifi, CheckCircle2 } from 'lucide-react';

export default function TopHud({ activeView, onViewToggle, mode, setMode }) {
  return (
    <header className="absolute top-4 left-20 right-6 flex items-center justify-between pointer-events-none z-30">
      {/* Left: Mission Pill & Quick Goal */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="bg-white/90 text-zinc-900 rounded-full px-4 py-1.5 flex items-center gap-3 text-xs font-semibold shadow-lg">
          <span>Status: <strong className="text-zinc-700">On Mission 1234</strong></span>
          <button className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700">
            <Pause size={10} />
          </button>
        </div>

        <button className="bg-white/90 hover:bg-white text-zinc-900 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shadow-lg transition">
          <span>QUICK GOAL</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Center: Health Diagnostics & Active View Badge */}
      <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
        <div className="bg-[#121620]/80 backdrop-blur-md border border-white/10 rounded-full px-5 py-1.5 flex items-center gap-4 text-[11px] font-medium text-zinc-200 shadow-xl">
          <div className="flex items-center gap-1 text-emerald-400">
            <Battery size={14} />
            <span>100%</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1 text-cyan-400">
            <Wifi size={14} />
            <span>Strong</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 size={13} />
            <span>Failsafe Okay</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 size={13} />
            <span>System Okay</span>
          </div>
        </div>

        {/* View Swapper Badge */}
        <button
          onClick={onViewToggle}
          className="bg-black/60 hover:bg-black/80 backdrop-blur border border-white/20 text-white rounded px-3 py-0.5 text-[10px] tracking-wide font-mono uppercase transition"
        >
          {activeView === 'camera' ? 'Camera View' : 'Map View'}
        </button>
      </div>

      {/* Right: Mode Switcher & Initiate */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="bg-white/90 p-1 rounded-full flex items-center gap-1 shadow-lg text-xs font-bold text-zinc-600">
          <button 
            onClick={() => setMode('AUTO')}
            className={`px-3 py-1 rounded-full transition ${mode === 'AUTO' ? 'bg-zinc-900 text-white' : 'hover:text-zinc-900'}`}
          >
            AUTO
          </button>
          <button 
            onClick={() => setMode('MANUAL')}
            className={`px-3 py-1 rounded-full transition ${mode === 'MANUAL' ? 'bg-zinc-900 text-white' : 'hover:text-zinc-900'}`}
          >
            MANUAL
          </button>
        </div>

        <button className="bg-white/90 hover:bg-white text-zinc-900 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold shadow-lg transition">
          <span>INITIATE</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </header>
  );
}