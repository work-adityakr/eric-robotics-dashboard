import React from 'react';

export default function TeleopControls({ onDrive, onEStop, isEStopActive }) {
  return (
    <div className="absolute right-6 bottom-6 flex flex-col items-center gap-6 z-30 pointer-events-auto">
      {/* EMERGENCY STOP BUTTON (Yellow border, bold red inner) */}
      <button
        onClick={onEStop}
        className={`w-20 h-20 rounded-full border-[3px] border-yellow-400 p-1 flex items-center justify-center transition-transform active:scale-95 shadow-xl ${
          isEStopActive ? 'opacity-80 scale-95' : 'hover:scale-105'
        }`}
      >
        <div className="w-full h-full bg-[#e02424] rounded-full flex flex-col items-center justify-center text-white border-2 border-white/20">
          {/* Circular arrow icon */}
          <svg className="w-6 h-6 stroke-white stroke-[2.5] fill-none mb-0.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-[8px] font-black tracking-wider leading-none">EMERGENCY</span>
          <span className="text-[7px] font-bold tracking-widest leading-none mt-0.5">STOP</span>
        </div>
      </button>

      {/* CIRCULAR WASD D-PAD */}
      <div className="w-24 h-24 bg-[#1b222d] border border-white/10 rounded-full relative flex items-center justify-center shadow-2xl">
        {/* Forward Arrow (W) */}
        <button
          onClick={() => onDrive('FORWARD')}
          className="absolute top-1 text-zinc-400 hover:text-white p-1"
          title="Drive Forward (W)"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 4l-6 6h12z" />
          </svg>
        </button>

        {/* Left Arrow (A) */}
        <button
          onClick={() => onDrive('LEFT')}
          className="absolute left-1 text-zinc-400 hover:text-white p-1"
          title="Turn Left (A)"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M4 12l6-6v12z" />
          </svg>
        </button>

        {/* Center Key Label */}
        <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center text-zinc-900 shadow-inner">
          <span className="text-[9px] font-bold leading-none -mt-1">W</span>
          <div className="flex items-center justify-between w-full px-1.5 -my-0.5">
            <span className="text-[9px] font-bold">A</span>
            <span className="text-[7px] font-semibold text-zinc-400">key</span>
            <span className="text-[9px] font-bold">D</span>
          </div>
          <span className="text-[9px] font-bold leading-none -mb-1">S</span>
        </div>

        {/* Right Arrow (D) */}
        <button
          onClick={() => onDrive('RIGHT')}
          className="absolute right-1 text-zinc-400 hover:text-white p-1"
          title="Turn Right (D)"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M20 12l-6-6v12z" />
          </svg>
        </button>

        {/* Backward Arrow (S) */}
        <button
          onClick={() => onDrive('BACKWARD')}
          className="absolute bottom-1 text-zinc-400 hover:text-white p-1"
          title="Drive Backward (S)"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 20l-6-6h12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}